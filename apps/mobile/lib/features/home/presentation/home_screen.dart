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
import 'package:mobile/theme/app_spacing.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  static const _bottomBackgroundImageUrl =
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB8eEmwxGtwcZGuL78pXL9F0XDxuX3q6KfZUCJdg2R2Z4DGNAfqI5P0o3JMNlGcjljZX0xrScWv5bE_7oSNOfmsnqzY6kQSF71qfYoSJUT-MfRlBxz9b-K1-IV8CSZLu1eCgE2h4mnFS7-HppKZ_NvF6UAjj4Gcop51PKeZI1aY-scIILL8smc6-Ywq8H1hcYh2twu2x6Tv3RPGTYDSd0PVGuX4exp7hPoc6C5wAE9aPYqHSwvBdBWIVXsYNWq3-pm0Zup2Oo577RJm';

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final scheme = Theme.of(context).colorScheme;
    final session = ref.watch(authSessionProvider);
    final displayName = session.user?.name ?? MockCatalog.userFirstName;

    return Stack(
      fit: StackFit.expand,
      children: [
        Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                scheme.surface,
                scheme.surface.withValues(alpha: 0.96),
                scheme.surfaceContainerLowest,
              ],
            ),
          ),
        ),
        Align(
          alignment: Alignment.bottomCenter,
          child: IgnorePointer(
            child: SizedBox(
              width: double.infinity,
              height: 280,
              child: Stack(
                fit: StackFit.expand,
                children: [
                  Image.network(
                    _bottomBackgroundImageUrl,
                    fit: BoxFit.cover,
                    alignment: Alignment.bottomCenter,
                    errorBuilder: (context, error, stackTrace) {
                      return const SizedBox.shrink();
                    },
                  ),
                  DecoratedBox(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          scheme.surface.withValues(alpha: 0.00),
                          scheme.surface.withValues(alpha: 0.44),
                          scheme.surface.withValues(alpha: 0.88),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        CustomScrollView(
          slivers: [
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(
                  AppSpacing.containerPadding,
                  12,
                  AppSpacing.containerPadding,
                  18,
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    CircleAvatar(
                      radius: 20,
                      backgroundColor: scheme.primaryContainer,
                      child: Text(
                        displayName.isNotEmpty
                            ? displayName[0].toUpperCase()
                            : '?',
                        style: Theme.of(context).textTheme.labelLarge?.copyWith(
                          color: scheme.onPrimaryContainer,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '${MockCatalog.greeting},',
                            style: Theme.of(context).textTheme.labelMedium
                                ?.copyWith(
                                  color: scheme.onSurfaceVariant,
                                  letterSpacing: 0.8,
                                ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            displayName,
                            style: Theme.of(context).textTheme.titleLarge
                                ?.copyWith(
                                  fontWeight: FontWeight.w800,
                                  color: scheme.onSurface,
                                ),
                          ),
                        ],
                      ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          MockCatalog.brandTitle,
                          style: Theme.of(context).textTheme.labelLarge
                              ?.copyWith(
                                color: scheme.secondary,
                                fontWeight: FontWeight.w900,
                                letterSpacing: 1.2,
                              ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Keep learning',
                          style: Theme.of(context).textTheme.labelSmall
                              ?.copyWith(color: scheme.onSurfaceVariant),
                        ),
                      ],
                    ),
                    const SizedBox(width: 8),
                    IconButton(
                      onPressed: () {},
                      icon: const Icon(Icons.notifications_none_rounded),
                    ),
                  ],
                ),
              ),
            ),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.only(bottom: 4),
                child: SizedBox(
                  width: double.infinity,
                  child: Divider(
                    height: 1,
                    thickness: 1.75,
                    color: scheme.outlineVariant.withValues(alpha: 0.42),
                  ),
                ),
              ),
            ),
            const SliverToBoxAdapter(child: SizedBox(height: 14)),
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
      ],
    );
  }
}

