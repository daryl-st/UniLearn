final class ApiResource {
  const ApiResource({
    required this.id,
    required this.title,
    required this.type,
    required this.fileUrl,
    required this.version,
    required this.isDeleted,
    required this.courseId,
    this.instructorId,
  });

  final String id;
  final String title;
  final String type;
  final String fileUrl;
  final num version;
  final bool isDeleted;
  final String courseId;
  final String? instructorId;

  factory ApiResource.fromJson(Map<String, dynamic> json) {
    return ApiResource(
      id: json['id'] as String,
      title: json['title'] as String,
      type: json['type'] as String,
      fileUrl: json['fileUrl'] as String,
      version: json['version'] as num? ?? 1,
      isDeleted: json['isDeleted'] as bool? ?? false,
      courseId: json['courseId'] as String,
      instructorId: json['instructorId'] as String?,
    );
  }
}
