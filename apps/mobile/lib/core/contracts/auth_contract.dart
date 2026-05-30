import 'dart:convert';

/// Mirrors `AuthUser` + login response from
/// [apps/frontend/src/api/auth.ts](../../../../frontend/src/api/auth.ts).
///
/// **Frozen fields** (do not rename without bumping [apiContractVersion]):
/// - `user.id`, `user.email`, `user.name`, `user.role`
/// - `accessToken` (JWT string from `POST /auth/login` and `POST /auth/register`)
final class AuthUser {
  const AuthUser({
    required this.id,
    required this.email,
    required this.name,
    required this.role,
  });

  final String id;
  final String email;
  final String name;

  /// `STUDENT` | `INSTRUCTOR` | `ADMIN` (uppercase, as returned by the API).
  final String role;

  Map<String, dynamic> toJson() => {
        'id': id,
        'email': email,
        'name': name,
        'role': role,
      };

  static AuthUser fromJson(Map<String, dynamic> json) {
    return AuthUser(
      id: json['id'] as String,
      email: json['email'] as String,
      name: json['name'] as String,
      role: json['role'] as String,
    );
  }

  static AuthUser? tryFromJsonString(String? raw) {
    if (raw == null || raw.isEmpty) return null;
    return AuthUser.fromJson(jsonDecode(raw) as Map<String, dynamic>);
  }

  String toJsonString() => jsonEncode(toJson());
}

/// Response body for `POST auth/login` and `POST auth/register` (access token only; refresh is httpOnly cookie on web).
final class LoginResponse {
  const LoginResponse({
    required this.accessToken,
    required this.user,
  });

  final String accessToken;
  final AuthUser user;

  factory LoginResponse.fromJson(Map<String, dynamic> json) {
    return LoginResponse(
      accessToken: json['accessToken'] as String,
      user: AuthUser.fromJson(json['user'] as Map<String, dynamic>),
    );
  }
}

final class StudentProfile {
  const StudentProfile({
    required this.studnetId,
    required this.academicYear,
    required this.departmentId,
  });

  final String studnetId;
  final int academicYear;
  final String departmentId;

  factory StudentProfile.fromJson(Map<String, dynamic> json) {
    final year = json['acadamicYear'] ?? json['academicYear'];
    return StudentProfile(
      studnetId: json['studnetId'] as String,
      academicYear: (year as num).toInt(),
      departmentId: json['departmentId'] as String,
    );
  }
}

final class CourseProgressCourse {
  const CourseProgressCourse({
    required this.name,
    required this.code,
    required this.academicYear,
  });

  final String name;
  final String code;
  final int academicYear;

  factory CourseProgressCourse.fromJson(Map<String, dynamic> json) {
    final year = json['acadamicYear'] ?? json['academicYear'];
    return CourseProgressCourse(
      name: json['name'] as String,
      code: json['code'] as String,
      academicYear: (year as num).toInt(),
    );
  }
}

final class CourseProgress {
  const CourseProgress({
    required this.courseId,
    required this.resourceViewed,
    required this.averageScore,
    required this.course,
  });

  final String courseId;
  final int resourceViewed;
  final double averageScore;
  final CourseProgressCourse course;

  factory CourseProgress.fromJson(Map<String, dynamic> json) {
    return CourseProgress(
      courseId: json['courseId'] as String,
      resourceViewed: (json['resourceViewed'] as num).toInt(),
      averageScore: (json['averageScore'] as num).toDouble(),
      course: CourseProgressCourse.fromJson(
        json['course'] as Map<String, dynamic>,
      ),
    );
  }
}

final class MeResponse {
  const MeResponse({
    required this.user,
    this.studentProfile,
    this.courseProgress = const [],
  });

  final AuthUser user;
  final StudentProfile? studentProfile;
  final List<CourseProgress> courseProgress;

  factory MeResponse.fromJson(Map<String, dynamic> json) {
    final progress = json['courseProgress'];
    return MeResponse(
      user: AuthUser.fromJson(json['user'] as Map<String, dynamic>),
      studentProfile: json['studentProfile'] is Map<String, dynamic>
          ? StudentProfile.fromJson(
              json['studentProfile'] as Map<String, dynamic>,
            )
          : null,
      courseProgress: progress is List
          ? progress
                .whereType<Map<String, dynamic>>()
                .map(CourseProgress.fromJson)
                .toList()
          : const [],
    );
  }
}
