import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/providers/auth_session_provider.dart';
import 'package:mobile/core/routing/app_routes.dart';
import 'package:mobile/theme/app_radii.dart';
import 'package:mobile/theme/app_spacing.dart';
import 'package:mobile/theme/app_typography.dart';
import 'package:mobile/theme/color_tokens.dart';
import 'package:google_fonts/google_fonts.dart';

class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen> {
  static const _minSplashDuration = Duration(milliseconds: 1800);

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

    return Scaffold(
      backgroundColor: ColorTokens.background,
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.containerPadding,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Container(
                  width: 72,
                  height: 72,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: scheme.surfaceContainerHigh,
                    borderRadius: BorderRadius.circular(AppRadii.lg),
                    border: Border.all(color: scheme.outlineVariant),
                  ),
                  child: Icon(Icons.school, color: scheme.primary, size: 32),
                ),
                const SizedBox(height: AppSpacing.stackGap),
                Text(
                  'UniLearn',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.spaceGrotesk(
                    fontSize: 32,
                    fontWeight: FontWeight.w700,
                    color: scheme.onSurface,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  'Academy',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: scheme.onSurfaceVariant,
                  ),
                ),
                const SizedBox(height: AppSpacing.sectionGap),
                Text(
                  'INITIALIZING',
                  textAlign: TextAlign.center,
                  style: AppTypography.eyebrow(scheme),
                ),
                const SizedBox(height: AppSpacing.stackGap),
                SizedBox(
                  width: 200,
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(AppRadii.full),
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
      ),
    );
  }
}
