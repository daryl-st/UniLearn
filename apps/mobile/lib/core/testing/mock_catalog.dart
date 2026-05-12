import 'package:mobile/core/contracts/course_contract.dart';

// --- Dashboard-only view models (not API DTOs; OK to evolve with UI) ---

final class EnrolledCourseSummary {
  const EnrolledCourseSummary({
    required this.courseId,
    required this.modulesDone,
    required this.modulesTotal,
    required this.progressPercent,
  });

  final String courseId;
  final int modulesDone;
  final int modulesTotal;
  final int progressPercent;
}

final class AiTaskSuggestion {
  const AiTaskSuggestion({
    required this.title,
    required this.body,
  });

  final String title;
  final String body;
}

final class ActivityItem {
  const ActivityItem({
    required this.title,
    required this.subtitle,
    required this.iconLabel,
  });

  final String title;
  final String subtitle;
  final String iconLabel;
}

final class DeadlineItem {
  const DeadlineItem({
    required this.title,
    required this.dateLabel,
    required this.urgency,
    required this.accentIsWarm,
  });

  final String title;
  final String dateLabel;
  final String urgency;
  final bool accentIsWarm;
}

/// Central demo catalog: courses, dashboard strings, lists. Import this instead of per-feature duplicates.
abstract final class MockCatalog {
  static const greeting = 'Good morning';
  static const userFirstName = 'Alex';
  static const brandTitle = 'UniLearn';
  static const streakDays = 7;

  static const List<ApiCourse> apiCourses = [
    ApiCourse(
      id: 'c1',
      name: 'Machine Learning',
      code: 'CS-ML-301',
      instructorId: 'ins-1',
      academicYear: 2025,
      departmentId: 'CS',
    ),
    ApiCourse(
      id: 'c2',
      name: 'Linear Algebra',
      code: 'MATH-LA-210',
      instructorId: 'ins-2',
      academicYear: 2025,
      departmentId: 'MATH',
    ),
    ApiCourse(
      id: 'c3',
      name: 'Data Mining',
      code: 'CS-DM-220',
      instructorId: 'ins-1',
      academicYear: 2025,
      departmentId: 'CS',
    ),
    ApiCourse(
      id: 'c4',
      name: 'Advanced Neural Architecture Search',
      code: 'NN-AR-409',
      instructorId: 'ins-3',
      academicYear: 2025,
      departmentId: 'CS',
    ),
    ApiCourse(
      id: 'c5',
      name: 'Transformers & Attention',
      code: 'DL-201',
      instructorId: 'ins-3',
      academicYear: 2025,
      departmentId: 'CS',
    ),
    ApiCourse(
      id: 'c6',
      name: 'Adversarial Machine Learning',
      code: 'SEC-310',
      instructorId: 'ins-2',
      academicYear: 2025,
      departmentId: 'CS',
    ),
  ];

  static ApiCourse? courseById(String id) {
    for (final c in apiCourses) {
      if (c.id == id) return c;
    }
    return null;
  }

  static const List<EnrolledCourseSummary> enrolledSummaries = [
    EnrolledCourseSummary(courseId: 'c1', modulesDone: 12, modulesTotal: 16, progressPercent: 75),
    EnrolledCourseSummary(courseId: 'c2', modulesDone: 4, modulesTotal: 10, progressPercent: 40),
    EnrolledCourseSummary(courseId: 'c3', modulesDone: 8, modulesTotal: 12, progressPercent: 66),
  ];

  static const AiTaskSuggestion aiSuggestion = AiTaskSuggestion(
    title: 'AI recommended task',
    body:
        'Summarize yesterday\'s lecture slides for ML. We found 3 concepts from Intro to Neural Networks that may need reinforcement.',
  );

  static const List<ActivityItem> recentActivity = [
    ActivityItem(title: 'Linear Algebra Notes.pdf', subtitle: 'Viewed 2h ago', iconLabel: 'pdf'),
    ActivityItem(title: 'Neural Networks L3', subtitle: 'Watched 5h ago', iconLabel: 'video'),
    ActivityItem(title: 'Data Mining Quiz #1', subtitle: 'Completed yesterday', iconLabel: 'quiz'),
  ];

  static const List<DeadlineItem> deadlines = [
    DeadlineItem(title: 'ML Mid-term Quiz', dateLabel: 'OCT 24', urgency: 'Ends in 6 hours', accentIsWarm: true),
    DeadlineItem(title: 'Data Lab Assignment', dateLabel: 'OCT 27', urgency: '3 days remaining', accentIsWarm: false),
  ];
}
