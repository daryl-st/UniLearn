import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/routing/app_routes.dart';
import 'package:mobile/core/widgets/uni_card.dart';
import 'package:mobile/theme/app_radii.dart';
import 'package:mobile/theme/app_spacing.dart';
import 'package:mobile/theme/app_typography.dart';
import 'package:mobile/theme/color_tokens.dart';

// Model definitions
class Course {
  final String id;
  final String title;
  final String code;
  final int progressPercentage;
  final int modulesCompleted;
  final int totalModules;
  final double timeSpentHours;
  final String averageGrade;
  final int badgesCount;
  final int projectsCount;

  const Course({
    required this.id,
    required this.title,
    required this.code,
    required this.progressPercentage,
    required this.modulesCompleted,
    required this.totalModules,
    required this.timeSpentHours,
    required this.averageGrade,
    required this.badgesCount,
    required this.projectsCount,
  });
}

class LectureMaterial {
  final String id;
  final String title;
  final String size;
  final String time;
  final String pdfUrl;

  const LectureMaterial({
    required this.id,
    required this.title,
    String? size,
    String? time,
    String? pdfUrl,
    String? type,
    String? sizeOrDuration,
  }) : size = size ?? sizeOrDuration ?? 'N/A',
       time = time ?? sizeOrDuration ?? (type == 'video' ? '00:00' : 'N/A'),
       pdfUrl = pdfUrl ?? '';
}

class CourseDetailsScreen extends StatefulWidget {
  final Course course;
  final List<LectureMaterial> materials;
  final VoidCallback onBack;

  const CourseDetailsScreen({
    Key? key,
    required this.course,
    required this.materials,
    required this.onBack,
  }) : super(key: key);

  @override
  State<CourseDetailsScreen> createState() => _CourseDetailsScreenState();
}

class _CourseDetailsScreenState extends State<CourseDetailsScreen> {
  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    // sample/trash materials for now (ignore fetched materials)
    final materials = widget.materials.isEmpty
        ? <LectureMaterial>[
            const LectureMaterial(
              id: 'm1',
              title: 'Lecture 1 — Introduction to CNNs',
              pdfUrl:
                  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            ),
            const LectureMaterial(
              id: 'm2',
              title: 'Week 1 Slides',
              pdfUrl:
                  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            ),
            const LectureMaterial(
              id: 'm3',
              title: 'Lab 1 — Build a small CNN',
              pdfUrl:
                  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            ),
          ]
        : widget.materials;

