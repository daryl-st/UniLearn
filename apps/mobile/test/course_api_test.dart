import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/core/api/course_api.dart';
import 'package:mobile/core/contracts/course_contract.dart';

class _FakeAdapter implements HttpClientAdapter {
  _FakeAdapter(this.handler);

  final Future<ResponseBody> Function(RequestOptions options) handler;

  @override
  void close({bool force = false}) {}

  @override
  Future<ResponseBody> fetch(
    RequestOptions options,
    Stream<List<int>>? requestStream,
    Future<void>? cancelFuture,
  ) {
    return handler(options);
  }
}

void main() {
  group('CourseApi', () {
    test('listCourses parses acadamicYear typo from backend', () async {
      final dio = Dio();
      dio.httpClientAdapter = _FakeAdapter((options) async {
        expect(options.path, 'course/');
        return ResponseBody.fromString(
          '''
[
  {
    "id": "abc",
    "name": "Artificial Intelligence",
    "code": "COSC4411",
    "instructorId": "ins-1",
    "acadamicYear": 4,
    "departmentId": "dept-1",
    "instructorName": "Dr. Jane Smith"
  }
]
''',
          200,
          headers: {
            Headers.contentTypeHeader: [Headers.jsonContentType],
          },
        );
      });

      final api = CourseApi(dio);
      final courses = await api.listCourses();

      expect(courses, hasLength(1));
      expect(courses.first, isA<ApiCourse>());
      expect(courses.first.academicYear, 4);
      expect(courses.first.instructorName, 'Dr. Jane Smith');
    });
  });
}
