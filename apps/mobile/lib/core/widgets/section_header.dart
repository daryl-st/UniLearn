import 'package:flutter/material.dart';
import 'package:mobile/theme/app_spacing.dart';

/// Shared section title row (e.g. dashboard lists).
class SectionHeader extends StatelessWidget {
  const SectionHeader({
    super.key,
    required this.title,
    this.actionLabel,
    this.onAction,
  });

  final String title;
  final String? actionLabel;
  final VoidCallback? onAction;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.stackGap),
      child: Row(
        children: [
          Expanded(
            child: Text(
              title.toUpperCase(),
              style: Theme.of(context).textTheme.labelLarge?.copyWith(
                    letterSpacing: 1.1,
                    color: scheme.onSurfaceVariant,
                  ),
            ),
          ),
          if (actionLabel != null)
            TextButton(
              onPressed: onAction,
              child: Text(actionLabel!, style: TextStyle(color: scheme.secondary)),
            ),
        ],
      ),
    );
  }
}
