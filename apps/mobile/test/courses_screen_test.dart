import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/core/testing/mock_catalog.dart';
import 'package:mobile/features/courses/presentation/courses_screen.dart';
import 'package:mobile/theme/theme.dart';

void main() {
  testWidgets('Year 2 filter shows only year-2 courses', (tester) async {
    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          selectedCourseYearProvider.overrideWith((ref) => 2),
        ],
        child: MaterialApp(
          theme: AppTheme.dark,
          home: const CoursesScreen(),
        ),
      ),
    );
    await tester.pumpAndSettle();

    final year2Courses = MockCatalog.coursesForYear(2);
    for (final course in year2Courses) {
      expect(find.text(course.name), findsOneWidget);
    }

    final otherCourses = MockCatalog.apiCourses
        .where((c) => c.academicYear != 2)
        .toList();
    for (final course in otherCourses) {
      expect(find.text(course.name), findsNothing);
    }
  });

  testWidgets('Year 1 filter shows empty state', (tester) async {
    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          selectedCourseYearProvider.overrideWith((ref) => 1),
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
