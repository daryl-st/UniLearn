/// Mirrors `Course` from [packages/shared-types/src/Course.ts](../../../../packages/shared-types/src/Course.ts).
///
/// **Frozen fields** (do not rename without bumping [apiContractVersion]):
/// `id`, `name`, `code`, `instructorId`, `academicYear`, `departmentId`
///
/// Note: shared-types uses typo `acadamicYear`; mobile uses correct spelling `academicYear`
/// in Dart but JSON from API may still use `acadamicYear` — add `fromJson` compatibility when wiring Dio.
final class ApiCourse {
  const ApiCourse({
    required this.id,
    required this.name,
    required this.code,
    required this.instructorId,
    required this.academicYear,
    required this.departmentId,
  });

  final String id;
  final String name;
  final String code;
  final String instructorId;
  final int academicYear;
  final String departmentId;

  /// UI-only hint for mocks; not part of API.
  String get displayLevel {
    if (name.toLowerCase().contains('advanced') || code.length > 6) return 'Advanced';
    return 'Intermediate';
  }
}
