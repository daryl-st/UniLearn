import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/providers/auth_session_provider.dart';
import 'package:mobile/core/routing/app_routes.dart';
import 'package:mobile/core/widgets/widgets.dart';
import 'package:mobile/theme/app_radii.dart';
import 'package:mobile/theme/app_spacing.dart';
import 'package:mobile/theme/app_typography.dart';
import 'package:mobile/theme/color_tokens.dart';

final onboardingPageIndexProvider = StateProvider.autoDispose<int>((ref) => 0);

class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  final PageController _pageController = PageController();

  static const _pages = [
    _OnboardPageData(
      title: 'Your AI study partner',
      body:
          'Summarize lectures, generate quizzes, and track progress instantly.',
      icon: Icons.auto_awesome_outlined,
    ),
    _OnboardPageData(
      title: 'Stay exam-ready',
      body: 'Deadlines, streaks, and smart nudges keep you in rhythm.',
      icon: Icons.event_note_outlined,
    ),
    _OnboardPageData(
      title: 'Built for focus',
      body: 'A calm workspace designed for deep work.',
      icon: Icons.center_focus_strong_outlined,
    ),
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  Future<void> _finishOnboardingAndGoLogin() async {
    await ref.read(authSessionProvider.notifier).setOnboardingCompleted();
    if (!mounted) return;
    context.go(AppRoutes.login);
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final index = ref.watch(onboardingPageIndexProvider);

    return Scaffold(
      backgroundColor: ColorTokens.background,
      body: Stack(
        children: [
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.containerPadding),
              child: Column(
                children: [
                  Expanded(
                    child: PageView.builder(
                      controller: _pageController,
                      itemCount: _pages.length,
                      onPageChanged: (i) =>
                          ref.read(onboardingPageIndexProvider.notifier).state =
                              i,
                      itemBuilder: (context, i) {
                        return _OnboardPage(data: _pages[i]);
                      },
                    ),
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(_pages.length, (i) {
                      final active = i == index;
                      return AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        margin: const EdgeInsets.symmetric(horizontal: 4),
                        height: 4,
                        width: active ? 24 : 4,
                        decoration: BoxDecoration(
                          color: active
                              ? scheme.primary
                              : scheme.surfaceContainerHighest,
                          borderRadius: BorderRadius.circular(AppRadii.full),
                        ),
                      );
                    }),
                  ),
                  const SizedBox(height: AppSpacing.stackGap),
                  SizedBox(
                    width: double.infinity,
                    child: GradientCtaButton(
                      label: index == _pages.length - 1
                          ? 'Get started'
                          : 'Next',
                      icon: Icons.arrow_forward,
                      onPressed: () async {
                        if (index < _pages.length - 1) {
                          await _pageController.nextPage(
                            duration: const Duration(milliseconds: 300),
                            curve: Curves.easeOutCubic,
                          );
                        } else {
                          await _finishOnboardingAndGoLogin();
                        }
                      },
                    ),
                  ),
                  const SizedBox(height: AppSpacing.stackGap),
                  Text.rich(
                    TextSpan(
                      text: 'Already have an account? ',
                      style: Theme.of(context).textTheme.bodyMedium,
                      children: [
                        TextSpan(
                          text: 'Log in',
                          style: TextStyle(
                            color: scheme.secondary,
                            fontWeight: FontWeight.w600,
                          ),
                          recognizer: TapGestureRecognizer()
                            ..onTap = _finishOnboardingAndGoLogin,
                        ),
                      ],
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          ),
          Positioned(
            top: 16,
            right: 16,
            child: SafeArea(
              child: TextButton(
                onPressed: _finishOnboardingAndGoLogin,
                child: Text(
                  'Skip',
                  style: Theme.of(context).textTheme.labelLarge?.copyWith(
                    color: scheme.onSurfaceVariant,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _OnboardPageData {
  const _OnboardPageData({
    required this.title,
    required this.body,
    required this.icon,
  });

  final String title;
  final String body;
  final IconData icon;
}

class _OnboardPage extends StatelessWidget {
  const _OnboardPage({required this.data});

  final _OnboardPageData data;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        UniCard(
          padding: const EdgeInsets.all(32),
          child: Column(
            children: [
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  color: scheme.surfaceContainerHigh,
                  borderRadius: BorderRadius.circular(AppRadii.lg),
                  border: Border.all(color: scheme.outlineVariant),
                ),
                child: Icon(data.icon, color: scheme.primary, size: 28),
              ),
            ],
          ),
        ),
        const SizedBox(height: AppSpacing.sectionGap),
        Text(
          data.title,
          style: Theme.of(context).textTheme.headlineMedium,
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: AppSpacing.stackGap),
        Text(
          data.body,
          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
            color: scheme.onSurfaceVariant,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: AppSpacing.stackGap),
        Text(
          'ONBOARDING',
          style: AppTypography.eyebrow(scheme),
        ),
      ],
    );
  }
}
