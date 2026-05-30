import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/routing/app_routes.dart';
import 'package:mobile/core/testing/mock_catalog.dart';
import 'package:mobile/features/home/presentation/widgets/enrolled_courses_section.dart';
import 'package:mobile/theme/theme.dart';

void main() {
  testWidgets('Enrolled course tap pushes course detail route', (tester) async {
    final router = GoRouter(
      initialLocation: AppRoutes.home,
      routes: [
        GoRoute(
          path: AppRoutes.home,
          builder: (context, state) => Scaffold(
            body: EnrolledCoursesSection(
              summaries: MockCatalog.enrolledSummaries,
            ),
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

    final firstCourse = MockCatalog.courseById(
      MockCatalog.enrolledSummaries.first.courseId,
    )!;
    await tester.tap(find.text(firstCourse.name));
    await tester.pumpAndSettle();

    expect(
      find.text('Course detail: ${firstCourse.id}'),
      findsOneWidget,
    );
  });
}
