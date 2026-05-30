import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/core/api/api_exception.dart';

void main() {
  group('ApiException.fromDio', () {
    test('maps network errors to reachability message', () {
      final error = DioException(
        requestOptions: RequestOptions(path: '/auth/login'),
        type: DioExceptionType.connectionError,
      );

      final result = ApiException.fromDio(error);
      expect(result.message, contains('Could not reach server'));
    });

    test('maps 401 to invalid credentials message', () {
      final error = DioException(
        requestOptions: RequestOptions(path: '/auth/login'),
        response: Response(
          requestOptions: RequestOptions(path: '/auth/login'),
          statusCode: 401,
          data: {'error': 'Unauthorized'},
        ),
        type: DioExceptionType.badResponse,
      );

      final result = ApiException.fromDio(error);
      expect(result.message, 'Invalid email or password.');
      expect(result.statusCode, 401);
    });

    test('maps validation details from 400 response', () {
      final error = DioException(
        requestOptions: RequestOptions(path: '/auth/register'),
        response: Response(
          requestOptions: RequestOptions(path: '/auth/register'),
          statusCode: 400,
          data: {
            'error': 'Validation Failed!',
            'details': [
              {'path': 'email', 'message': 'Invalid email address'},
            ],
          },
        ),
        type: DioExceptionType.badResponse,
      );

      final result = ApiException.fromDio(error);
      expect(result.message, 'Invalid email address');
      expect(result.statusCode, 400);
    });

    test('uses backend message field when present', () {
      final error = DioException(
        requestOptions: RequestOptions(path: '/auth/login'),
        response: Response(
          requestOptions: RequestOptions(path: '/auth/login'),
          statusCode: 403,
          data: {'message': 'No refresh token!'},
        ),
        type: DioExceptionType.badResponse,
      );

      final result = ApiException.fromDio(error);
      expect(result.message, 'No refresh token!');
    });

    test('HTML body returns generic server error, not raw HTML', () {
      final error = DioException(
        requestOptions: RequestOptions(path: '/auth/register'),
        response: Response(
          requestOptions: RequestOptions(path: '/auth/register'),
          statusCode: 500,
          data: '<!DOCTYPE html><html><body>Error</body></html>',
        ),
        type: DioExceptionType.badResponse,
      );

      final result = ApiException.fromDio(error);
      expect(result.message, 'Something went wrong on the server. Please try again.');
      expect(result.message, isNot(contains('<html')));
    });

    test('409 JSON message is passed through', () {
      final error = DioException(
        requestOptions: RequestOptions(path: '/auth/register'),
        response: Response(
          requestOptions: RequestOptions(path: '/auth/register'),
          statusCode: 409,
          data: {'message': 'Email already registered!'},
        ),
        type: DioExceptionType.badResponse,
      );

      final result = ApiException.fromDio(error);
      expect(result.message, 'Email already registered!');
      expect(result.statusCode, 409);
    });

    test('409 without message uses duplicate email fallback', () {
      final error = DioException(
        requestOptions: RequestOptions(path: '/auth/register'),
        response: Response(
          requestOptions: RequestOptions(path: '/auth/register'),
          statusCode: 409,
          data: '<html>conflict</html>',
        ),
        type: DioExceptionType.badResponse,
      );

      final result = ApiException.fromDio(error);
      expect(result.message, 'This email is already registered.');
    });
  });
}
