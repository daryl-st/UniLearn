import 'package:flutter/material.dart';
import 'package:mobile/core/testing/mock_catalog.dart';
import 'package:mobile/core/widgets/uni_card.dart';
import 'package:mobile/theme/app_radii.dart';
import 'package:mobile/theme/app_spacing.dart';
import 'package:mobile/theme/app_typography.dart';
import 'package:mobile/theme/color_tokens.dart';

class StatsScreen extends StatelessWidget {
  const StatsScreen({super.key});

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
    const totalStudyHours = 18.6;
    final weeklyMinutes = <double>[32, 46, 28, 58, 64, 40, 52];

    final courseRows = summaries.map((summary) {
      final course = MockCatalog.courseById(summary.courseId);
      return _CourseMomentumRow(
        title: course?.name ?? 'Course ${summary.courseId}',
        code: course?.code ?? 'N/A',
        progress: summary.progressPercent / 100,
        modulesDone: summary.modulesDone,
        modulesTotal: summary.modulesTotal,
        accent: scheme.primary,
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
                    subtitle: 'Study rhythm across the last seven days.',
                    child: _WeeklyBarChart(values: weeklyMinutes),
                  ),
                  const SizedBox(height: AppSpacing.stackGap),
                  _SectionCard(
                    title: 'Course momentum',
                    subtitle: 'Completion and module progress.',
                    child: Column(
                      children: [
                        for (var i = 0; i < courseRows.length; i++) ...[
                          courseRows[i],
                          if (i != courseRows.length - 1)
                            const SizedBox(height: 12),
                        ],
                      ],
                    ),
                  ),
                  const SizedBox(height: AppSpacing.stackGap),
                  _SectionCard(
                    title: 'Engagement split',
                    subtitle: 'How your study time is distributed.',
                    child: _ActivityBreakdownChart(
                      slices: activityBreakdown,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.stackGap),
                  _SectionCard(
                    title: 'Performance snapshot',
                    subtitle: 'Key indicators from your workload.',
                    child: SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      child: Row(
                        children: [
                          _MetricTile(
                            width: 160,
                            label: 'Avg. completion',
                            value: '$totalProgress%',
                            helper: 'Across active courses',
                            icon: Icons.insights_rounded,
                            accent: scheme.primary,
                          ),
                          const SizedBox(width: 12),
                          _MetricTile(
                            width: 160,
                            label: 'Modules done',
                            value: '$totalModulesDone',
                            helper: 'Out of $totalModules total',
                            icon: Icons.check_circle_outline_rounded,
                            accent: scheme.secondary,
                          ),
                          const SizedBox(width: 12),
                          _MetricTile(
                            width: 160,
                            label: 'Remaining',
                            value: '$remainingModules',
                            helper: 'Keep the momentum',
                            icon: Icons.timelapse_rounded,
                            accent: scheme.onSurfaceVariant,
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
    );
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

    return UniCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('ANALYTICS', style: AppTypography.eyebrow(scheme)),
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
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Average course progress.',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                    const SizedBox(height: 12),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        _HeroPill(
                          label: '$streakDays-day streak',
                          icon: Icons.local_fire_department_rounded,
                        ),
                        _HeroPill(
                          label: '$activeCourses courses',
                          icon: Icons.menu_book_rounded,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              SizedBox(
                width: 72,
                height: 72,
                child: CircularProgressIndicator(
                  value: totalProgress / 100,
                  strokeWidth: 6,
                  backgroundColor: scheme.surfaceContainerHigh,
                  valueColor: AlwaysStoppedAnimation<Color>(scheme.primary),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: _MiniStat(
                  label: 'Study hours',
                  value: '${totalStudyHours.toStringAsFixed(1)}h',
                  icon: Icons.schedule_rounded,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _MiniStat(
                  label: 'Spotlight',
                  value: topCourseTitle,
                  icon: Icons.rocket_launch_rounded,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ClipRRect(
            borderRadius: BorderRadius.circular(AppRadii.full),
            child: LinearProgressIndicator(
              value: topCourseProgress / 100,
              minHeight: 4,
              backgroundColor: scheme.surfaceContainerHigh,
              valueColor: AlwaysStoppedAnimation<Color>(scheme.primary),
            ),
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
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: scheme.surfaceContainerHigh,
        borderRadius: BorderRadius.circular(AppRadii.sm),
        border: Border.all(color: scheme.outlineVariant),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: scheme.primary),
          const SizedBox(width: 6),
          Text(
            label,
            style: Theme.of(context).textTheme.labelSmall?.copyWith(
              fontWeight: FontWeight.w600,
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

    return UniCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title.toUpperCase(),
            style: AppTypography.eyebrow(scheme, opacity: 0.8),
          ),
          const SizedBox(height: 4),
          Text(subtitle, style: Theme.of(context).textTheme.bodySmall),
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
      height: 140,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: List.generate(values.length, (index) {
          final heightFactor = values[index] / maxValue;
          final highlight = index == 3;
          return Expanded(
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: index == 0 ? 0 : 4),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Text(
                    '${values[index].round()}m',
                    style: Theme.of(context).textTheme.labelSmall,
                  ),
                  const SizedBox(height: 6),
                  Container(
                    height: 90 * heightFactor,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: highlight
                          ? scheme.primary
                          : scheme.surfaceContainerHighest,
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    labels[index],
                    style: Theme.of(context).textTheme.labelSmall?.copyWith(
                      color: highlight
                          ? scheme.primary
                          : scheme.onSurfaceVariant,
                      fontWeight: highlight ? FontWeight.w700 : FontWeight.w500,
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
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: scheme.surfaceContainerHigh,
        borderRadius: BorderRadius.circular(AppRadii.sm),
        border: Border.all(color: scheme.outlineVariant),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
          Text(code, style: Theme.of(context).textTheme.bodySmall),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(AppRadii.full),
            child: LinearProgressIndicator(
              value: progress,
              minHeight: 4,
              backgroundColor: scheme.surfaceContainerHighest,
              valueColor: AlwaysStoppedAnimation<Color>(accent),
            ),
          ),
          const SizedBox(height: 6),
          Text(
            '$modulesDone of $modulesTotal modules · ${(progress * 100).round()}%',
            style: Theme.of(context).textTheme.labelSmall,
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
    final total = slices.fold<int>(0, (sum, item) => sum + item.value);

    return Column(
      children: [
        for (final slice in slices)
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Row(
              children: [
                Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: slice.color,
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    slice.label,
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ),
                Text(
                  '${((slice.value / total) * 100).round()}%',
                  style: Theme.of(context).textTheme.labelMedium?.copyWith(
                    color: slice.color,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }
}

class _MetricTile extends StatelessWidget {
  const _MetricTile({
    required this.width,
    required this.label,
    required this.value,
    required this.helper,
    required this.icon,
    required this.accent,
  });

  final double width;
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
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: scheme.surfaceContainerHigh,
          borderRadius: BorderRadius.circular(AppRadii.sm),
          border: Border.all(color: scheme.outlineVariant),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: accent, size: 18),
            const SizedBox(height: 8),
            Text(
              value,
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w700,
              ),
            ),
            Text(label, style: Theme.of(context).textTheme.labelSmall),
            Text(helper, style: Theme.of(context).textTheme.bodySmall),
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
  });

  final String label;
  final String value;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: scheme.surfaceContainerHigh,
        borderRadius: BorderRadius.circular(AppRadii.sm),
        border: Border.all(color: scheme.outlineVariant),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 16, color: scheme.primary),
          const SizedBox(height: 6),
          Text(
            value,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: Theme.of(context).textTheme.labelMedium?.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
          Text(label, style: Theme.of(context).textTheme.labelSmall),
        ],
      ),
    );
  }
}
