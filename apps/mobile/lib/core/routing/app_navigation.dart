import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/routing/app_routes.dart';
import 'package:mobile/features/courses/presentation/course_detail_screen.dart';

extension AppNavigation on BuildContext {
  void goToCoursesTab() => go(AppRoutes.courses);

  void goToStatsTab() => go(AppRoutes.stats);

  void openCourseDetail(String courseId) =>
      push(AppRoutes.courseDetail(courseId));

  void openPdfMaterial(LectureMaterial material) =>
      push(AppRoutes.pdfViewer, extra: material);
}
