import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/core/api/api_exception.dart';
import 'package:mobile/core/contracts/course_contract.dart';
import 'package:mobile/core/contracts/resource_contract.dart';
import 'package:mobile/core/providers/dio_provider.dart';

final courseApiProvider = Provider<CourseApi>((ref) {
  return CourseApi(ref.watch(dioProvider));
});

class CourseApi {
  CourseApi(this._dio);

  final Dio _dio;

  Future<List<ApiCourse>> listCourses() async {
    try {
      final response = await _dio.get<List<dynamic>>('course/');
      final data = response.data;
      if (data == null) {
        throw ApiException('Invalid course list response.');
      }
      return data
          .whereType<Map<String, dynamic>>()
          .map(ApiCourse.fromJson)
          .toList();
    } on DioException catch (e) {
      throw ApiException.fromDio(e);
    }
  }

  Future<ApiCourse> getCourse(String id) async {
    try {
      final response = await _dio.get<Map<String, dynamic>>('course/$id');
      final data = response.data;
      if (data == null) {
        throw ApiException('Invalid course response.');
      }
      return ApiCourse.fromJson(data);
    } on DioException catch (e) {
      throw ApiException.fromDio(e);
    }
  }

  Future<List<ApiResource>> listResources(String courseId) async {
    try {
      final response = await _dio.get<List<dynamic>>(
        'course/resource',
        queryParameters: {'courseId': courseId},
      );
      final data = response.data;
      if (data == null) {
        throw ApiException('Invalid resources response.');
      }
      return data
          .whereType<Map<String, dynamic>>()
          .map(ApiResource.fromJson)
          .where((r) => !r.isDeleted)
          .toList();
    } on DioException catch (e) {
      throw ApiException.fromDio(e);
    }
  }

  Future<ApiResource> getResource(String id) async {
    try {
      final response = await _dio.get<Map<String, dynamic>>(
        'course/resources/$id',
      );
      final data = response.data;
      if (data == null) {
        throw ApiException('Invalid resource response.');
      }
      return ApiResource.fromJson(data);
    } on DioException catch (e) {
      throw ApiException.fromDio(e);
    }
  }
}
