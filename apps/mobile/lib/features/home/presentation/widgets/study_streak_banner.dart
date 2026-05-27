import 'package:flutter/material.dart';

import 'package:mobile/theme/app_radii.dart';
import 'package:mobile/theme/color_tokens.dart';

class StudyStreakBanner extends StatelessWidget {
  const StudyStreakBanner({super.key, required this.days});

  final int days;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: ColorTokens.surfaceContainer,
        borderRadius: BorderRadius.circular(AppRadii.md),
        border: Border.all(color: scheme.outlineVariant.withValues(alpha: 0.35)),
      ),
      child: Row(
        children: [
          Icon(Icons.local_fire_department, color: scheme.secondary),
          const SizedBox(width: 10),
          Text(
            '$days day streak',
            style: Theme.of(context).textTheme.titleSmall,
          ),
        ],
      ),
    );
  }
}
