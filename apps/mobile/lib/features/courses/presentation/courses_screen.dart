import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/testing/mock_catalog.dart';
import 'package:mobile/theme/app_radii.dart';
import 'package:mobile/theme/app_spacing.dart';

final selectedCourseYearProvider = StateProvider.autoDispose<int?>(
  (ref) => null,
);

Color _accentForIndex(int index) {
  const accents = [
    Color(0xFF4CD7F6),
    Color(0xFFA078FF),
    Color(0xFF7CFFB2),
    Color(0xFFFFC86B),
  ];
  return accents[index % accents.length];
}

class CoursesScreen extends ConsumerWidget {
  const CoursesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final scheme = Theme.of(context).colorScheme;
    final selectedYear = ref.watch(selectedCourseYearProvider);

    final years = [1, 2, 3, 4];
    final List<int?> tags = [null, ...years]; // null represents 'All'
    final filtered = selectedYear == null
        ? MockCatalog.apiCourses
        : MockCatalog.apiCourses
              .where((course) => course.academicYear == selectedYear)
              .toList();

    return Column(
      children: [
        const SizedBox(height: 12),
        Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.containerPadding,
          ),
          child: SizedBox(
            height: 52,
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: tags.map((t) {
                  final isAll = t == null;
                  final selected = isAll
                      ? selectedYear == null
                      : selectedYear == t;
                  final label = isAll ? 'All' : 'Year $t';
                  return Padding(
                    padding: const EdgeInsets.only(right: 8.0),
                    child: _YearTag(
                      label: label,
                      selected: selected,
                      onTap: () =>
                          ref.read(selectedCourseYearProvider.notifier).state =
                              isAll ? null : t,
                    ),
                  );
                }).toList(),
              ),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Expanded(
          child: ListView.separated(
            padding: const EdgeInsets.all(AppSpacing.containerPadding),
            itemCount: filtered.length,
            separatorBuilder: (context, index) => const SizedBox(height: 12),
            itemBuilder: (context, i) {
              final c = filtered[i];
              final summary = MockCatalog.enrolledSummaries
                  .where((item) => item.courseId == c.id)
                  .firstOrNull;
              final progressPercent = summary?.progressPercent ?? 0;
              final originalIndex = MockCatalog.apiCourses.indexWhere(
                (x) => x.id == c.id,
              );
              final accent = _accentForIndex(originalIndex);

              return SizedBox(
                height: 214,
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    borderRadius: BorderRadius.circular(AppRadii.lg),
                    onTap: () => context.push('/courses/${c.id}'),
                    child: Container(
                      clipBehavior: Clip.antiAlias,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            scheme.surfaceContainerLow,
                            scheme.surfaceContainer.withValues(alpha: 0.96),
                          ],
                        ),
                        borderRadius: BorderRadius.circular(AppRadii.lg),
                        border: Border.all(
                          color: scheme.outlineVariant.withValues(alpha: 0.35),
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: scheme.shadow.withValues(alpha: 0.16),
                            blurRadius: 28,
                            offset: const Offset(0, 14),
                          ),
                        ],
                      ),
                      child: Stack(
                        children: [
                          Positioned(
                            right: -18,
                            top: -18,
                            child: Container(
                              width: 92,
                              height: 92,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                gradient: RadialGradient(
                                  colors: [
                                    accent.withValues(alpha: 0.30),
                                    accent.withValues(alpha: 0.06),
                                    Colors.transparent,
                                  ],
                                ),
                              ),
                            ),
                          ),
                          Positioned(
                            left: -16,
                            bottom: -18,
                            child: Container(
                              width: 84,
                              height: 84,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                gradient: RadialGradient(
                                  colors: [
                                    scheme.primary.withValues(alpha: 0.18),
                                    scheme.primary.withValues(alpha: 0.04),
                                    Colors.transparent,
                                  ],
                                ),
                              ),
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.all(16),
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
                                              horizontal: 12,
                                              vertical: 6,
                                            ),
                                            decoration: BoxDecoration(
                                              color: accent.withValues(
                                                alpha: 0.14,
                                              ),
                                              borderRadius:
                                                  BorderRadius.circular(
                                                    AppRadii.full,
                                                  ),
                                              border: Border.all(
                                                color: accent.withValues(
                                                  alpha: 0.22,
                                                ),
                                              ),
                                            ),
                                            child: Text(
                                              c.code,
                                              style: Theme.of(context)
                                                  .textTheme
                                                  .labelSmall
                                                  ?.copyWith(
                                                    color: accent,
                                                    fontWeight: FontWeight.w800,
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
                                                .titleMedium
                                                ?.copyWith(
                                                  fontWeight: FontWeight.w800,
                                                ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Container(
                                      width: 44,
                                      height: 44,
                                      decoration: BoxDecoration(
                                        shape: BoxShape.circle,
                                        gradient: LinearGradient(
                                          colors: [
                                            accent.withValues(alpha: 0.95),
                                            accent.withValues(alpha: 0.72),
                                          ],
                                        ),
                                      ),
                                      child: Icon(
                                        Icons.menu_book_outlined,
                                        color: Colors.white,
                                        size: 22,
                                      ),
                                    ),
                                  ],
                                ),
                                const Spacer(),
                                Row(
                                  children: [
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            '${progressPercent.toStringAsFixed(0)}% complete',
                                            style: Theme.of(context)
                                                .textTheme
                                                .labelMedium
                                                ?.copyWith(
                                                  fontWeight: FontWeight.w700,
                                                ),
                                          ),
                                          const SizedBox(height: 8),
                                          ClipRRect(
                                            borderRadius: BorderRadius.circular(
                                              999,
                                            ),
                                            child: LinearProgressIndicator(
                                              value: progressPercent / 100,
                                              minHeight: 8,
                                              backgroundColor: scheme
                                                  .outlineVariant
                                                  .withValues(alpha: 0.22),
                                              valueColor:
                                                  AlwaysStoppedAnimation<Color>(
                                                    accent,
                                                  ),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    const SizedBox(width: 12),
                                    Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.end,
                                      children: [
                                        Text(
                                          '${summary?.modulesDone ?? 0}/${summary?.modulesTotal ?? 0}',
                                          style: Theme.of(context)
                                              .textTheme
                                              .labelLarge
                                              ?.copyWith(
                                                fontWeight: FontWeight.w800,
                                              ),
                                        ),
                                        Text(
                                          'modules',
                                          style: Theme.of(context)
                                              .textTheme
                                              .labelSmall
                                              ?.copyWith(
                                                color: scheme.onSurfaceVariant,
                                              ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}

class _YearTag extends StatelessWidget {
  const _YearTag({
    required this.label,
    required this.selected,
    required this.onTap,
    Key? key,
  }) : super(key: key);

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Material(
      color: Colors.transparent,
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 220),
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          decoration: BoxDecoration(
            gradient: selected
                ? LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      scheme.primary,
                      scheme.primary.withValues(alpha: 0.88),
                    ],
                  )
                : null,
            color: selected
                ? null
                : scheme.surfaceVariant.withValues(alpha: 0.06),
            borderRadius: BorderRadius.circular(16),
            boxShadow: selected
                ? [
                    BoxShadow(
                      color: scheme.primary.withValues(alpha: 0.12),
                      blurRadius: 12,
                      offset: const Offset(0, 6),
                    ),
                  ]
                : null,
            border: Border.all(
              color: selected
                  ? scheme.primary.withValues(alpha: 0.18)
                  : scheme.outline.withValues(alpha: 0.06),
            ),
          ),
          child: Text(
            label,
            style: selected
                ? Theme.of(context).textTheme.labelLarge?.copyWith(
                    color: scheme.onPrimary,
                    fontWeight: FontWeight.w800,
                  )
                : Theme.of(context).textTheme.labelSmall?.copyWith(
                    color: scheme.onSurface,
                    fontWeight: FontWeight.w700,
                  ),
          ),
        ),
      ),
    );
  }
}
