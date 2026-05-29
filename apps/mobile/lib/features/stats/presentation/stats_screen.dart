import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:mobile/core/testing/mock_catalog.dart';
import 'package:mobile/theme/app_radii.dart';
import 'package:mobile/theme/app_spacing.dart';

class StatsScreen extends StatelessWidget {
  const StatsScreen({super.key});

  static const _bottomBackgroundImageUrl =
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB8eEmwxGtwcZGuL78pXL9F0XDxuX3q6KfZUCJdg2R2Z4DGNAfqI5P0o3JMNlGcjljZX0xrScWv5bE_7oSNOfmsnqzY6kQSF71qfYoSJUT-MfRlBxz9b-K1-IV8CSZLu1eCgE2h4mnFS7-HppKZ_NvF6UAjj4Gcop51PKeZI1aY-scIILL8smc6-Ywq8H1hcYh2twu2x6Tv3RPGTYDSd0PVGuX4exp7hPoc6C5wAE9aPYqHSwvBdBWIVXsYNWq3-pm0Zup2Oo577RJm';

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final summaries = MockCatalog.enrolledSummaries;
    final totalProgress = summaries.isEmpty
        ? 0
        : (summaries.fold<int>(0, (sum, item) => sum + item.progressPercent) /
                  summaries.length)
              .round();
    final totalModulesDone = summaries.fold<int>(
      0,
      (sum, item) => sum + item.modulesDone,
    );
    final totalModules = summaries.fold<int>(
      0,
      (sum, item) => sum + item.modulesTotal,
    );
    final remainingModules = totalModules - totalModulesDone;
    final totalStudyHours = 18.6;
    final weeklyMinutes = <double>[32, 46, 28, 58, 64, 40, 52];

    final courseRows = summaries.map((summary) {
      final course = MockCatalog.courseById(summary.courseId);
      return _CourseMomentumRow(
        title: course?.name ?? 'Course ${summary.courseId}',
        code: course?.code ?? 'N/A',
        progress: summary.progressPercent / 100,
        modulesDone: summary.modulesDone,
        modulesTotal: summary.modulesTotal,
        accent: _accentForCode(summary.courseId, scheme),
      );
    }).toList();

    final activityBreakdown = <_ActivitySlice>[
      _ActivitySlice(label: 'Videos', value: 42, color: scheme.primary),
      _ActivitySlice(label: 'Notes', value: 28, color: scheme.secondary),
      _ActivitySlice(label: 'Quizzes', value: 18, color: scheme.tertiary),
      _ActivitySlice(label: 'Labs', value: 12, color: scheme.error),
    ];

