import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:mobile/theme/app_radii.dart';
import 'package:mobile/theme/app_spacing.dart';

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

  const LectureMaterial({
    required this.id,
    required this.title,
    String? size,
    String? time,
    String? type,
    String? sizeOrDuration,
  }) : size = size ?? sizeOrDuration ?? 'N/A',
       time = time ?? sizeOrDuration ?? (type == 'video' ? '00:00' : 'N/A');
}

class CourseDetailsScreen extends StatefulWidget {
  final Course course;
  final List<LectureMaterial> materials;
  final VoidCallback onBack;
  final Function(LectureMaterial) onSummarizeMaterial;
  final VoidCallback onAssistantAsk;

  const CourseDetailsScreen({
    Key? key,
    required this.course,
    required this.materials,
    required this.onBack,
    required this.onSummarizeMaterial,
    required this.onAssistantAsk,
  }) : super(key: key);

  @override
  State<CourseDetailsScreen> createState() => _CourseDetailsScreenState();
}

class _CourseDetailsScreenState extends State<CourseDetailsScreen> {
  static const _bottomBackgroundImageUrl =
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB8eEmwxGtwcZGuL78pXL9F0XDxuX3q6KfZUCJdg2R2Z4DGNAfqI5P0o3JMNlGcjljZX0xrScWv5bE_7oSNOfmsnqzY6kQSF71qfYoSJUT-MfRlBxz9b-K1-IV8CSZLu1eCgE2h4mnFS7-HppKZ_NvF6UAjj4Gcop51PKeZI1aY-scIILL8smc6-Ywq8H1hcYh2twu2x6Tv3RPGTYDSd0PVGuX4exp7hPoc6C5wAE9aPYqHSwvBdBWIVXsYNWq3-pm0Zup2Oo577RJm';

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
    final materials = <LectureMaterial>[
      const LectureMaterial(
        id: 'm1',
        title: 'Lecture 1 — Introduction to CNNs',
        size: '12.8 MB',
        time: '18:24',
      ),
      const LectureMaterial(
        id: 'm2',
        title: 'Week 1 Slides',
        size: '2.3 MB',
        time: '06:12',
      ),
      const LectureMaterial(
        id: 'm3',
        title: 'Lab 1 — Build a small CNN',
        size: '8.1 MB',
        time: '24:40',
      ),
    ];

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: scheme.surfaceVariant,
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
      body: Stack(
        fit: StackFit.expand,
        children: [
          Align(
            alignment: Alignment.bottomCenter,
            child: IgnorePointer(
              child: SizedBox(
                width: double.infinity,
                height: 320,
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    ClipRect(
                      child: ImageFiltered(
                        imageFilter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                        child: Image.network(
                          _bottomBackgroundImageUrl,
                          fit: BoxFit.cover,
                          alignment: Alignment.bottomCenter,
                          filterQuality: FilterQuality.low,
                          errorBuilder: (context, error, stackTrace) {
                            return const SizedBox.shrink();
                          },
                        ),
                      ),
                    ),
                    DecoratedBox(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            scheme.surface.withValues(alpha: 0.00),
                            scheme.surface.withValues(alpha: 0.52),
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
          SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.containerPadding),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Hero Progress banner
                  Container(
                    constraints: const BoxConstraints(minHeight: 252),
                    padding: const EdgeInsets.all(AppSpacing.stackGap),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          scheme.surfaceContainerHighest.withOpacity(0.92),
                          scheme.surfaceContainerHigh.withOpacity(0.72),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(AppRadii.xl),
                      border: Border.all(
                        color: scheme.primary.withOpacity(0.10),
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: scheme.shadow.withOpacity(0.08),
                          blurRadius: 24,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Stack(
                          alignment: Alignment.center,
                          children: [
                            Container(
                              width: 108,
                              height: 108,
                              decoration: BoxDecoration(
                                color: scheme.primary.withOpacity(0.08),
                                shape: BoxShape.circle,
                              ),
                            ),
                            SizedBox(
                              width: 96,
                              height: 96,
                              child: CircularProgressIndicator(
                                value: widget.course.progressPercentage / 100.0,
                                strokeWidth: 6.5,
                                strokeCap: StrokeCap.round,
                                backgroundColor: scheme.surface.withOpacity(
                                  0.22,
                                ),
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
                                  style: Theme.of(context).textTheme.titleMedium
                                      ?.copyWith(
                                        color: scheme.primary,
                                        fontWeight: FontWeight.bold,
                                      ),
                                ),
                                Text(
                                  'COMPLETE',
                                  style: Theme.of(context).textTheme.labelSmall
                                      ?.copyWith(
                                        color: scheme.onSurfaceVariant,
                                        fontSize: 10,
                                      ),
                                ),
                              ],
                            ),
                          ],
                        ),
                        const SizedBox(width: 22),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 5,
                                ),
                                decoration: BoxDecoration(
                                  color: scheme.primary.withOpacity(0.12),
                                  borderRadius: BorderRadius.circular(
                                    AppRadii.full,
                                  ),
                                  border: Border.all(
                                    color: scheme.primary.withOpacity(0.18),
                                  ),
                                ),
                                child: Text(
                                  'MODULE ${widget.course.modulesCompleted.toString().padLeft(2, '0')}',
                                  style: Theme.of(context).textTheme.labelSmall
                                      ?.copyWith(
                                        color: scheme.primary,
                                        fontWeight: FontWeight.w700,
                                        fontSize: 10,
                                      ),
                                ),
                              ),
                              const SizedBox(height: 9),
                              Text(
                                widget.course.title,
                                style: Theme.of(context).textTheme.titleLarge
                                    ?.copyWith(
                                      color: scheme.onSurface,
                                      fontWeight: FontWeight.w800,
                                    ),
                              ),
                              const SizedBox(height: 6),
                              Text(
                                'Advanced Neural Networks and Deep Learning architectures for real-world predictive modeling.',
                                style: Theme.of(context).textTheme.bodyMedium
                                    ?.copyWith(color: scheme.onSurfaceVariant),
                              ),
                              const SizedBox(height: 18),
                              Row(
                                children: [
                                  Expanded(
                                    child: _buildHeroActionButton(
                                      context,
                                      icon: Icons.play_arrow_rounded,
                                      label: 'Continue learning',
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
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
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
                                onTap: () => widget.onSummarizeMaterial(mat),
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
                                subtitle: Text(
                                  'Size: ${mat.size}  •  Time: ${mat.time}',
                                  style: Theme.of(context).textTheme.bodySmall
                                      ?.copyWith(
                                        color: scheme.onSurfaceVariant,
                                      ),
                                ),
                                trailing: TextButton.icon(
                                  onPressed: () =>
                                      widget.onSummarizeMaterial(mat),
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
                  // AI helper panel
                  Container(
                    padding: const EdgeInsets.all(AppSpacing.stackGap),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          scheme.primaryContainer.withOpacity(0.22),
                          scheme.secondaryContainer.withOpacity(0.16),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(AppRadii.xl),
                      boxShadow: [
                        BoxShadow(
                          color: scheme.primary.withOpacity(0.08),
                          blurRadius: 18,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(
                              Icons.auto_awesome,
                              color: scheme.primary,
                              size: 18,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'UNI LEARN AI ASSISTANT',
                              style: Theme.of(context).textTheme.labelSmall
                                  ?.copyWith(
                                    color: scheme.primary,
                                    fontWeight: FontWeight.w900,
                                    fontSize: 16,
                                    letterSpacing: 1.0,
                                  ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Text(
                          '"I noticed you\'re reviewing CNNs. Would you like me to generate a summary of the AlexNet vs VGG architectures from today\'s lecture?"',
                          style: Theme.of(context).textTheme.bodyMedium
                              ?.copyWith(
                                color: scheme.onSurfaceVariant,
                                fontStyle: FontStyle.italic,
                              ),
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: scheme.primary.withOpacity(
                                  0.16,
                                ),
                                shadowColor: Colors.transparent,
                                side: BorderSide(
                                  color: scheme.primary.withOpacity(0.24),
                                ),
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 10,
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(
                                    AppRadii.md,
                                  ),
                                ),
                              ),
                              onPressed: widget.onAssistantAsk,
                              child: Text(
                                'Yes, summarize',
                                style: Theme.of(context).textTheme.bodySmall
                                    ?.copyWith(
                                      color: scheme.primary,
                                      fontSize: 16,
                                    ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            TextButton(
                              onPressed: () {},
                              child: Text(
                                'Not now',
                                style: Theme.of(context).textTheme.bodySmall
                                    ?.copyWith(
                                      color: scheme.onSurfaceVariant,
                                      fontSize: 12,
                                    ),
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
        ],
      ),
    );
  }

  BoxDecoration _cardDecoration(ColorScheme scheme) {
    return BoxDecoration(
      gradient: LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [
          scheme.surfaceContainer.withOpacity(0.88),
          scheme.surfaceContainerLow.withOpacity(0.72),
        ],
      ),
      borderRadius: BorderRadius.circular(AppRadii.xl),
      border: Border.all(color: scheme.outline.withOpacity(0.08)),
      boxShadow: [
        BoxShadow(
          color: scheme.shadow.withOpacity(0.06),
          blurRadius: 18,
          offset: const Offset(0, 8),
        ),
      ],
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
        borderRadius: BorderRadius.circular(AppRadii.md),
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
