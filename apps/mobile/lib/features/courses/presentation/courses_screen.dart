import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/testing/mock_catalog.dart';
import 'package:mobile/theme/app_spacing.dart';

class CoursesScreen extends StatelessWidget {
  const CoursesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      padding: const EdgeInsets.all(AppSpacing.containerPadding),
      itemCount: MockCatalog.apiCourses.length,
      separatorBuilder: (context, index) => const SizedBox(height: 12),
      itemBuilder: (context, i) {
        final c = MockCatalog.apiCourses[i];
        return ListTile(
          tileColor: Theme.of(context).colorScheme.surfaceContainerLow,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          title: Text(c.name),
          subtitle: Text('${c.code} · ${c.displayLevel}'),
          trailing: const Icon(Icons.chevron_right),
          onTap: () => context.push('/courses/${c.id}'),
        );
      },
    );
  }
}