    final topCourse = summaries.isNotEmpty
        ? summaries.reduce(
            (a, b) => a.progressPercent >= b.progressPercent ? a : b,
          )
        : null;
    final topCourseModel = topCourse == null
        ? null
        : MockCatalog.courseById(topCourse.courseId);

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: Stack(
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
                      filterQuality: FilterQuality.low,
                      errorBuilder: (context, error, stackTrace) {
                        return const SizedBox.shrink();
                      },
                    ),
                    ClipRect(
                      child: BackdropFilter(
                        filter: ImageFilter.blur(sigmaX: 8, sigmaY: 8),
                        child: const SizedBox.expand(),
                      ),
                    ),
                    DecoratedBox(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            scheme.surface.withValues(alpha: 0.00),
                            scheme.surface.withValues(alpha: 0.58),
                            scheme.surface.withValues(alpha: 0.90),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          SafeArea(
            bottom: false,
            child: CustomScrollView(
              slivers: [
                const SliverToBoxAdapter(child: SizedBox(height: 12)),
                SliverPadding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.containerPadding,
                  ),
                  sliver: SliverToBoxAdapter(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _StatsHeroCard(
                          totalProgress: totalProgress,
                          streakDays: MockCatalog.streakDays,
                          activeCourses: summaries.length,
                          totalStudyHours: totalStudyHours,
                          topCourseTitle:
                              topCourseModel?.name ?? 'No course spotlight',
                          topCourseProgress: topCourse?.progressPercent ?? 0,
                        ),
                        const SizedBox(height: AppSpacing.stackGap),
                        _SectionCard(
                          title: 'This week momentum',
                          subtitle:
                              'A quick view of your study rhythm across the last seven days.',
                          child: _WeeklyBarChart(values: weeklyMinutes),
                        ),
                        const SizedBox(height: AppSpacing.stackGap),
                        _SectionCard(
                          title: 'Course momentum',
                          subtitle:
                              'Your strongest courses based on completion and module progress.',
                          child: Column(
                            children: [
                              for (var i = 0; i < courseRows.length; i++) ...[
                                courseRows[i],
                                if (i != courseRows.length - 1)
                                  const SizedBox(height: 14),
                              ],
                            ],
                          ),
                        ),
                        const SizedBox(height: AppSpacing.stackGap),
                        _SectionCard(
                          title: 'Engagement split',
                          subtitle:
                              'How your study time is currently distributed.',
                          child: _ActivityBreakdownChart(
                            slices: activityBreakdown,
                          ),
                        ),
                        const SizedBox(height: AppSpacing.stackGap),
                        _SectionCard(
                          title: 'Performance snapshot',
                          subtitle:
                              'Pulling together the most useful indicators from the dashboard and course details.',
                          child: SingleChildScrollView(
                            scrollDirection: Axis.horizontal,
                            child: Row(
                              children: [
                                _MetricTile(
                                  width: 176,
                                  height: 156,
                                  label: 'Avg. completion',
                                  value: '$totalProgress%',
                                  helper: 'Across active courses',
                                  icon: Icons.insights_rounded,
                                  accent: scheme.primary,
                                ),
                                const SizedBox(width: 12),
                                _MetricTile(
                                  width: 176,
                                  height: 156,
                                  label: 'Modules completed',
                                  value: '$totalModulesDone',
                                  helper: 'Out of $totalModules total',
                                  icon: Icons.check_circle_outline_rounded,
                                  accent: scheme.secondary,
                                ),
                                const SizedBox(width: 12),
                                _MetricTile(
                                  width: 176,
                                  height: 156,
                                  label: 'Remaining modules',
                                  value: '$remainingModules',
                                  helper: 'Keep the momentum going',
                                  icon: Icons.timelapse_rounded,
                                  accent: scheme.tertiary,
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 96),
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

  Color _accentForCode(String id, ColorScheme scheme) {
    final palette = [
      scheme.primary,
      scheme.secondary,
      scheme.tertiary,
      scheme.error,
    ];
    final index = id.codeUnits.fold<int>(0, (sum, unit) => sum + unit);
    return palette[index % palette.length];
  }
}

class _StatsHeroCard extends StatelessWidget {
  const _StatsHeroCard({
    required this.totalProgress,
    required this.streakDays,
    required this.activeCourses,
    required this.totalStudyHours,
    required this.topCourseTitle,
    required this.topCourseProgress,
  });

  final int totalProgress;
  final int streakDays;
  final int activeCourses;
  final double totalStudyHours;
  final String topCourseTitle;
  final int topCourseProgress;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            scheme.primaryContainer.withValues(alpha: 0.92),
            scheme.secondaryContainer.withValues(alpha: 0.80),
            scheme.surfaceContainerHighest.withValues(alpha: 0.86),
          ],
        ),
        borderRadius: BorderRadius.circular(AppRadii.xl),
        border: Border.all(color: scheme.primary.withValues(alpha: 0.10)),
        boxShadow: [
          BoxShadow(
            color: scheme.shadow.withValues(alpha: 0.10),
            blurRadius: 24,
            offset: const Offset(0, 12),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Analytics dashboard',
            style: Theme.of(context).textTheme.labelLarge?.copyWith(
              color: scheme.onSurfaceVariant,
              letterSpacing: 1.1,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 12),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '$totalProgress%',
                      style: Theme.of(context).textTheme.displaySmall?.copyWith(
                        color: scheme.onSurface,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Average course progress across your active workload.',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: scheme.onSurfaceVariant,
                        height: 1.4,
                      ),
                    ),
                    const SizedBox(height: 14),
                    Wrap(
                      spacing: 10,
                      runSpacing: 10,
                      children: [
                        _HeroPill(
                          label: '$streakDays-day streak',
                          icon: Icons.local_fire_department_rounded,
                        ),
                        _HeroPill(
                          label: '$activeCourses active courses',
                          icon: Icons.menu_book_rounded,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 16),
              SizedBox(
                width: 112,
                height: 112,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    SizedBox(
                      width: 112,
                      height: 112,
                      child: CircularProgressIndicator(
                        value: totalProgress / 100,
                        strokeWidth: 10,
                        strokeCap: StrokeCap.round,
                        backgroundColor: scheme.surface.withValues(alpha: 0.24),
                        valueColor: AlwaysStoppedAnimation<Color>(
                          scheme.primary,
                        ),
                      ),
                    ),
                    Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          '$totalProgress%',
                          style: Theme.of(context).textTheme.titleLarge
                              ?.copyWith(
                                color: scheme.onSurface,
                                fontWeight: FontWeight.w900,
                              ),
                        ),
                        Text(
                          'overall',
                          style: Theme.of(context).textTheme.labelSmall
                              ?.copyWith(color: scheme.onSurfaceVariant),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),
          Row(
            children: [
              Expanded(
                child: _MiniStat(
                  label: 'Study hours',
                  value: '${totalStudyHours.toStringAsFixed(1)}h',
                  icon: Icons.schedule_rounded,
                  accent: scheme.primary,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _MiniStat(
                  label: 'Spotlight course',
                  value: topCourseTitle,
                  icon: Icons.rocket_launch_rounded,
                  accent: scheme.secondary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ClipRRect(
            borderRadius: BorderRadius.circular(AppRadii.full),
            child: LinearProgressIndicator(
              value: topCourseProgress / 100,
              minHeight: 8,
              backgroundColor: scheme.surface.withValues(alpha: 0.18),
              valueColor: AlwaysStoppedAnimation<Color>(scheme.primary),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            '$topCourseProgress% completion in your most advanced course.',
            style: Theme.of(
              context,
            ).textTheme.bodySmall?.copyWith(color: scheme.onSurfaceVariant),
          ),
        ],
      ),
    );
  }
}

class _HeroPill extends StatelessWidget {
  const _HeroPill({required this.label, required this.icon});

  final String label;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: scheme.surface.withValues(alpha: 0.42),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(
          color: scheme.outlineVariant.withValues(alpha: 0.22),
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: scheme.primary),
          const SizedBox(width: 6),
          Text(
            label,
            style: Theme.of(context).textTheme.labelMedium?.copyWith(
              color: scheme.onSurface,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }
}

class _SectionCard extends StatelessWidget {
  const _SectionCard({
    required this.title,
    required this.subtitle,
    required this.child,
  });

  final String title;
  final String subtitle;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: scheme.surfaceContainerHighest.withValues(alpha: 0.84),
        borderRadius: BorderRadius.circular(AppRadii.xl),
        border: Border.all(
          color: scheme.outlineVariant.withValues(alpha: 0.24),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: Theme.of(
              context,
            ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 4),
          Text(
            subtitle,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: scheme.onSurfaceVariant,
              height: 1.35,
            ),
          ),
          const SizedBox(height: 16),
          child,
        ],
      ),
    );
  }
}

class _WeeklyBarChart extends StatelessWidget {
  const _WeeklyBarChart({required this.values});

  final List<double> values;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    final maxValue = values.reduce((a, b) => a > b ? a : b);

    return SizedBox(
      height: 170,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: List.generate(values.length, (index) {
          final heightFactor = values[index] / maxValue;
          return Expanded(
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: index == 0 ? 0 : 4),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Text(
                    '${values[index].round()}m',
                    style: Theme.of(context).textTheme.labelSmall?.copyWith(
                      color: scheme.onSurfaceVariant,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 8),
                  AnimatedContainer(
                    duration: const Duration(milliseconds: 250),
                    height: 110 * heightFactor,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [scheme.primary, scheme.secondary],
                      ),
                      borderRadius: BorderRadius.circular(18),
                      boxShadow: [
                        BoxShadow(
                          color: scheme.primary.withValues(alpha: 0.18),
                          blurRadius: 18,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    labels[index],
                    style: Theme.of(context).textTheme.labelSmall?.copyWith(
                      color: scheme.onSurfaceVariant,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ],
              ),
            ),
          );
        }),
      ),
    );
  }
}

class _CourseMomentumRow extends StatelessWidget {
  const _CourseMomentumRow({
    required this.title,
    required this.code,
    required this.progress,
    required this.modulesDone,
    required this.modulesTotal,
    required this.accent,
  });

  final String title;
  final String code;
  final double progress;
  final int modulesDone;
  final int modulesTotal;
  final Color accent;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: scheme.surface.withValues(alpha: 0.42),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: scheme.outlineVariant.withValues(alpha: 0.18),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      accent.withValues(alpha: 0.92),
                      accent.withValues(alpha: 0.65),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: const Icon(
                  Icons.menu_book_rounded,
                  color: Colors.white,
                  size: 20,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      code,
                      style: Theme.of(context).textTheme.labelSmall?.copyWith(
                        color: scheme.onSurfaceVariant,
                      ),
                    ),
                  ],
                ),
              ),
              Text(
                '${(progress * 100).round()}%',
                style: Theme.of(context).textTheme.titleSmall?.copyWith(
                  color: accent,
                  fontWeight: FontWeight.w900,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ClipRRect(
            borderRadius: BorderRadius.circular(999),
            child: LinearProgressIndicator(
              value: progress,
              minHeight: 10,
              backgroundColor: scheme.surfaceContainerHighest.withValues(
                alpha: 0.84,
              ),
              valueColor: AlwaysStoppedAnimation<Color>(accent),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            '$modulesDone of $modulesTotal modules completed',
            style: Theme.of(
              context,
            ).textTheme.bodySmall?.copyWith(color: scheme.onSurfaceVariant),
          ),
        ],
      ),
    );
  }
}

class _ActivitySlice {
  const _ActivitySlice({
    required this.label,
    required this.value,
    required this.color,
  });

  final String label;
  final int value;
  final Color color;
}

class _ActivityBreakdownChart extends StatelessWidget {
  const _ActivityBreakdownChart({required this.slices});

  final List<_ActivitySlice> slices;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final total = slices.fold<int>(0, (sum, item) => sum + item.value);

    return Column(
      children: [
        SizedBox(
          height: 170,
          child: Row(
            children: [
              Expanded(
                flex: 42,
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(24),
                  child: Container(
                    color: scheme.surfaceContainerHigh.withValues(alpha: 0.56),
                    child: Column(
                      children: [
                        for (final slice in slices)
                          Expanded(
                            flex: slice.value,
                            child: Container(
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  begin: Alignment.centerLeft,
                                  end: Alignment.centerRight,
                                  colors: [
                                    slice.color.withValues(alpha: 0.95),
                                    slice.color.withValues(alpha: 0.70),
                                  ],
                                ),
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                flex: 58,
                child: Column(
                  children: [
                    for (final slice in slices) ...[
                      Expanded(
                        child: Row(
                          children: [
                            Container(
                              width: 12,
                              height: 12,
                              decoration: BoxDecoration(
                                color: slice.color,
                                shape: BoxShape.circle,
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Text(
                                slice.label,
                                style: Theme.of(context).textTheme.bodyMedium
                                    ?.copyWith(fontWeight: FontWeight.w700),
                              ),
                            ),
                            Text(
                              '${((slice.value / total) * 100).round()}%',
                              style: Theme.of(context).textTheme.labelLarge
                                  ?.copyWith(
                                    color: slice.color,
                                    fontWeight: FontWeight.w900,
                                  ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 10),
        Text(
          'Total tracked activity: $total%',
          style: Theme.of(
            context,
          ).textTheme.bodySmall?.copyWith(color: scheme.onSurfaceVariant),
        ),
      ],
    );
  }
}

class _MetricTile extends StatelessWidget {
  const _MetricTile({
    required this.width,
    required this.height,
    required this.label,
    required this.value,
    required this.helper,
    required this.icon,
    required this.accent,
  });

  final double width;
  final double height;
  final String label;
  final String value;
  final String helper;
  final IconData icon;
  final Color accent;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return SizedBox(
      width: width,
      height: height,
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              accent.withValues(alpha: 0.14),
              scheme.surfaceContainerHigh.withValues(alpha: 0.72),
            ],
          ),
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: accent.withValues(alpha: 0.14)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: accent.withValues(alpha: 0.14),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: accent, size: 18),
            ),
            const SizedBox(height: 10),
            Text(
              value,
              style: Theme.of(
                context,
              ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900),
            ),
            Text(
              label,
              style: Theme.of(context).textTheme.labelMedium?.copyWith(
                color: scheme.onSurfaceVariant,
                fontWeight: FontWeight.w800,
              ),
            ),
            Text(
              helper,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: scheme.onSurfaceVariant,
                height: 1.25,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _MiniStat extends StatelessWidget {
  const _MiniStat({
    required this.label,
    required this.value,
    required this.icon,
    required this.accent,
  });

  final String label;
  final String value;
  final IconData icon;
  final Color accent;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: scheme.surface.withValues(alpha: 0.42),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: scheme.outlineVariant.withValues(alpha: 0.16),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: accent, size: 18),
          const SizedBox(height: 8),
          Text(
            value,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: Theme.of(
              context,
            ).textTheme.labelLarge?.copyWith(fontWeight: FontWeight.w900),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: Theme.of(
              context,
            ).textTheme.labelSmall?.copyWith(color: scheme.onSurfaceVariant),
          ),
        ],
      ),
    );
  }
}
