import 'package:flutter/material.dart';

import 'package:mobile/core/routing/app_navigation.dart';
import 'package:mobile/features/home/domain/home_models.dart';

class RecentActivitySection extends StatelessWidget {
  const RecentActivitySection({super.key, required this.items});

  final List<ActivityItem> items;

  IconData iconFor(String label) {
    switch (label) {
      case 'ppt':
        return Icons.slideshow_outlined;
      case 'doc':
        return Icons.description_outlined;
      case 'quiz':
        return Icons.quiz_outlined;
      case 'pdf':
      default:
        return Icons.picture_as_pdf_outlined;
    }
  }

  void _onTap(BuildContext context, ActivityItem item) {
    if (item.material != null) {
      context.openPdfMaterial(item.material!);
      return;
    }
    if (item.courseId != null) {
      context.openCourseDetail(item.courseId!);
    }
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    if (items.isEmpty) {
      return Padding(
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Text(
          'No recent activity yet.',
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
            color: scheme.onSurfaceVariant,
          ),
        ),
      );
    }

    return Column(
      children: [
        for (var i = 0; i < items.length; i++) ...[
          if (i > 0)
            Divider(
              height: 1,
              color: scheme.onSurface.withValues(alpha: 0.08),
            ),
          ListTile(
            contentPadding: const EdgeInsets.symmetric(vertical: 8),
            leading: Icon(
              iconFor(items[i].iconLabel),
              color: scheme.secondary,
            ),
            title: Text(
              items[i].title,
              style: Theme.of(context).textTheme.titleSmall,
            ),
            subtitle: Text(
              items[i].subtitle,
              style: Theme.of(context).textTheme.bodySmall,
            ),
            onTap: () => _onTap(context, items[i]),
          ),
        ],
      ],
    );
  }
}
