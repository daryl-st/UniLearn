/// Mirrors `Course` from [packages/shared-types/src/Course.ts].
///
/// **Frozen fields** (do not rename without bumping [apiContractVersion]):
/// `id`, `name`, `code`, `instructorId`, `academicYear`, `departmentId`
///
/// Note: shared-types uses typo `acadamicYear`; mobile uses correct spelling
/// `academicYear` in Dart but JSON from API may still use `acadamicYear`.
final class ApiCourse {
  const ApiCourse({
    required this.id,
    required this.name,
    required this.code,
    required this.instructorId,
    required this.academicYear,
    required this.departmentId,
    this.instructorName,
  });

  final String id;
  final String name;
  final String code;
  final String instructorId;
  final int academicYear;
  final String departmentId;
  final String? instructorName;

  factory ApiCourse.fromJson(Map<String, dynamic> json) {
    final year = json['acadamicYear'] ?? json['academicYear'];
    return ApiCourse(
      id: json['id'] as String,
      name: json['name'] as String,
      code: json['code'] as String,
      instructorId: json['instructorId'] as String,
      academicYear: (year as num).toInt(),
      departmentId: json['departmentId'] as String,
      instructorName: json['instructorName'] as String?,
    );
  }

  /// UI-only hint; not part of API.
  String get displayLevel {
    if (name.toLowerCase().contains('advanced') || code.length > 6) {
      return 'Advanced';
    }
    return 'Intermediate';
  }
}
