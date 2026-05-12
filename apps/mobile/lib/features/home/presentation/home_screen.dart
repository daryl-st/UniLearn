import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/core/providers/auth_session_provider.dart';
import 'package:mobile/core/testing/mock_catalog.dart';
import 'package:mobile/core/widgets/widgets.dart';
import 'package:mobile/features/home/presentation/widgets/deadlines_section.dart';
import 'package:mobile/features/home/presentation/widgets/enrolled_courses_section.dart';
import 'package:mobile/features/home/presentation/widgets/home_ai_card.dart';
import 'package:mobile/features/home/presentation/widgets/quick_actions_grid.dart';
import 'package:mobile/features/home/presentation/widgets/recent_activity_section.dart';
import 'package:mobile/features/home/presentation/widgets/study_streak_banner.dart';
import 'package:mobile/theme/app_spacing.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final scheme = Theme.of(context).colorScheme;
    final session = ref.watch(authSessionProvider);
    final displayName = session.user?.name ?? MockCatalog.userFirstName;

    return CustomScrollView(
      slivers: [
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(
              AppSpacing.containerPadding,
              12,
              AppSpacing.containerPadding,
              AppSpacing.stackGap,
            ),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 22,
                  backgroundColor: scheme.primaryContainer,
                  child: Text(
                    displayName.isNotEmpty ? displayName[0] : '?',
                    style: TextStyle(color: scheme.onPrimaryContainer),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '${MockCatalog.greeting}, $displayName',
                        style: Theme.of(context).textTheme.titleSmall,
                      ),
                      Text(
                        MockCatalog.brandTitle,
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(
                              color: scheme.secondary,
                              fontWeight: FontWeight.w800,
                            ),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  onPressed: () {},
                  icon: const Icon(Icons.notifications_none_rounded),
                ),
              ],
            ),
          ),
        ),
        SliverPadding(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.containerPadding),
          sliver: SliverToBoxAdapter(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const StudyStreakBanner(days: MockCatalog.streakDays),
                const SizedBox(height: AppSpacing.stackGap),
                HomeAiCard(suggestion: MockCatalog.aiSuggestion),
                const SizedBox(height: AppSpacing.sectionGap),
                const SectionHeader(title: 'Enrolled courses', actionLabel: 'View all'),
                EnrolledCoursesSection(summaries: MockCatalog.enrolledSummaries),
                const SizedBox(height: AppSpacing.sectionGap),
                const SectionHeader(title: 'Learning progress'),
                _LearningProgressPlaceholder(scheme: scheme),
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
    );
  }
}

class _LearningProgressPlaceholder extends StatelessWidget {
  const _LearningProgressPlaceholder({required this.scheme});

  final ColorScheme scheme;

  @override
  Widget build(BuildContext context) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return Container(
      height: 140,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: scheme.surfaceContainerLow,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: scheme.outlineVariant.withValues(alpha: 0.35)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          for (var i = 0; i < days.length; i++)
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 2),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Container(
                      height: 24.0 + (i % 4) * 18,
                      decoration: BoxDecoration(
                        color: i == 3 ? scheme.primary : scheme.surfaceContainerHigh,
                        borderRadius: BorderRadius.circular(6),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      days[i],
                      style: Theme.of(context).textTheme.labelSmall?.copyWith(
                            color: i == 3 ? scheme.primary : scheme.onSurfaceVariant,
                            fontWeight: i == 3 ? FontWeight.w700 : FontWeight.w500,
                          ),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}
