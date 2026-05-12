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
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _bootstrap());
  }

  Future<void> _bootstrap() async {
    final notifier = ref.read(authSessionProvider.notifier);
    await notifier.tryRestore();

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
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.containerPadding),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ShaderMask(
                shaderCallback: (bounds) => extras.primaryGradient.createShader(bounds),
                child: Text(
                  'UniLearn',
                  style: Theme.of(context).textTheme.displaySmall?.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.w800,
                      ),
                  textAlign: TextAlign.center,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Academy',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      color: scheme.onSurfaceVariant,
                      fontWeight: FontWeight.w600,
                    ),
              ),
              const SizedBox(height: AppSpacing.sectionGap),
              Text(
                'Learn smarter with AI',
                style: Theme.of(context).textTheme.labelLarge,
              ),
              const SizedBox(height: AppSpacing.stackGap),
              Text(
                'Initializing academic core',
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              const SizedBox(height: AppSpacing.sectionGap),
              SizedBox(
                width: 200,
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: LinearProgressIndicator(
                    minHeight: 4,
                    backgroundColor: scheme.surfaceContainerHigh,
                    valueColor: AlwaysStoppedAnimation<Color>(scheme.primary),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
