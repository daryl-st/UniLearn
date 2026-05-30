import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/core/contracts/course_contract.dart';
import 'package:mobile/core/providers/course_providers.dart';
import 'package:mobile/features/courses/presentation/courses_screen.dart';
import 'package:mobile/theme/theme.dart';

const _testCourses = [
  ApiCourse(
    id: 'course-y2-a',
    name: 'Data Structures and Algorithms',
    code: 'COSC2210',
    instructorId: 'ins-1',
    academicYear: 2,
    departmentId: 'dept-1',
  ),
  ApiCourse(
    id: 'course-y2-b',
    name: 'Software Engineering',
    code: 'SENG2101',
    instructorId: 'ins-2',
    academicYear: 2,
    departmentId: 'dept-1',
  ),
  ApiCourse(
    id: 'course-y3-a',
    name: 'Database Systems',
    code: 'COSC3312',
    instructorId: 'ins-1',
    academicYear: 3,
    departmentId: 'dept-1',
  ),
];

void main() {
  testWidgets('Year 2 filter shows only year-2 courses', (tester) async {
    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          selectedCourseYearProvider.overrideWith((ref) => 2),
          courseCatalogProvider.overrideWith(
            (ref) async => _testCourses,
          ),
          studentDashboardProvider.overrideWith(
            (ref) async => const StudentDashboard(
              courseSummaries: [],
              progressByCourseId: {},
            ),
          ),
        ],
        child: MaterialApp(
          theme: AppTheme.dark,
          home: const CoursesScreen(),
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Data Structures and Algorithms'), findsOneWidget);
    expect(find.text('Software Engineering'), findsOneWidget);
    expect(find.text('Database Systems'), findsNothing);
  });

  testWidgets('Year 1 filter shows empty state', (tester) async {
    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          selectedCourseYearProvider.overrideWith((ref) => 1),
          courseCatalogProvider.overrideWith(
            (ref) async => _testCourses,
          ),
          studentDashboardProvider.overrideWith(
            (ref) async => const StudentDashboard(
              courseSummaries: [],
              progressByCourseId: {},
            ),
          ),
        ],
        child: MaterialApp(
          theme: AppTheme.dark,
          home: const CoursesScreen(),
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('No courses in Year 1'), findsOneWidget);
  });
}
