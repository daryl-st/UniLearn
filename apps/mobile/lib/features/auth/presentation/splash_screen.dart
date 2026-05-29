import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/providers/auth_session_provider.dart';
import 'package:mobile/core/routing/app_routes.dart';
import 'package:mobile/theme/app_spacing.dart';
import 'package:mobile/theme/uni_learn_theme_extension.dart';

class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen> {
  static const _minSplashDuration = Duration(milliseconds: 1800);
  static const _backgroundImageUrl =
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB8eEmwxGtwcZGuL78pXL9F0XDxuX3q6KfZUCJdg2R2Z4DGNAfqI5P0o3JMNlGcjljZX0xrScWv5bE_7oSNOfmsnqzY6kQSF71qfYoSJUT-MfRlBxz9b-K1-IV8CSZLu1eCgE2h4mnFS7-HppKZ_NvF6UAjj4Gcop51PKeZI1aY-scIILL8smc6-Ywq8H1hcYh2twu2x6Tv3RPGTYDSd0PVGuX4exp7hPoc6C5wAE9aPYqHSwvBdBWIVXsYNWq3-pm0Zup2Oo577RJm';

  late final DateTime _openedAt = DateTime.now();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _bootstrap());
  }

  Future<void> _bootstrap() async {
    final notifier = ref.read(authSessionProvider.notifier);
    await notifier.tryRestore();

    final elapsed = DateTime.now().difference(_openedAt);
    final remaining = _minSplashDuration - elapsed;
    if (remaining > Duration.zero) {
      await Future<void>.delayed(remaining);
    }

    if (!mounted) return;

    if (ref.read(authSessionProvider).isAuthenticated) {
      context.go(AppRoutes.home);
      return;
    }

    if (!notifier.onboardingCompleted) {
      context.go(AppRoutes.onboarding);
      return;
    }

    await Future<void>.delayed(const Duration(milliseconds: 900));
    if (!mounted) return;
    context.go(AppRoutes.login);
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final extras = context.uniLearnExtras;

    return Scaffold(
      body: SafeArea(
        child: Stack(
          fit: StackFit.expand,
          children: [
            Image.network(
              _backgroundImageUrl,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) {
                return Container(color: scheme.surface);
              },
            ),
            DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    scheme.surface.withValues(alpha: 0.30),
                    scheme.surface.withValues(alpha: 0.58),
                    scheme.surface.withValues(alpha: 0.86),
                  ],
                ),
              ),
            ),
            DecoratedBox(
              decoration: BoxDecoration(
                gradient: RadialGradient(
                  center: Alignment.topCenter,
                  radius: 1.15,
                  colors: [
                    extras.primaryGradient.colors.first.withValues(alpha: 0.20),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(AppSpacing.containerPadding),
              child: Column(
                children: [
                  const Spacer(flex: 2),
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: scheme.surfaceContainerHigh.withValues(
                        alpha: 0.52,
                      ),
                      borderRadius: BorderRadius.circular(28),
                      border: Border.all(
                        color: scheme.outlineVariant.withValues(alpha: 0.28),
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: scheme.shadow.withValues(alpha: 0.18),
                          blurRadius: 28,
                          offset: const Offset(0, 14),
                        ),
                      ],
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        ShaderMask(
                          shaderCallback: (bounds) =>
                              extras.primaryGradient.createShader(bounds),
                          child: Text(
                            'UniLearn',
                            style: Theme.of(context).textTheme.displaySmall
                                ?.copyWith(
                                  color: Colors.white,
                                  fontWeight: FontWeight.w900,
                                ),
                            textAlign: TextAlign.center,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          'Academy',
                          style: Theme.of(context).textTheme.titleLarge
                              ?.copyWith(
                                color: scheme.onSurfaceVariant,
                                fontWeight: FontWeight.w700,
                                letterSpacing: 0.5,
                              ),
                        ),
                        const SizedBox(height: AppSpacing.stackGap),
                        Text(
                          'Learn smarter with AI',
                          style: Theme.of(context).textTheme.labelLarge
                              ?.copyWith(
                                color: scheme.onSurface.withValues(alpha: 0.88),
                              ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sectionGap),
                  Text(
                    'Initializing academic core',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: scheme.onSurfaceVariant,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sectionGap),
                  SizedBox(
                    width: 220,
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(999),
                      child: LinearProgressIndicator(
                        minHeight: 5,
                        backgroundColor: scheme.surfaceContainerHigh.withValues(
                          alpha: 0.8,
                        ),
                        valueColor: AlwaysStoppedAnimation<Color>(
                          scheme.secondary,
                        ),
                      ),
                    ),
                  ),
                  const Spacer(flex: 3),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
