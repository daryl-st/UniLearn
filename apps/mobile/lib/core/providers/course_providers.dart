import 'dart:math';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/core/api/auth_api.dart';
import 'package:mobile/core/api/course_api.dart';
import 'package:mobile/core/contracts/auth_contract.dart';
import 'package:mobile/core/contracts/course_contract.dart';
import 'package:mobile/core/contracts/resource_contract.dart';
import 'package:mobile/core/providers/auth_session_provider.dart';
import 'package:mobile/features/home/domain/home_models.dart';

final courseCatalogProvider = FutureProvider<List<ApiCourse>>((ref) async {
  final api = ref.watch(courseApiProvider);
  return api.listCourses();
});

final courseDetailProvider = FutureProvider.family<ApiCourse, String>((
  ref,
  courseId,
) async {
  final api = ref.watch(courseApiProvider);
  return api.getCourse(courseId);
});

final courseResourcesProvider =
    FutureProvider.family<List<ApiResource>, String>((ref, courseId) async {
      final api = ref.watch(courseApiProvider);
      return api.listResources(courseId);
    });

final meProvider = FutureProvider<MeResponse>((ref) async {
  final auth = ref.watch(authSessionProvider);
  if (!auth.isAuthenticated) {
    throw StateError('Not authenticated');
  }
  return ref.watch(authApiProvider).fetchMe();
});

final class StudentDashboard {
  const StudentDashboard({
    required this.courseSummaries,
    required this.progressByCourseId,
    this.primaryCourseId,
  });

  /// All catalog courses with optional resource-view progress.
  final List<CourseResourceSummary> courseSummaries;
  final Map<String, CourseResourceSummary> progressByCourseId;
  final String? primaryCourseId;

  @Deprecated('Use courseSummaries')
  List<CourseResourceSummary> get enrolledSummaries => courseSummaries;
}

final studentDashboardProvider = FutureProvider<StudentDashboard>((ref) async {
  final auth = ref.watch(authSessionProvider);
  if (!auth.isAuthenticated) {
    return const StudentDashboard(
      courseSummaries: [],
      progressByCourseId: {},
    );
  }

  final catalog = await ref.watch(courseCatalogProvider.future);
  final me = await ref.watch(meProvider.future);
  final courseApi = ref.watch(courseApiProvider);

  final progressByCourseId = {
    for (final row in me.courseProgress) row.courseId: row,
  };

  final summaries = <CourseResourceSummary>[];
  final byId = <String, CourseResourceSummary>{};

  for (final course in catalog) {
    final resources = await courseApi.listResources(course.id);
    final progress = progressByCourseId[course.id];
    final total = resources.length;
    final viewed = progress?.resourceViewed ?? 0;
    final done = total > 0 ? min(viewed, total) : viewed;
    final percent = total > 0 ? ((done / total) * 100).round() : 0;

    final summary = CourseResourceSummary(
      courseId: course.id,
      resourcesViewed: done,
      resourcesTotal: total,
      progressPercent: percent,
      title: course.name,
      code: course.code,
    );
    summaries.add(summary);
    byId[course.id] = summary;
  }

  final primaryWithViews = summaries
      .where((s) => s.resourcesViewed > 0)
      .toList(growable: false);

  return StudentDashboard(
    courseSummaries: summaries,
    progressByCourseId: byId,
    primaryCourseId: primaryWithViews.isNotEmpty
        ? primaryWithViews.first.courseId
        : (summaries.isNotEmpty ? summaries.first.courseId : null),
  );
});

List<ApiCourse> coursesForYear(List<ApiCourse> courses, int? year) {
  if (year == null) return courses;
  return courses.where((c) => c.academicYear == year).toList();
}
