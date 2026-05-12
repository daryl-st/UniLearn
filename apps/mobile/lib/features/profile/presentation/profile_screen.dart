import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/providers/auth_session_provider.dart';
import 'package:mobile/core/routing/app_routes.dart';
import 'package:mobile/theme/app_spacing.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final session = ref.watch(authSessionProvider);
    final user = session.user;
    final scheme = Theme.of(context).colorScheme;

    return ListView(
      padding: const EdgeInsets.all(AppSpacing.containerPadding),
      children: [
        CircleAvatar(
          radius: 40,
          backgroundColor: scheme.primaryContainer,
          child: Text(
            _initial(user?.name),
            style: TextStyle(fontSize: 32, color: scheme.onPrimaryContainer),
          ),
        ),
        const SizedBox(height: 16),
        Text(user?.name ?? 'Guest', style: Theme.of(context).textTheme.headlineSmall),
        Text(user?.email ?? '', style: Theme.of(context).textTheme.bodyMedium),
        const SizedBox(height: 24),
        ListTile(
          leading: const Icon(Icons.settings_outlined),
          title: const Text('Settings'),
          onTap: () {},
        ),
        ListTile(
          leading: const Icon(Icons.logout),
          title: const Text('Sign out'),
          onTap: () async {
            await ref.read(authSessionProvider.notifier).signOut();
            if (context.mounted) context.go(AppRoutes.login);
          },
        ),
      ],
    );
  }
}

String _initial(String? name) {
  if (name == null || name.isEmpty) return '?';
  return name[0].toUpperCase();
}
