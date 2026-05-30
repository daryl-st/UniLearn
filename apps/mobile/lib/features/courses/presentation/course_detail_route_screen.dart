import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/core/contracts/resource_contract.dart';
import 'package:mobile/core/providers/course_providers.dart';
import 'package:mobile/features/courses/presentation/course_detail_screen.dart';
import 'package:mobile/theme/color_tokens.dart';

extension ApiResourceMapper on ApiResource {
  LectureMaterial toLectureMaterial() {
    return LectureMaterial(
      id: id,
      title: title,
      type: type.toLowerCase(),
      pdfUrl: _resolveCloudinaryViewerUrl(fileUrl, type),
      size: '—',
    );
  }
}

String _resolveCloudinaryViewerUrl(String fileUrl, String type) {
  return fileUrl;
}

class CourseDetailRouteScreen extends ConsumerWidget {
  const CourseDetailRouteScreen({
    super.key,
    required this.courseId,
    required this.onBack,
  });

  final String courseId;
  final VoidCallback onBack;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final courseAsync = ref.watch(courseDetailProvider(courseId));
    final resourcesAsync = ref.watch(courseResourcesProvider(courseId));
    final dashboardAsync = ref.watch(studentDashboardProvider);

    return courseAsync.when(
      loading: () => const Scaffold(
        backgroundColor: ColorTokens.background,
        body: Center(child: CircularProgressIndicator()),
      ),
      error: (error, _) => Scaffold(
        backgroundColor: ColorTokens.background,
        appBar: AppBar(
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: onBack,
          ),
        ),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Text(error.toString()),
          ),
        ),
      ),
      data: (apiCourse) {
        return resourcesAsync.when(
          loading: () => const Scaffold(
            backgroundColor: ColorTokens.background,
            body: Center(child: CircularProgressIndicator()),
          ),
          error: (error, _) => Scaffold(
            backgroundColor: ColorTokens.background,
            appBar: AppBar(
              leading: IconButton(
                icon: const Icon(Icons.arrow_back),
                onPressed: onBack,
              ),
            ),
            body: Center(child: Text(error.toString())),
          ),
          data: (resources) {
            final summary = dashboardAsync.maybeWhen(
              data: (dashboard) => dashboard.progressByCourseId[courseId],
              orElse: () => null,
            );

            final totalModules = resources.length;
            final resourcesViewed = summary?.resourcesViewed ?? 0;
            final progressPercent = summary?.progressPercent ??
                (totalModules > 0
                    ? ((resourcesViewed / totalModules) * 100).round()
                    : 0);

            final averageScore = ref.watch(meProvider).maybeWhen(
              data: (me) {
                for (final row in me.courseProgress) {
                  if (row.courseId == courseId) {
                    return row.averageScore;
                  }
                }
                return null;
              },
              orElse: () => null,
            );

            final course = Course(
              id: courseId,
              title: apiCourse.name,
              code: apiCourse.code,
              progressPercentage: progressPercent,
              modulesCompleted: resourcesViewed,
              totalModules: totalModules,
              timeSpentHours: 0,
              averageGrade: averageScore != null
                  ? '${averageScore.round()}%'
                  : '—',
              badgesCount: 0,
              projectsCount: 0,
            );

            final materials = resources.map((r) => r.toLectureMaterial()).toList();

            return CourseDetailsScreen(
              course: course,
              materials: materials,
              onBack: onBack,
            );
          },
        );
      },
    );
  }
}