class _StreakHeroCard extends StatelessWidget {
  const _StreakHeroCard({required this.days});

  final int days;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      constraints: const BoxConstraints(minHeight: 188),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            scheme.primaryContainer.withValues(alpha: 0.84),
            scheme.secondaryContainer.withValues(alpha: 0.74),
            scheme.surfaceContainerHigh.withValues(alpha: 0.90),
          ],
        ),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: scheme.primary.withValues(alpha: 0.14)),
        boxShadow: [
          BoxShadow(
            color: scheme.primary.withValues(alpha: 0.08),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 54,
                height: 54,
                decoration: BoxDecoration(
                  color: scheme.primary.withValues(alpha: 0.16),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  Icons.local_fire_department_rounded,
                  color: scheme.primary,
                  size: 28,
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
                        color: scheme.onSurface,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 0.2,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'You have studied every day this week. Keep the momentum and extend it tonight.',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: scheme.onSurfaceVariant,
                        height: 1.35,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        _StreakInfoChip(
                          label: 'Today',
                          value: '2 sessions',
                          scheme: scheme,
                        ),
                        _StreakInfoChip(
                          label: 'Best run',
                          value: '11 days',
                          scheme: scheme,
                        ),
                        _StreakInfoChip(
                          label: 'Reward',
                          value: '+120 XP',
                          scheme: scheme,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: LinearProgressIndicator(
                  value: 0.84,
                  minHeight: 7,
                  borderRadius: BorderRadius.circular(999),
                  backgroundColor: scheme.surface.withValues(alpha: 0.18),
                  valueColor: AlwaysStoppedAnimation<Color>(scheme.primary),
                ),
              ),
              const SizedBox(width: 12),
              Text(
                'Streak goal 84%',
                style: Theme.of(context).textTheme.labelLarge?.copyWith(
                  color: scheme.primary,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ],
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
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: scheme.surfaceContainerHigh.withValues(alpha: 0.72),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: scheme.outlineVariant.withValues(alpha: 0.28),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            label,
            style: Theme.of(
              context,
            ).textTheme.labelSmall?.copyWith(color: scheme.onSurfaceVariant),
          ),
          const SizedBox(height: 2),
          Text(
            value,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: scheme.onSurface,
              fontWeight: FontWeight.w800,
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

    return Container(
      height: 234,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            scheme.surfaceContainerHighest.withValues(alpha: 0.90),
            scheme.surfaceContainerLow.withValues(alpha: 0.78),
          ],
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: scheme.outlineVariant.withValues(alpha: 0.28),
        ),
        boxShadow: [
          BoxShadow(
            color: scheme.shadow.withValues(alpha: 0.06),
            blurRadius: 16,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.insights_rounded, color: scheme.primary, size: 18),
              const SizedBox(width: 8),
              Text(
                'Weekly learning trend',
                style: Theme.of(context).textTheme.titleSmall?.copyWith(
                  fontWeight: FontWeight.w800,
                  color: scheme.onSurface,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            'A quick look at your learning rhythm this week.',
            style: Theme.of(
              context,
            ).textTheme.bodySmall?.copyWith(color: scheme.onSurfaceVariant),
          ),
          const SizedBox(height: 18),
          Expanded(
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
                                    gradient: LinearGradient(
                                      begin: Alignment.topCenter,
                                      end: Alignment.bottomCenter,
                                      colors: i == 3
                                          ? [scheme.primary, scheme.secondary]
                                          : [
                                              scheme.surfaceContainerHigh,
                                              scheme.surfaceContainerHighest,
                                            ],
                                    ),
                                    borderRadius: BorderRadius.circular(10),
                                    boxShadow: i == 3
                                        ? [
                                            BoxShadow(
                                              color: scheme.primary.withValues(
                                                alpha: 0.22,
                                              ),
                                              blurRadius: 12,
                                              offset: const Offset(0, 6),
                                            ),
                                          ]
                                        : null,
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
                                      ? FontWeight.w800
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
