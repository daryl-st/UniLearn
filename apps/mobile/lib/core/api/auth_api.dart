import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/core/api/api_exception.dart';
import 'package:mobile/core/contracts/auth_contract.dart';
import 'package:mobile/core/providers/dio_provider.dart';

final authApiProvider = Provider<AuthApi>((ref) {
  return AuthApi(ref.watch(dioProvider));
});

class AuthApi {
  AuthApi(this._dio);

  final Dio _dio;

  Future<LoginResponse> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _dio.post<Map<String, dynamic>>(
        'auth/login',
        data: {'email': email, 'password': password},
      );
      return LoginResponse.fromJson(response.data!);
    } on DioException catch (e) {
      throw ApiException.fromDio(e);
    }
  }

  Future<LoginResponse> register({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
  }) async {
    try {
      final response = await _dio.post<Map<String, dynamic>>(
        'auth/register',
        data: {
          'email': email,
          'password': password,
          'role': 'STUDENT',
          'firstName': firstName,
          'lastName': lastName,
        },
      );
      return LoginResponse.fromJson(response.data!);
    } on DioException catch (e) {
      throw ApiException.fromDio(e);
    }
  }

  Future<MeResponse> fetchMe() async {
    try {
      final response = await _dio.get<Map<String, dynamic>>('auth/me');
      final data = response.data;
      if (data == null) {
        throw ApiException('Invalid session response from server.');
      }
      return MeResponse.fromJson(data);
    } on DioException catch (e) {
      throw ApiException.fromDio(e);
    }
  }

  @Deprecated('Use fetchMe()')
  Future<AuthUser> me() async {
    final response = await fetchMe();
    return response.user;
  }

  Future<void> logout() async {
    try {
      await _dio.post<void>('auth/logout');
    } on DioException catch (e) {
      if (e.response?.statusCode == 204) return;
      throw ApiException.fromDio(e);
    }
  }

  Future<String> refresh() async {
    try {
      final response = await _dio.post<Map<String, dynamic>>('auth/refresh');
      final token = response.data?['accessToken'];
      if (token is! String || token.isEmpty) {
        throw ApiException('Invalid refresh response from server.');
      }
      return token;
    } on DioException catch (e) {
      throw ApiException.fromDio(e);
    }
  }
}

/// Splits a display name into API first/last name fields.
({String firstName, String lastName}) splitFullName(String fullName) {
  final parts = fullName.trim().split(RegExp(r'\s+'));
  if (parts.isEmpty || parts.first.isEmpty) {
    return (firstName: 'Student', lastName: 'User');
  }
  final firstName = parts.first;
  final lastName = parts.length > 1 ? parts.sublist(1).join(' ') : 'User';
  return (firstName: firstName, lastName: lastName);
}
