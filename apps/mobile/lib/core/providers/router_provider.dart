import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/providers/auth_session_provider.dart';
import 'package:mobile/core/routing/app_routes.dart';
import 'package:mobile/core/testing/mock_catalog.dart';
import 'package:mobile/features/auth/presentation/login_screen.dart';
import 'package:mobile/features/auth/presentation/onboarding_screen.dart';
import 'package:mobile/features/auth/presentation/register_screen.dart';
import 'package:mobile/features/auth/presentation/splash_screen.dart';
import 'package:mobile/features/courses/presentation/course_detail_screen.dart';
import 'package:mobile/features/courses/presentation/courses_screen.dart';
import 'package:mobile/features/home/presentation/home_screen.dart';
import 'package:mobile/features/profile/presentation/profile_screen.dart';
import 'package:mobile/features/shell/presentation/main_shell_screen.dart';
import 'package:mobile/features/stats/presentation/stats_screen.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final refresh = ValueNotifier<int>(0);
  ref.listen(authSessionProvider, (AuthSessionState? previous, AuthSessionState next) {
    refresh.value++;
  });
  ref.onDispose(refresh.dispose);

  return GoRouter(
    initialLocation: AppRoutes.splash,
    refreshListenable: refresh,
    redirect: (context, state) {
      final auth = ref.read(authSessionProvider);
      final path = state.uri.path;
      final authed = auth.isAuthenticated;

      if (authed && (path == AppRoutes.login || path == AppRoutes.register)) {
        return AppRoutes.home;
      }

      final isPublic = path == AppRoutes.splash ||
          path == AppRoutes.onboarding ||
          path == AppRoutes.login ||
          path == AppRoutes.register;

      if (!authed && !isPublic) {
        return AppRoutes.login;
      }
      return null;
    },
    routes: [
      GoRoute(
        path: AppRoutes.splash,
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: AppRoutes.onboarding,
        builder: (context, state) => const OnboardingScreen(),
      ),
      GoRoute(
        path: AppRoutes.login,
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: AppRoutes.register,
        builder: (context, state) => const RegisterScreen(),
      ),
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) {
          return MainShellScreen(navigationShell: navigationShell);
        },
        branches: [
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: AppRoutes.home,
                builder: (context, state) => const HomeScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: AppRoutes.courses,
                builder: (context, state) => const CoursesScreen(),
                routes: [
                  GoRoute(
                    path: ':courseId',
                    builder: (context, state) {
                      final id = state.pathParameters['courseId']!;
                      final apiCourse = MockCatalog.courseById(id);
                      final summary = MockCatalog.enrolledSummaries.where((s) => s.courseId == id).firstOrNull;

                      final course = Course(
                        id: id,
                        title: apiCourse?.name ?? 'Course',
                        code: apiCourse?.code ?? 'N/A',
                        progressPercentage: summary?.progressPercent ?? 0,
                        modulesCompleted: summary?.modulesDone ?? 0,
                        totalModules: summary?.modulesTotal ?? 0,
                        timeSpentHours: 12.0,
                        averageGrade: 'A-',
                        badgesCount: 3,
                        projectsCount: 1,
                      );

                      const materials = <LectureMaterial>[
                        LectureMaterial(id: 'm1', title: 'Lecture Notes - Week 1', type: 'pdf', sizeOrDuration: '2.3 MB'),
                        LectureMaterial(id: 'm2', title: 'Lecture Recording - Intro', type: 'video', sizeOrDuration: '18 min'),
                        LectureMaterial(id: 'm3', title: 'Lab Sheet 01', type: 'pdf', sizeOrDuration: '1.1 MB'),
                      ];

                      return CourseDetailsScreen(
                        course: course,
                        materials: materials,
                        onBack: () => context.pop(),
                        onSummarizeMaterial: (_) {},
                        onAssistantAsk: () {},
                      );
                    },
                  ),
                ],
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: AppRoutes.stats,
                builder: (context, state) => const StatsScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: AppRoutes.profile,
                builder: (context, state) => const ProfileScreen(),
              ),
            ],
          ),
        ],
      ),
    ],
  );
});
