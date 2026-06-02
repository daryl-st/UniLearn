import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/providers/auth_session_provider.dart';
import 'package:mobile/core/routing/app_routes.dart';
import 'package:mobile/features/auth/presentation/login_screen.dart';
import 'package:mobile/features/auth/presentation/onboarding_screen.dart';
import 'package:mobile/features/auth/presentation/register_screen.dart';
import 'package:mobile/features/auth/presentation/splash_screen.dart';
import 'package:mobile/features/courses/presentation/course_detail_route_screen.dart';
import 'package:mobile/features/courses/presentation/course_detail_screen.dart';
import 'package:mobile/features/courses/presentation/courses_screen.dart';
import 'package:mobile/features/ai/presentation/quiz_take_screen.dart';
import 'package:mobile/features/courses/presentation/pdf_viewer_screen.dart';
import 'package:mobile/features/home/presentation/home_screen.dart';
import 'package:mobile/features/profile/presentation/profile_screen.dart';
import 'package:mobile/features/shell/presentation/main_shell_screen.dart';
import 'package:mobile/features/stats/presentation/stats_screen.dart';

final _routerRefreshProvider = Provider<RouterRefreshNotifier>((ref) {
  final notifier = RouterRefreshNotifier();
  ref.listen(authSessionProvider, (_, _) => notifier.notify());
  ref.onDispose(notifier.dispose);
  return notifier;
});

final routerProvider = Provider<GoRouter>((ref) {
  final refresh = ref.watch(_routerRefreshProvider);

  return GoRouter(
    initialLocation: AppRoutes.splash,
    refreshListenable: refresh,
    redirect: (context, state) {
      final auth = ref.read(authSessionProvider);
      final location = state.matchedLocation;
      final isAuthenticated = auth.isAuthenticated;

      if (location == AppRoutes.splash || location == AppRoutes.onboarding) {
        return null;
      }

      if (isAuthenticated &&
          (location == AppRoutes.login || location == AppRoutes.register)) {
        return AppRoutes.home;
      }

      if (!isAuthenticated && _requiresAuth(location)) {
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
      GoRoute(
        path: AppRoutes.pdfViewer,
        builder: (context, state) {
          final material = state.extra as LectureMaterial?;
          return PdfViewerScreen(material: material);
        },
      ),
      GoRoute(
        path: AppRoutes.quizTake,
        builder: (context, state) {
          final args = state.extra as QuizTakeArgs?;
          return QuizTakeScreen(
            args: args ?? const QuizTakeArgs(quizId: '', title: 'Quiz'),
          );
        },
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
                      return CourseDetailRouteScreen(
                        courseId: id,
                        onBack: () => context.pop(),
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

bool _requiresAuth(String location) {
  return location.startsWith(AppRoutes.home) ||
      location.startsWith(AppRoutes.courses) ||
      location.startsWith(AppRoutes.stats) ||
      location.startsWith(AppRoutes.profile) ||
      location.startsWith(AppRoutes.pdfViewer) ||
      location.startsWith(AppRoutes.quizTake);
}

final class RouterRefreshNotifier extends ChangeNotifier {
  void notify() => notifyListeners();
}
