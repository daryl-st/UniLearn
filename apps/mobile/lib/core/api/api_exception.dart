import 'package:dio/dio.dart';

class ApiException implements Exception {
  ApiException(this.message, {this.statusCode});

  final String message;
  final int? statusCode;

  static const int _maxBodyLength = 200;

  @override
  String toString() => message;

  factory ApiException.fromDio(DioException error) {
    final response = error.response;
    final status = response?.statusCode;
    final data = response?.data;

    if (_isNetworkError(error)) {
      return ApiException(
        'Could not reach server. Check API URL and network.',
        statusCode: status,
      );
    }

    if (status == 401) {
      return ApiException('Invalid email or password.', statusCode: status);
    }

    if (data is Map<String, dynamic>) {
      final details = data['details'];
      if (status == 400 && details is List && details.isNotEmpty) {
        final first = details.first;
        if (first is Map && first['message'] is String) {
          return ApiException(first['message'] as String, statusCode: status);
        }
      }

      final message = _sanitizeBody(data['message']);
      if (message != null) {
        return ApiException(message, statusCode: status);
      }

      final errorField = _sanitizeBody(data['error']);
      if (errorField != null) {
        return ApiException(errorField, statusCode: status);
      }
    }

    if (data is String) {
      final sanitized = _sanitizeBody(data);
      if (sanitized != null) {
        return ApiException(sanitized, statusCode: status);
      }
    }

    return ApiException(
      _fallbackMessage(status),
      statusCode: status,
    );
  }

  static bool _isNetworkError(DioException error) {
    return error.type == DioExceptionType.connectionError ||
        error.type == DioExceptionType.connectionTimeout ||
        error.type == DioExceptionType.receiveTimeout ||
        error.type == DioExceptionType.sendTimeout ||
        error.type == DioExceptionType.unknown &&
            error.response == null;
  }

  static String? _sanitizeBody(Object? raw) {
    if (raw is! String) return null;

    final trimmed = raw.trim();
    if (trimmed.isEmpty) return null;

    final lower = trimmed.toLowerCase();
    if (lower.startsWith('<!doctype') ||
        lower.startsWith('<html') ||
        lower.contains('<body')) {
      return null;
    }

    if (trimmed.length > _maxBodyLength) {
      return trimmed.substring(0, _maxBodyLength);
    }

    return trimmed;
  }

  static String _fallbackMessage(int? status) {
    switch (status) {
      case 500:
        return 'Something went wrong on the server. Please try again.';
      case 409:
        return 'This email is already registered.';
      default:
        return 'Request failed. Please try again.';
    }
  }
}
