import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/core/contracts/auth_contract.dart';
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

final class AuthSessionNotifier extends Notifier<AuthSessionState> {
  @override
  AuthSessionState build() => const AuthSessionState();

  SharedPreferences get _prefs => ref.read(sharedPreferencesProvider);

  Future<void> tryRestore() async {
    final token = _prefs.getString(_kAccessToken);
    final user = AuthUser.tryFromJsonString(_prefs.getString(_kUserJson));
    if (token != null && user != null) {
      state = AuthSessionState(accessToken: token, user: user);
    }
  }

  Future<void> signInWithMockCredentials({
    required String email,
    required String password,
  }) async {
    final user = AuthUser(
      id: 'mock-user-1',
      email: email,
      name: _displayNameFromEmail(email),
      role: 'STUDENT',
    );
    const token = 'mock_access_token_replace_with_login_response';
    state = AuthSessionState(accessToken: token, user: user);
    await _prefs.setString(_kAccessToken, token);
    await _prefs.setString(_kUserJson, user.toJsonString());
  }

  Future<void> registerWithMockCredentials({
    required String email,
    required String password,
  }) async {
    await signInWithMockCredentials(email: email, password: password);
  }

  Future<void> signOut() async {
    state = const AuthSessionState();
    await _prefs.remove(_kAccessToken);
    await _prefs.remove(_kUserJson);
  }

  bool get onboardingCompleted => _prefs.getBool(_kOnboardingDone) ?? false;

  Future<void> setOnboardingCompleted() async {
    await _prefs.setBool(_kOnboardingDone, true);
  }

  static String _displayNameFromEmail(String email) {
    final local = email.split('@').first;
    if (local.isEmpty) return 'Student';
    return '${local[0].toUpperCase()}${local.length > 1 ? local.substring(1) : ''}';
  }
}

final authSessionProvider =
    NotifierProvider<AuthSessionNotifier, AuthSessionState>(AuthSessionNotifier.new);
