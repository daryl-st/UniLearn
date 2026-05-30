import 'package:mobile/features/courses/presentation/course_detail_screen.dart';

/// Course card on home / stats — progress is resource views, not LMS enrollment.
final class CourseResourceSummary {
  const CourseResourceSummary({
    required this.courseId,
    required this.resourcesViewed,
    required this.resourcesTotal,
    required this.progressPercent,
    this.title,
    this.code,
  });

  final String courseId;
  final int resourcesViewed;
  final int resourcesTotal;
  final int progressPercent;
  final String? title;
  final String? code;

  @Deprecated('Use resourcesViewed')
  int get modulesDone => resourcesViewed;

  @Deprecated('Use resourcesTotal')
  int get modulesTotal => resourcesTotal;
}

/// @deprecated Use [CourseResourceSummary]
typedef EnrolledCourseSummary = CourseResourceSummary;

final class ActivityItem {
  const ActivityItem({
    required this.title,
    required this.subtitle,
    required this.iconLabel,
    this.courseId,
    this.material,
  });

  final String title;
  final String subtitle;

  /// `pdf` | `ppt` | `doc` | `quiz`
  final String iconLabel;
  final String? courseId;
  final LectureMaterial? material;
}

final class StudyUpdateItem {
  const StudyUpdateItem({
    required this.title,
    required this.subtitle,
    required this.kind,
    this.courseId,
  });

  final String title;
  final String subtitle;

  /// `instructor` | `system` | `quiz`
  final String kind;
  final String? courseId;
}
