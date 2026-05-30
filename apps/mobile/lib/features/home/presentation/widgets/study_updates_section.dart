import 'package:flutter/material.dart';

import 'package:mobile/core/routing/app_navigation.dart';
import 'package:mobile/core/testing/mock_catalog.dart';
import 'package:mobile/theme/app_radii.dart';
import 'package:mobile/theme/app_spacing.dart';
import 'package:mobile/theme/app_typography.dart';

class StudyUpdatesSection extends StatelessWidget {
  const StudyUpdatesSection({super.key, required this.items});

  final List<StudyUpdateItem> items;

  IconData _iconFor(String kind) {
    switch (kind) {
      case 'instructor':
        return Icons.upload_file_outlined;
      case 'quiz':
        return Icons.quiz_outlined;
      case 'system':
      default:
        return Icons.auto_awesome_outlined;
    }
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Column(
      children: [
        for (final item in items)
          Padding(
            padding: const EdgeInsets.only(bottom: AppSpacing.stackGap),
            child: Material(
              color: scheme.surfaceContainerLow,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(AppRadii.lg),
                side: BorderSide(color: scheme.outlineVariant),
              ),
              child: InkWell(
                onTap: item.courseId != null
                    ? () => context.openCourseDetail(item.courseId!)
                    : null,
                borderRadius: BorderRadius.circular(AppRadii.lg),
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          color: scheme.surfaceContainerHigh,
                          borderRadius: BorderRadius.circular(AppRadii.sm),
                          border: Border.all(color: scheme.outlineVariant),
                        ),
                        child: Icon(
                          _iconFor(item.kind),
                          size: 18,
                          color: scheme.primary,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              item.title,
                              style: Theme.of(context).textTheme.titleSmall,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              item.subtitle,
                              style: Theme.of(context).textTheme.bodySmall,
                            ),
                            const SizedBox(height: 6),
                            Text(
                              item.kind.toUpperCase(),
                              style: AppTypography.eyebrow(
                                scheme,
                                opacity: 0.55,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }
}
