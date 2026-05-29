import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/testing/mock_catalog.dart';
import 'package:mobile/theme/app_radii.dart';
import 'package:mobile/theme/app_spacing.dart';

class CoursesScreen extends StatefulWidget {
  const CoursesScreen({super.key});

  @override
  State<CoursesScreen> createState() => _CoursesScreenState();
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

class _CoursesScreenState extends State<CoursesScreen> {
  int? _selectedYear;

  Color _accentForIndex(int index) {
    const accents = [
      Color(0xFF4CD7F6),
      Color(0xFFA078FF),
      Color(0xFF7CFFB2),
      Color(0xFFFFC86B),
    ];
    return accents[index % accents.length];
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    final years = [1, 2, 3, 4];
    final List<int?> tags = [null, ...years]; // null represents 'All'
    final filtered = _selectedYear == null
        ? MockCatalog.apiCourses
        : MockCatalog.apiCourses
              .where((course) => course.academicYear == _selectedYear)
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
                      ? _selectedYear == null
                      : _selectedYear == t;
                  final label = isAll ? 'All' : 'Year $t';
                  return Padding(
                    padding: const EdgeInsets.only(right: 8.0),
                    child: _YearTag(
                      label: label,
                      selected: selected,
                      onTap: () => setState(
                        () => _selectedYear = isAll ? null : t,
                      ),
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
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                              style: Theme.of(context)
                                                  .textTheme
                                                  .labelSmall
                                                  ?.copyWith(
                                                    color: accent,
                                                    fontWeight: FontWeight.w800,
                                                    letterSpacing: 0.5,
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
                                                  height: 1.1,
                                                ),
                                          ),
                                          const SizedBox(height: 8),
                                          Text(
                                            '${c.displayLevel} • ${c.departmentId} department',
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                            style: Theme.of(context)
                                                .textTheme
                                                .bodySmall
                                                ?.copyWith(
                                                  color:
                                                      scheme.onSurfaceVariant,
                                                ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    const SizedBox(width: 12),
                                    SizedBox(
                                      width: 58,
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.end,
                                        children: [
                                          SizedBox(
                                            width: 48,
                                            height: 48,
                                            child: Stack(
                                              alignment: Alignment.center,
                                              children: [
                                                CircularProgressIndicator(
                                                  value: progressPercent / 100,
                                                  strokeWidth: 3.6,
                                                  backgroundColor: scheme
                                                      .surfaceContainerHighest,
                                                  color: accent,
                                                ),
                                                Text(
                                                  '$progressPercent%',
                                                  style: Theme.of(context)
                                                      .textTheme
                                                      .labelSmall
                                                      ?.copyWith(
                                                        fontWeight:
                                                            FontWeight.w800,
                                                      ),
                                                ),
                                              ],
                                            ),
                                          ),
                                          const SizedBox(height: 6),
                                          Text(
                                            'progress',
                                            style: Theme.of(context)
                                                .textTheme
                                                .labelSmall
                                                ?.copyWith(
                                                  color:
                                                      scheme.onSurfaceVariant,
                                                  fontSize: 10,
                                                ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 14),
                                const Spacer(),
                                Row(
                                  children: [
                                    Icon(
                                      Icons.school_outlined,
                                      size: 18,
                                      color: scheme.onSurfaceVariant,
                                    ),
                                    const SizedBox(width: 8),
                                    Expanded(
                                      child: Text(
                                        'Instructor ${c.instructorId}',
                                        overflow: TextOverflow.ellipsis,
                                        style: Theme.of(context)
                                            .textTheme
                                            .bodySmall
                                            ?.copyWith(
                                              fontWeight: FontWeight.w600,
                                            ),
                                      ),
                                    ),
                                    const SizedBox(width: 10),
                                    Container(
                                      width: 36,
                                      height: 36,
                                      decoration: BoxDecoration(
                                        gradient: LinearGradient(
                                          begin: Alignment.topLeft,
                                          end: Alignment.bottomRight,
                                          colors: [
                                            accent,
                                            accent.withValues(alpha: 0.72),
                                          ],
                                        ),
                                        shape: BoxShape.circle,
                                        boxShadow: [
                                          BoxShadow(
                                            color: accent.withValues(
                                              alpha: 0.28,
                                            ),
                                            blurRadius: 14,
                                            offset: const Offset(0, 8),
                                          ),
                                        ],
                                      ),
                                      child: Icon(
                                        Icons.arrow_forward_rounded,
                                        size: 20,
                                        color: scheme.onPrimary,
                                      ),
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
