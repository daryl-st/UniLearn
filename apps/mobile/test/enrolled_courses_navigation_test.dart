import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/routing/app_routes.dart';
import 'package:mobile/features/home/domain/home_models.dart';
import 'package:mobile/features/home/presentation/widgets/enrolled_courses_section.dart';
import 'package:mobile/theme/theme.dart';

void main() {
  testWidgets('Enrolled course tap pushes course detail route', (tester) async {
    const summaries = [
      CourseResourceSummary(
        courseId: 'course-y2-a',
        resourcesViewed: 2,
        resourcesTotal: 5,
        progressPercent: 40,
        title: 'Data Structures and Algorithms',
        code: 'COSC2210',
      ),
    ];

    final router = GoRouter(
      initialLocation: AppRoutes.home,
      routes: [
        GoRoute(
          path: AppRoutes.home,
          builder: (context, state) => const Scaffold(
            body: EnrolledCoursesSection(summaries: summaries),
          ),
        ),
        GoRoute(
          path: '${AppRoutes.courses}/:courseId',
          builder: (context, state) {
            final courseId = state.pathParameters['courseId']!;
            return Scaffold(body: Text('Course detail: $courseId'));
          },
        ),
      ],
    );

    await tester.pumpWidget(
      MaterialApp.router(
        theme: AppTheme.dark,
        routerConfig: router,
      ),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.text('Data Structures and Algorithms'));
    await tester.pumpAndSettle();

    expect(find.text('Course detail: course-y2-a'), findsOneWidget);
  });
}
