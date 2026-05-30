import 'package:flutter/material.dart';

import 'package:mobile/core/routing/app_navigation.dart';
import 'package:mobile/core/testing/mock_catalog.dart';
import 'package:mobile/core/widgets/uni_card.dart';

class EnrolledCoursesSection extends StatelessWidget {
  const EnrolledCoursesSection({super.key, required this.summaries});

  final List<EnrolledCourseSummary> summaries;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return SizedBox(
      height: 168,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: summaries.length,
        separatorBuilder: (context, index) => const SizedBox(width: 12),
        itemBuilder: (context, i) {
          final s = summaries[i];
          final course = MockCatalog.courseById(s.courseId);
          final title = course?.name ?? 'Course';
          return SizedBox(
            width: 220,
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: () => context.openCourseDetail(s.courseId),
                borderRadius: BorderRadius.circular(12),
                child: UniCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(
                            Icons.school_outlined,
                            color: scheme.secondary,
                            size: 20,
                          ),
                          const Spacer(),
                          SizedBox(
                            width: 40,
                            height: 40,
                            child: Stack(
                              alignment: Alignment.center,
                              children: [
                                CircularProgressIndicator(
                                  value: s.progressPercent / 100,
                                  strokeWidth: 3,
                                  backgroundColor: scheme.surfaceContainerHigh,
                                  color: scheme.primary,
                                ),
                                Text(
                                  '${s.progressPercent}%',
                                  style:
                                      Theme.of(context).textTheme.labelSmall,
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const Spacer(),
                      Text(
                        title,
                        style: Theme.of(context).textTheme.titleSmall,
                        maxLines: 2,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${s.modulesDone}/${s.modulesTotal} modules',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
