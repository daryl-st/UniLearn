import 'package:flutter/material.dart';

import 'package:mobile/core/testing/mock_catalog.dart';

class RecentActivitySection extends StatelessWidget {
  const RecentActivitySection({super.key, required this.items});

  final List<ActivityItem> items;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    IconData iconFor(String label) {
      switch (label) {
        case 'video':
          return Icons.play_circle_outline;
        case 'quiz':
          return Icons.quiz_outlined;
        case 'pdf':
        default:
          return Icons.picture_as_pdf_outlined;
      }
    }

    return Column(
      children: [
        for (var i = 0; i < items.length; i++) ...[
          if (i > 0)
            Divider(height: 1, color: scheme.onSurface.withValues(alpha: 0.08)),
          ListTile(
            contentPadding: const EdgeInsets.symmetric(vertical: 8),
            leading: Icon(iconFor(items[i].iconLabel), color: scheme.secondary),
            title: Text(items[i].title, style: Theme.of(context).textTheme.titleSmall),
            subtitle: Text(items[i].subtitle, style: Theme.of(context).textTheme.bodySmall),
          ),
        ],
      ],
    );
  }
}
