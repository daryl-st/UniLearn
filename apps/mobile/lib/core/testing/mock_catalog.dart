import 'package:mobile/core/contracts/course_contract.dart';
import 'package:mobile/features/courses/presentation/course_detail_screen.dart';

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

/// Central demo catalog: courses, dashboard strings, lists.
abstract final class MockCatalog {
  static const greeting = 'Good morning';
  static const userFirstName = 'Alex';
  static const brandTitle = 'UniLearn';
  static const streakDays = 7;

  static const _dummyPdfUrl =
      'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

  static const List<ApiCourse> apiCourses = [
    ApiCourse(
      id: 'c1',
      name: 'Machine Learning',
      code: 'CS-ML-301',
      instructorId: 'ins-1',
      academicYear: 3,
      departmentId: 'CS',
    ),
    ApiCourse(
      id: 'c2',
      name: 'Linear Algebra',
      code: 'MATH-LA-210',
      instructorId: 'ins-2',
      academicYear: 2,
      departmentId: 'MATH',
    ),
    ApiCourse(
      id: 'c3',
      name: 'Data Mining',
      code: 'CS-DM-220',
      instructorId: 'ins-1',
      academicYear: 2,
      departmentId: 'CS',
    ),
    ApiCourse(
      id: 'c4',
      name: 'Advanced Neural Architecture Search',
      code: 'NN-AR-409',
      instructorId: 'ins-3',
      academicYear: 4,
      departmentId: 'CS',
    ),
    ApiCourse(
      id: 'c5',
      name: 'Transformers & Attention',
      code: 'DL-201',
      instructorId: 'ins-3',
      academicYear: 3,
      departmentId: 'CS',
    ),
    ApiCourse(
      id: 'c6',
      name: 'Adversarial Machine Learning',
      code: 'SEC-310',
      instructorId: 'ins-2',
      academicYear: 4,
      departmentId: 'CS',
    ),
  ];

  static ApiCourse? courseById(String id) {
    for (final c in apiCourses) {
      if (c.id == id) return c;
    }
    return null;
  }

  static List<ApiCourse> coursesForYear(int? year) {
    if (year == null) return List<ApiCourse>.from(apiCourses);
    return apiCourses.where((c) => c.academicYear == year).toList();
  }

  static const List<EnrolledCourseSummary> enrolledSummaries = [
    EnrolledCourseSummary(
      courseId: 'c1',
      modulesDone: 12,
      modulesTotal: 16,
      progressPercent: 75,
    ),
    EnrolledCourseSummary(
      courseId: 'c2',
      modulesDone: 4,
      modulesTotal: 10,
      progressPercent: 40,
    ),
    EnrolledCourseSummary(
      courseId: 'c3',
      modulesDone: 8,
      modulesTotal: 12,
      progressPercent: 66,
    ),
  ];

  static String get primaryEnrolledCourseId => enrolledSummaries.first.courseId;

  static const List<ActivityItem> recentActivity = [
    ActivityItem(
      title: 'Linear Algebra Notes.pdf',
      subtitle: 'Viewed 2h ago',
      iconLabel: 'pdf',
      courseId: 'c2',
      material: LectureMaterial(
        id: 'act-pdf-1',
        title: 'Linear Algebra Notes.pdf',
        type: 'pdf',
        sizeOrDuration: '2.3 MB',
        pdfUrl: _dummyPdfUrl,
      ),
    ),
    ActivityItem(
      title: 'Week 3 Slides.ppt',
      subtitle: 'Opened yesterday',
      iconLabel: 'ppt',
      courseId: 'c1',
      material: LectureMaterial(
        id: 'act-ppt-1',
        title: 'Week 3 Slides.ppt',
        type: 'ppt',
        sizeOrDuration: '4.1 MB',
        pdfUrl: _dummyPdfUrl,
      ),
    ),
    ActivityItem(
      title: 'Lab Worksheet.doc',
      subtitle: 'Downloaded 3d ago',
      iconLabel: 'doc',
      courseId: 'c3',
      material: LectureMaterial(
        id: 'act-doc-1',
        title: 'Lab Worksheet.doc',
        type: 'doc',
        sizeOrDuration: '890 KB',
        pdfUrl: _dummyPdfUrl,
      ),
    ),
    ActivityItem(
      title: 'Data Mining Quiz #1',
      subtitle: 'Completed yesterday',
      iconLabel: 'quiz',
      courseId: 'c3',
    ),
  ];

  static const List<StudyUpdateItem> studyUpdates = [
    StudyUpdateItem(
      title: 'New PDF added to Machine Learning',
      subtitle: 'Your instructor uploaded Week 4 lecture notes.',
      kind: 'instructor',
      courseId: 'c1',
    ),
    StudyUpdateItem(
      title: 'Summary generated for Linear Algebra notes',
      subtitle: 'Your AI summary is ready to review.',
      kind: 'system',
      courseId: 'c2',
    ),
    StudyUpdateItem(
      title: 'Quiz feedback ready',
      subtitle: 'Review incorrect answers for Data Mining Quiz #1.',
      kind: 'quiz',
      courseId: 'c3',
    ),
  ];
}
