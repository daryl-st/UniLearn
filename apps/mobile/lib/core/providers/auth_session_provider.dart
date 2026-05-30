import 'package:cookie_jar/cookie_jar.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/core/api/auth_token_store.dart';
import 'package:mobile/core/api/api_exception.dart';
import 'package:mobile/core/api/auth_api.dart';
import 'package:mobile/core/contracts/auth_contract.dart';
import 'package:mobile/core/providers/dio_provider.dart';
import 'package:mobile/core/providers/shared_preferences_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

const _kAccessToken = 'unilearn_access_token';
const _kUserJson = 'unilearn_user_json';
const _kOnboardingDone = 'unilearn_onboarding_done';

@immutable
class AuthSessionState {
  const AuthSessionState({this.accessToken, this.user});

  final String? accessToken;
  final AuthUser? user;

  bool get isAuthenticated =>
      accessToken != null && accessToken!.isNotEmpty && user != null;
}

class AuthSessionNotifier extends Notifier<AuthSessionState> {
  @override
  AuthSessionState build() => const AuthSessionState();

  SharedPreferences get _prefs => ref.read(sharedPreferencesProvider);
  AuthApi get _authApi => ref.read(authApiProvider);
  AuthTokenStore get _tokenStore => ref.read(authTokenStoreProvider);
  CookieJar get _cookieJar => ref.read(cookieJarProvider);

  Future<void> tryRestore() async {
    final token = _prefs.getString(_kAccessToken);
    final user = AuthUser.tryFromJsonString(_prefs.getString(_kUserJson));
    if (token == null || user == null) return;

    _tokenStore.setToken(token);
    state = AuthSessionState(accessToken: token, user: user);

    try {
      final freshUser = await _authApi.me();
      await _persistSession(token: token, user: freshUser);
    } on ApiException catch (e) {
      if (e.statusCode == 401) {
        await _clearLocalSession();
      }
    } catch (_) {
      // Keep cached session when offline or server unreachable.
    }
  }

  Future<void> signIn({
    required String email,
    required String password,
  }) async {
    final response = await _authApi.login(email: email, password: password);
    await _applyLoginResponse(response);
  }

  Future<void> register({
    required String email,
    required String password,
    required String fullName,
  }) async {
    final nameParts = splitFullName(fullName);
    final response = await _authApi.register(
      email: email,
      password: password,
      firstName: nameParts.firstName,
      lastName: nameParts.lastName,
    );
    await _applyLoginResponse(response);
  }

  Future<void> signOut() async {
    try {
      await _authApi.logout();
    } catch (_) {
      // Clear local session even if logout request fails.
    }
    await _clearLocalSession();
  }

  bool get onboardingCompleted => _prefs.getBool(_kOnboardingDone) ?? false;

  Future<void> setOnboardingCompleted() async {
    await _prefs.setBool(_kOnboardingDone, true);
  }

  Future<void> _applyLoginResponse(LoginResponse response) async {
    _tokenStore.setToken(response.accessToken);
    await _persistSession(token: response.accessToken, user: response.user);
  }

  Future<void> _persistSession({
    required String token,
    required AuthUser user,
  }) async {
    state = AuthSessionState(accessToken: token, user: user);
    await _prefs.setString(_kAccessToken, token);
    await _prefs.setString(_kUserJson, user.toJsonString());
  }

  Future<void> _clearLocalSession() async {
    _tokenStore.clear();
    await _cookieJar.deleteAll();
    state = const AuthSessionState();
    await _prefs.remove(_kAccessToken);
    await _prefs.remove(_kUserJson);
  }
}

final authSessionProvider =
    NotifierProvider<AuthSessionNotifier, AuthSessionState>(
      AuthSessionNotifier.new,
    );
