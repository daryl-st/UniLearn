import 'package:flutter/material.dart';

import 'package:mobile/core/testing/mock_catalog.dart';
import 'package:mobile/theme/app_radii.dart';

class EnrolledCoursesSection extends StatelessWidget {
  const EnrolledCoursesSection({super.key, required this.summaries});

  final List<EnrolledCourseSummary> summaries;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return SizedBox(
      height: 168,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: summaries.length,
        separatorBuilder: (context, index) => const SizedBox(width: 12),
        itemBuilder: (context, i) {
          final s = summaries[i];
          final course = MockCatalog.courseById(s.courseId);
          final title = course?.name ?? 'Course';
          final subtitle = course?.code ?? 'Course code';
          return SizedBox(
            width: 220,
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: scheme.surfaceContainerLow,
                borderRadius: BorderRadius.circular(AppRadii.lg),
                border: Border.all(color: scheme.outlineVariant.withValues(alpha: 0.35)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.school_outlined, color: scheme.secondary, size: 22),
                      const Spacer(),
                      SizedBox(
                        width: 44,
                        height: 44,
                        child: Stack(
                          alignment: Alignment.center,
                          children: [
                            CircularProgressIndicator(
                              value: s.progressPercent / 100,
                              strokeWidth: 3,
                              backgroundColor: scheme.surfaceContainerHigh,
                              color: scheme.primary,
                            ),
                            Text(
                              '${s.progressPercent}%',
                              style: Theme.of(context).textTheme.labelSmall,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const Spacer(),
                  Text(title, style: Theme.of(context).textTheme.titleSmall, maxLines: 2),
                  const SizedBox(height: 4),
                  Text(
                    '${s.modulesDone}/${s.modulesTotal} modules',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
