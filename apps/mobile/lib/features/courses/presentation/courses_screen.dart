import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/core/providers/course_providers.dart';
import 'package:mobile/core/routing/app_navigation.dart';
import 'package:mobile/core/widgets/uni_card.dart';
import 'package:mobile/theme/app_radii.dart';
import 'package:mobile/theme/app_spacing.dart';
import 'package:mobile/theme/app_typography.dart';
import 'package:mobile/theme/color_tokens.dart';

final selectedCourseYearProvider = StateProvider.autoDispose<int?>(
  (ref) => null,
);

class CoursesScreen extends ConsumerWidget {
  const CoursesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final scheme = Theme.of(context).colorScheme;
    final selectedYear = ref.watch(selectedCourseYearProvider);
    final catalogAsync = ref.watch(courseCatalogProvider);
    final dashboardAsync = ref.watch(studentDashboardProvider);

    final years = [1, 2, 3, 4];
    final List<int?> tags = [null, ...years];

    return ColoredBox(
      color: ColorTokens.background,
      child: Column(
        children: [
          const SizedBox(height: 12),
          Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.containerPadding,
            ),
            child: SizedBox(
              height: 36,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: tags.length,
                separatorBuilder: (_, _) => const SizedBox(width: 8),
                itemBuilder: (context, index) {
                  final t = tags[index];
                  final isAll = t == null;
                  final selected = isAll
                      ? selectedYear == null
                      : selectedYear == t;
                  final label = isAll ? 'All' : 'Year $t';
                  return _YearTag(
                    label: label,
                    selected: selected,
                    onTap: () =>
                        ref.read(selectedCourseYearProvider.notifier).state =
                            isAll ? null : t,
                  );
                },
              ),
            ),
          ),
          const SizedBox(height: 8),
          Expanded(
            child: catalogAsync.when(
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (error, _) => Center(
                child: Padding(
                  padding: const EdgeInsets.all(AppSpacing.containerPadding),
                  child: Text(error.toString()),
                ),
              ),
              data: (courses) {
                final filtered = coursesForYear(courses, selectedYear);
                final progressMap = dashboardAsync.maybeWhen(
                  data: (dashboard) => dashboard.progressByCourseId,
                  orElse: () => const {},
                );

                if (filtered.isEmpty) {
                  return _EmptyYearState(selectedYear: selectedYear);
                }

                return ListView.separated(
                  padding: const EdgeInsets.all(AppSpacing.containerPadding),
                  itemCount: filtered.length,
                  separatorBuilder: (context, index) =>
                      const SizedBox(height: 12),
                  itemBuilder: (context, i) {
                    final c = filtered[i];
                    final summary = progressMap[c.id];
                    final progressPercent = summary?.progressPercent ?? 0;

                    return Material(
                      color: Colors.transparent,
                      child: InkWell(
                        borderRadius: BorderRadius.circular(AppRadii.lg),
                        onTap: () => context.openCourseDetail(c.id),
                        child: UniCard(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 8,
                                            vertical: 4,
                                          ),
                                          decoration: BoxDecoration(
                                            color: scheme.surfaceContainerHigh,
                                            borderRadius: BorderRadius.circular(
                                              AppRadii.sm,
                                            ),
                                            border: Border.all(
                                              color: scheme.outlineVariant,
                                            ),
                                          ),
                                          child: Text(
                                            c.code,
                                            style: AppTypography.eyebrow(
                                              scheme,
                                              opacity: 0.9,
                                            ),
                                          ),
                                        ),
                                        const SizedBox(height: 10),
                                        Text(
                                          c.name,
                                          maxLines: 2,
                                          overflow: TextOverflow.ellipsis,
                                          style: Theme.of(context)
                                              .textTheme
                                              .titleMedium,
                                        ),
                                        if (c.instructorName != null) ...[
                                          const SizedBox(height: 6),
                                          Text(
                                            c.instructorName!,
                                            style: Theme.of(context)
                                                .textTheme
                                                .bodySmall,
                                          ),
                                        ],
                                      ],
                                    ),
                                  ),
                                  Icon(
                                    Icons.menu_book_outlined,
                                    color: scheme.onSurfaceVariant,
                                    size: 22,
                                  ),
                                ],
                              ),
                              const SizedBox(height: 16),
                              Text(
                                '${progressPercent.toStringAsFixed(0)}% complete',
                                style: Theme.of(context).textTheme.labelMedium
                                    ?.copyWith(fontWeight: FontWeight.w600),
                              ),
                              const SizedBox(height: 8),
                              ClipRRect(
                                borderRadius: BorderRadius.circular(
                                  AppRadii.full,
                                ),
                                child: LinearProgressIndicator(
                                  value: progressPercent / 100,
                                  minHeight: 4,
                                  backgroundColor: scheme.surfaceContainerHigh,
                                  valueColor: AlwaysStoppedAnimation<Color>(
                                    scheme.primary,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                '${summary?.resourcesViewed ?? 0}/${summary?.resourcesTotal ?? 0} viewed',
                                style: Theme.of(context).textTheme.bodySmall,
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _EmptyYearState extends StatelessWidget {
  const _EmptyYearState({required this.selectedYear});

  final int? selectedYear;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final label = selectedYear == null
        ? 'No courses available'
        : 'No courses in Year $selectedYear';

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.containerPadding),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.menu_book_outlined,
              size: 48,
              color: scheme.onSurfaceVariant,
            ),
            const SizedBox(height: 16),
            Text(
              label,
              style: Theme.of(context).textTheme.titleMedium,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              'Try another year or browse all courses.',
              style: Theme.of(context).textTheme.bodySmall,
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

class _YearTag extends StatelessWidget {
  const _YearTag({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Material(
      color: selected ? scheme.primary : scheme.surfaceContainerHigh,
      borderRadius: BorderRadius.circular(AppRadii.sm),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppRadii.sm),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          child: Text(
            label,
            style: Theme.of(context).textTheme.labelSmall?.copyWith(
              color: selected ? scheme.onPrimary : scheme.onSurface,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ),
    );
  }
}
