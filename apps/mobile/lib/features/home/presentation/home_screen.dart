import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/core/testing/mock_catalog.dart';
import 'package:mobile/core/widgets/widgets.dart';
import 'package:mobile/features/home/presentation/widgets/deadlines_section.dart';
import 'package:mobile/features/home/presentation/widgets/enrolled_courses_section.dart';
import 'package:mobile/features/home/presentation/widgets/home_ai_card.dart';
import 'package:mobile/features/home/presentation/widgets/quick_actions_grid.dart';
import 'package:mobile/features/home/presentation/widgets/recent_activity_section.dart';
import 'package:mobile/theme/app_radii.dart';
import 'package:mobile/theme/app_spacing.dart';
import 'package:mobile/theme/app_typography.dart';
import 'package:mobile/theme/color_tokens.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final scheme = Theme.of(context).colorScheme;

    return ColoredBox(
      color: ColorTokens.background,
      child: CustomScrollView(
        slivers: [
          const SliverToBoxAdapter(child: SizedBox(height: 12)),
          SliverPadding(
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.containerPadding,
            ),
            sliver: SliverToBoxAdapter(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  _StreakHeroCard(days: MockCatalog.streakDays),
                  const SizedBox(height: AppSpacing.stackGap),
                  HomeAiCard(suggestion: MockCatalog.aiSuggestion),
                  const SizedBox(height: AppSpacing.sectionGap),
                  const SectionHeader(
                    title: 'Enrolled courses',
                    actionLabel: 'View all',
                  ),
                  EnrolledCoursesSection(
                    summaries: MockCatalog.enrolledSummaries,
                  ),
                  const SizedBox(height: AppSpacing.sectionGap),
                  const SectionHeader(title: 'Learning progress'),
                  _LearningProgressChart(scheme: scheme),
                  const SizedBox(height: AppSpacing.sectionGap),
                  const SectionHeader(title: 'Recent activity'),
                  RecentActivitySection(items: MockCatalog.recentActivity),
                  const SizedBox(height: AppSpacing.sectionGap),
                  const SectionHeader(title: 'Upcoming deadlines'),
                  DeadlinesSection(items: MockCatalog.deadlines),
                  const SizedBox(height: AppSpacing.sectionGap),
                  const SectionHeader(title: 'Quick actions'),
                  const QuickActionsGrid(),
                  const SizedBox(height: 88),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _StreakHeroCard extends StatelessWidget {
  const _StreakHeroCard({required this.days});

  final int days;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return UniCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'STUDY STREAK',
            style: AppTypography.eyebrow(scheme),
          ),
          const SizedBox(height: 12),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: scheme.surfaceContainerHigh,
                  borderRadius: BorderRadius.circular(AppRadii.md),
                  border: Border.all(color: scheme.outlineVariant),
                ),
                child: Icon(
                  Icons.local_fire_department_rounded,
                  color: scheme.primary,
                  size: 24,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '$days day streak',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'You have studied every day this week.',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: _StreakInfoChip(
                            label: 'Best run',
                            value: '11 days',
                            scheme: scheme,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: _StreakInfoChip(
                            label: 'Reward',
                            value: '+120 XP',
                            scheme: scheme,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ClipRRect(
            borderRadius: BorderRadius.circular(AppRadii.full),
            child: LinearProgressIndicator(
              value: 0.84,
              minHeight: 4,
              backgroundColor: scheme.surfaceContainerHigh,
              valueColor: AlwaysStoppedAnimation<Color>(scheme.primary),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Streak goal 84%',
            style: Theme.of(context).textTheme.labelMedium?.copyWith(
              color: scheme.secondary,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

class _StreakInfoChip extends StatelessWidget {
  const _StreakInfoChip({
    required this.label,
    required this.value,
    required this.scheme,
  });

  final String label;
  final String value;
  final ColorScheme scheme;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
      decoration: BoxDecoration(
        color: scheme.surfaceContainerHigh,
        borderRadius: BorderRadius.circular(AppRadii.md),
        border: Border.all(color: scheme.outlineVariant),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(label, style: AppTypography.eyebrow(scheme, opacity: 0.7)),
          const SizedBox(height: 4),
          Text(
            value,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: scheme.onSurface,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

class _LearningProgressChart extends StatelessWidget {
  const _LearningProgressChart({required this.scheme});

  final ColorScheme scheme;

  @override
  Widget build(BuildContext context) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    final values = <double>[0.35, 0.55, 0.42, 0.9, 0.64, 0.78, 0.5];

    return UniCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'WEEKLY TREND',
            style: AppTypography.eyebrow(scheme),
          ),
          const SizedBox(height: 8),
          Text(
            'Your learning rhythm this week.',
            style: Theme.of(context).textTheme.bodySmall,
          ),
          const SizedBox(height: 18),
          SizedBox(
            height: 120,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                for (var i = 0; i < days.length; i++)
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 3),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          Expanded(
                            child: Align(
                              alignment: Alignment.bottomCenter,
                              child: FractionallySizedBox(
                                heightFactor: values[i],
                                child: Container(
                                  decoration: BoxDecoration(
                                    color: i == 3
                                        ? scheme.primary
                                        : scheme.surfaceContainerHighest,
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            days[i],
                            style: Theme.of(context).textTheme.labelSmall
                                ?.copyWith(
                                  color: i == 3
                                      ? scheme.primary
                                      : scheme.onSurfaceVariant,
                                  fontWeight: i == 3
                                      ? FontWeight.w700
                                      : FontWeight.w500,
                                ),
                          ),
                        ],
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
