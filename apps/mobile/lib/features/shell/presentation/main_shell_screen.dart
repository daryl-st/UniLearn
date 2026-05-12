import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class MainShellScreen extends StatelessWidget {
  const MainShellScreen({super.key, required this.navigationShell});

  final StatefulNavigationShell navigationShell;

  void _onDestinationSelected(int index) {
    navigationShell.goBranch(
      index,
      initialLocation: index == navigationShell.currentIndex,
    );
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Scaffold(
      body: navigationShell,
      floatingActionButton: FloatingActionButton.large(
        onPressed: () {},
        backgroundColor: scheme.primaryContainer,
        foregroundColor: scheme.onPrimaryContainer,
        child: const Icon(Icons.auto_awesome),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
      bottomNavigationBar: NavigationBar(
        selectedIndex: navigationShell.currentIndex,
        onDestinationSelected: _onDestinationSelected,
        destinations: [
          NavigationDestination(
            icon: Icon(Icons.home_outlined, color: scheme.onSurfaceVariant),
            selectedIcon: Icon(Icons.home_rounded, color: scheme.secondary),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.menu_book_outlined, color: scheme.onSurfaceVariant),
            selectedIcon: Icon(Icons.menu_book, color: scheme.secondary),
            label: 'Courses',
          ),
          NavigationDestination(
            icon: Icon(Icons.bar_chart_outlined, color: scheme.onSurfaceVariant),
            selectedIcon: Icon(Icons.bar_chart, color: scheme.secondary),
            label: 'Stats',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline, color: scheme.onSurfaceVariant),
            selectedIcon: Icon(Icons.person, color: scheme.secondary),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