    return Scaffold(
      backgroundColor: ColorTokens.background,
      appBar: AppBar(
        backgroundColor: ColorTokens.surfaceContainerLow,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: scheme.onSurface),
          onPressed: widget.onBack,
        ),
        title: Text(
          'Course Panel',
          style: Theme.of(context).textTheme.titleSmall,
        ),
        centerTitle: false,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.containerPadding),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              UniCard(
                padding: const EdgeInsets.all(AppSpacing.stackGap),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Stack(
                          alignment: Alignment.center,
                          children: [
                            SizedBox(
                              width: 80,
                              height: 80,
                              child: CircularProgressIndicator(
                                value: widget.course.progressPercentage / 100.0,
                                strokeWidth: 5,
                                strokeCap: StrokeCap.round,
                                backgroundColor: scheme.surfaceContainerHigh,
                                valueColor: AlwaysStoppedAnimation<Color>(
                                  scheme.primary,
                                ),
                              ),
                            ),
                            Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  '${widget.course.progressPercentage}%',
                                  style: Theme.of(context).textTheme.titleSmall
                                      ?.copyWith(
                                        color: scheme.primary,
                                        fontWeight: FontWeight.w700,
                                      ),
                                ),
                                Text(
                                  'DONE',
                                  style: AppTypography.eyebrow(
                                    scheme,
                                    opacity: 0.7,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'MODULE ${widget.course.modulesCompleted.toString().padLeft(2, '0')}',
                                style: AppTypography.eyebrow(scheme),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                widget.course.title,
                                style: Theme.of(context).textTheme.titleMedium
                                    ?.copyWith(fontWeight: FontWeight.w700),
                              ),
                              const SizedBox(height: 6),
                              Text(
                                widget.course.code,
                                style: Theme.of(context).textTheme.bodySmall,
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.stackGap),
                    const Divider(height: 1),
                    const SizedBox(height: AppSpacing.stackGap),
                    Row(
                      children: [
                        Expanded(
                          child: _buildHeroActionButton(
                            context,
                            icon: Icons.play_arrow_rounded,
                            label: 'Continue',
                            isPrimary: true,
                            onPressed: () {},
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _buildHeroActionButton(
                            context,
                            icon: Icons.menu_book_outlined,
                            label: 'Syllabus',
                            isPrimary: false,
                            onPressed: () {},
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
                  // Activity metrics
                  Container(
                    padding: const EdgeInsets.all(AppSpacing.stackGap),
                    decoration: _cardDecoration(scheme),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'COURSE ACTIVITY',
                          style: Theme.of(context).textTheme.labelSmall
                              ?.copyWith(
                                color: scheme.onSurfaceVariant,
                                fontWeight: FontWeight.bold,
                              ),
                        ),
                        const SizedBox(height: 12),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Time Spent',
                              style: Theme.of(context).textTheme.bodySmall
                                  ?.copyWith(color: scheme.onSurfaceVariant),
                            ),
                            Text(
                              '${widget.course.timeSpentHours}h',
                              style: Theme.of(context).textTheme.bodyMedium
                                  ?.copyWith(
                                    color: scheme.primary,
                                    fontWeight: FontWeight.bold,
                                  ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(AppRadii.full),
                          child: LinearProgressIndicator(
                            value: widget.course.progressPercentage / 100.0,
                            minHeight: 8,
                            backgroundColor: scheme.surface.withOpacity(0.20),
                            valueColor: AlwaysStoppedAnimation<Color>(
                              scheme.primary,
                            ),
                          ),
                        ),
                        const SizedBox(height: 14),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Average Grade',
                              style: Theme.of(context).textTheme.bodySmall
                                  ?.copyWith(color: scheme.onSurfaceVariant),
                            ),
                            Text(
                              widget.course.averageGrade,
                              style: Theme.of(context).textTheme.bodyMedium
                                  ?.copyWith(
                                    color: scheme.secondary,
                                    fontWeight: FontWeight.bold,
                                  ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 14),
                        Divider(color: scheme.onSurface.withOpacity(0.08)),
                        const SizedBox(height: 14),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceAround,
                          children: [
                            _buildMetricCol(
                              widget.course.badgesCount.toString(),
                              'Badges',
                            ),
                            _buildMetricCol(
                              widget.course.modulesCompleted.toString().padLeft(
                                2,
                                '0',
                              ),
                              'Completed',
                            ),
                            _buildMetricCol(
                              widget.course.projectsCount.toString(),
                              'Projects',
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  // Materials card (replaces tabs)
                  Container(
                    padding: const EdgeInsets.all(AppSpacing.stackGap),
                    decoration: _cardDecoration(scheme),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Materials',
                          style: Theme.of(context).textTheme.labelSmall
                              ?.copyWith(
                                color: scheme.onSurfaceVariant,
                                fontWeight: FontWeight.bold,
                              ),
                        ),
                        const SizedBox(height: 12),
                        if (materials.isEmpty)
                          Padding(
                            padding: const EdgeInsets.symmetric(vertical: 8),
                            child: Text(
                              'No materials available',
                              style: Theme.of(context).textTheme.bodySmall
                                  ?.copyWith(color: scheme.onSurfaceVariant),
                            ),
                          )
                        else
                          ...materials.map((mat) {
                            return Padding(
                              padding: const EdgeInsets.only(bottom: 12),
                              child: ListTile(
                                contentPadding: const EdgeInsets.symmetric(
                                  horizontal: 14,
                                  vertical: 6,
                                ),
                                onTap: () => context.push(
                                  AppRoutes.pdfViewer,
                                  extra: mat,
                                ),
                                leading: Container(
                                  padding: const EdgeInsets.all(10),
                                  decoration: BoxDecoration(
                                    color: scheme.primary.withOpacity(0.12),
                                    borderRadius: BorderRadius.circular(14),
                                  ),
                                  child: Icon(
                                    Icons.picture_as_pdf_rounded,
                                    color: scheme.primary,
                                    size: 18,
                                  ),
                                ),
                                title: Text(
                                  mat.title,
                                  style: Theme.of(context).textTheme.bodyMedium
                                      ?.copyWith(
                                        color: scheme.onSurface,
                                        fontWeight: FontWeight.bold,
                                      ),
                                ),
                                trailing: TextButton.icon(
                                  onPressed: () => context.push(
                                    AppRoutes.pdfViewer,
                                    extra: mat,
                                  ),
                                  style: TextButton.styleFrom(
                                    foregroundColor: scheme.primary,
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 10,
                                      vertical: 8,
                                    ),
                                    minimumSize: Size.zero,
                                    tapTargetSize:
                                        MaterialTapTargetSize.shrinkWrap,
                                  ),
                                  icon: const Icon(
                                    Icons.visibility_outlined,
                                    size: 16,
                                  ),
                                  label: const Text('View'),
                                ),
                              ),
                            );
                          }),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                ],
              ),
            ),
      ),
    );
  }

  BoxDecoration _cardDecoration(ColorScheme scheme) {
    return BoxDecoration(
      color: scheme.surfaceContainerLow,
      borderRadius: BorderRadius.circular(AppRadii.lg),
      border: Border.all(color: scheme.outlineVariant),
    );
  }

  Widget _buildHeroActionButton(
    BuildContext context, {
    required IconData icon,
    required String label,
    required bool isPrimary,
    required VoidCallback onPressed,
  }) {
    final scheme = Theme.of(context).colorScheme;
    final baseStyle = ElevatedButton.styleFrom(
      elevation: 0,
      minimumSize: const Size.fromHeight(48),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadii.sm),
      ),
      textStyle: Theme.of(context).textTheme.labelLarge?.copyWith(
        fontWeight: FontWeight.w700,
        letterSpacing: 0.2,
      ),
    );

    return ElevatedButton.icon(
      onPressed: onPressed,
      icon: Icon(icon, size: 18),
      label: Text(label),
      style: baseStyle.copyWith(
        backgroundColor: WidgetStatePropertyAll(
          isPrimary ? scheme.primary : scheme.surfaceContainerHighest,
        ),
        foregroundColor: WidgetStatePropertyAll(
          isPrimary ? scheme.onPrimary : scheme.primary,
        ),
        side: WidgetStatePropertyAll(
          BorderSide(
            color: isPrimary
                ? scheme.primary.withOpacity(0.24)
                : scheme.primary.withOpacity(0.20),
          ),
        ),
      ),
    );
  }

  Widget _buildMetricCol(String val, String label) {
    final scheme = Theme.of(context).colorScheme;
    return Column(
      children: [
        Text(
          val,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
            color: scheme.primary,
            fontSize: 14,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label.toUpperCase(),
          style: Theme.of(context).textTheme.labelSmall?.copyWith(
            color: scheme.onSurfaceVariant,
            fontSize: 10,
            letterSpacing: 0.5,
          ),
        ),
      ],
    );
  }
}
