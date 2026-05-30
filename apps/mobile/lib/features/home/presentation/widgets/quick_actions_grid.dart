import 'package:flutter/material.dart';

import 'package:mobile/theme/app_radii.dart';

class QuickActionsGrid extends StatelessWidget {
  const QuickActionsGrid({super.key});

  static const _actions = [
    (Icons.document_scanner_outlined, 'Scan PDF'),
    (Icons.note_alt_outlined, 'Quick note'),
    (Icons.calendar_month_outlined, 'Schedule'),
    (Icons.help_outline, 'Help hub'),
  ];

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      childAspectRatio: 1.35,
      children: _actions.map((a) {
        return Material(
          color: scheme.surfaceContainerLow,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppRadii.lg),
            side: BorderSide(color: scheme.outlineVariant),
          ),
          child: InkWell(
            onTap: () {},
            borderRadius: BorderRadius.circular(AppRadii.lg),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(a.$1, color: scheme.secondary, size: 28),
                const SizedBox(height: 8),
                Text(a.$2, style: Theme.of(context).textTheme.labelLarge),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }
}
