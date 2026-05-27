import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/testing/mock_catalog.dart';
import 'package:mobile/theme/app_spacing.dart';

class CourseDetailScreen extends StatelessWidget {
  const CourseDetailScreen({super.key, required this.courseId});

  final String courseId;

  @override
  Widget build(BuildContext context) {
    final course = MockCatalog.courseById(courseId);

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
        title: Text(course?.name ?? 'Course'),
      ),
      body: course == null
          ? Center(child: Text('Unknown course: $courseId', style: Theme.of(context).textTheme.bodyLarge))
          : ListView(
              padding: const EdgeInsets.all(AppSpacing.containerPadding),
              children: [
                Text(course.name, style: Theme.of(context).textTheme.headlineSmall),
                const SizedBox(height: 8),
                Text('Code: ${course.code}', style: Theme.of(context).textTheme.bodyLarge),
                const SizedBox(height: 8),
                Text('Department: ${course.departmentId}', style: Theme.of(context).textTheme.bodyMedium),
                const SizedBox(height: 8),
                Text('Year: ${course.academicYear}', style: Theme.of(context).textTheme.bodyMedium),
                const SizedBox(height: 24),
                Text(
                  'Detail modules and resources will load from the API using this course id.',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ],
            ),
    );
  }
}
