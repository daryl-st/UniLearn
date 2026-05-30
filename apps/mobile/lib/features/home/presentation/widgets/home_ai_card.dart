import 'package:flutter/material.dart';

import 'package:mobile/core/testing/mock_catalog.dart';
import 'package:mobile/theme/app_radii.dart';
import 'package:mobile/theme/app_spacing.dart';
import 'package:mobile/theme/app_typography.dart';
import 'package:mobile/theme/uni_learn_theme_extension.dart';

class HomeAiCard extends StatelessWidget {
  const HomeAiCard({super.key, required this.suggestion});

  final AiTaskSuggestion suggestion;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final extras = context.uniLearnExtras;

    return DecoratedBox(
      decoration: BoxDecoration(
        color: extras.aiAccentTint,
        borderRadius: BorderRadius.circular(AppRadii.lg),
        border: Border.all(color: extras.cardBorderColor),
      ),
      child: DecoratedBox(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(AppRadii.lg),
          border: Border(
            left: BorderSide(
              color: scheme.primary.withValues(alpha: 0.3),
              width: 2,
            ),
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.stackGap),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'AI RECOMMENDATION',
                style: AppTypography.eyebrow(scheme),
              ),
              const SizedBox(height: 8),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(Icons.auto_awesome, color: scheme.primary, size: 20),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      suggestion.title,
                      style: Theme.of(context).textTheme.titleSmall,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.stackGap),
              Text(
                suggestion.body,
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              const SizedBox(height: AppSpacing.stackGap),
              Row(
                children: [
                  Expanded(
                    child: FilledButton(
                      onPressed: () {},
                      child: const Text('Start now'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  OutlinedButton(
                    onPressed: () {},
                    child: const Text('Dismiss'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
