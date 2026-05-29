import 'dart:ui';

import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/providers/auth_session_provider.dart';
import 'package:mobile/core/routing/app_routes.dart';
import 'package:mobile/core/widgets/widgets.dart';
import 'package:mobile/theme/app_spacing.dart';
import 'package:mobile/theme/uni_learn_theme_extension.dart';

class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _index = 0;

  static const _imageUrl =
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCd2f_sjcHXIxK5-vjcV3crxZZbYQ-9MnavBsJxNzkQYdRBGpFxWy48q7sNstg3LhSMcTLXJ6OBnlYUBgHp4hd-xmLltdFA1LroFrnzKjgJ4HSWXoTbuQGGI0aLV83CQr6XZoBMZSyMQaxd_TtWcw-nExp1qlNvVeYxfUQs6Qz7e1zIxlrMDBgmwJTjW1xX52wnbQlE4hCcj9S_gCojITarFWDV8rGb5IcVJlGiDadlimqw4wcngxovFxEN5Xgseq0H0bchB9xVgXjj';

  static const _pages = [
    _OnboardPageData(
      title: 'Your AI study partner',
      highlightWord: 'partner',
      body:
          'Summarize lectures, generate quizzes, and track progress instantly.',
      imageUrl: _imageUrl,
    ),
    _OnboardPageData(
      title: 'Stay exam-ready',
      highlightWord: 'exam-ready',
      body: 'Deadlines, streaks, and smart nudges keep you in rhythm.',
      imageUrl: _imageUrl,
    ),
    _OnboardPageData(
      title: 'Built for focus',
      highlightWord: 'focus',
      body: 'A calm, cinematic workspace designed for deep work.',
      imageUrl: _imageUrl,
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
    final extras = context.uniLearnExtras;

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              scheme.surface,
              scheme.surface.withValues(alpha: 0.96),
              scheme.surfaceContainerLowest,
            ],
          ),
        ),
        child: Stack(
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
                        onPageChanged: (i) => setState(() => _index = i),
                        itemBuilder: (context, i) {
                          final p = _pages[i];
                          return _OnboardPage(
                            data: p,
                            gradient: extras.primaryGradient,
                          );
                        },
                      ),
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(_pages.length, (i) {
                        final active = i == _index;
                        return AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          margin: const EdgeInsets.symmetric(horizontal: 4),
                          height: 6,
                          width: active ? 28 : 6,
                          decoration: BoxDecoration(
                            color: active
                                ? scheme.secondary
                                : scheme.outlineVariant,
                            borderRadius: BorderRadius.circular(999),
                            boxShadow: active
                                ? [
                                    BoxShadow(
                                      color: scheme.secondary.withValues(
                                        alpha: 0.45,
                                      ),
                                      blurRadius: 10,
                                    ),
                                  ]
                                : null,
                          ),
                        );
                      }),
                    ),
                    const SizedBox(height: AppSpacing.stackGap),
                    SizedBox(
                      width: double.infinity,
                      child: GradientCtaButton(
                        label: _index == _pages.length - 1
                            ? 'Get started'
                            : 'Next',
                        icon: Icons.arrow_forward,
                        onPressed: () async {
                          if (_index < _pages.length - 1) {
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
                              fontWeight: FontWeight.w700,
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
                child: Container(
                  decoration: BoxDecoration(
                    color: scheme.surfaceContainerHigh.withValues(alpha: 0.85),
                    borderRadius: BorderRadius.circular(999),
                    border: Border.all(
                      color: scheme.outlineVariant.withValues(alpha: 0.35),
                    ),
                  ),
                  child: Material(
                    type: MaterialType.transparency,
                    child: InkWell(
                      onTap: _finishOnboardingAndGoLogin,
                      borderRadius: BorderRadius.circular(999),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 10,
                        ),
                        child: Text(
                          'Skip',
                          style: Theme.of(context).textTheme.labelLarge
                              ?.copyWith(
                                color: scheme.secondary,
                                fontWeight: FontWeight.w700,
                              ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _OnboardPageData {
  const _OnboardPageData({
    required this.title,
    required this.highlightWord,
    required this.body,
    required this.imageUrl,
  });

  final String title;
  final String highlightWord;
  final String body;
  final String imageUrl;
}

class _OnboardPage extends StatelessWidget {
  const _OnboardPage({required this.data, required this.gradient});

  final _OnboardPageData data;
  final LinearGradient gradient;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final lower = data.title.toLowerCase();
    final hw = data.highlightWord.toLowerCase();
    final idx = lower.indexOf(hw);

    Widget titleWidget;
    if (idx >= 0) {
      final before = data.title.substring(0, idx);
      final mid = data.title.substring(idx, idx + data.highlightWord.length);
      final after = data.title.substring(idx + data.highlightWord.length);
      titleWidget = Text.rich(
        TextSpan(
          style: Theme.of(context).textTheme.headlineLarge,
          children: [
            TextSpan(text: before),
            WidgetSpan(
              alignment: PlaceholderAlignment.baseline,
              baseline: TextBaseline.alphabetic,
              child: ShaderMask(
                shaderCallback: (b) => gradient.createShader(b),
                child: Text(
                  mid,
                  style: Theme.of(
                    context,
                  ).textTheme.headlineLarge?.copyWith(color: Colors.white),
                ),
              ),
            ),
            TextSpan(text: after),
          ],
        ),
        textAlign: TextAlign.center,
      );
    } else {
      titleWidget = Text(
        data.title,
        style: Theme.of(context).textTheme.headlineLarge,
        textAlign: TextAlign.center,
      );
    }

    return LayoutBuilder(
      builder: (context, constraints) {
        final imageHeight = constraints.maxHeight.isFinite
            ? constraints.maxHeight * 0.62
            : 360.0;

        return Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(
              width: double.infinity,
              height: imageHeight,
              child: DecoratedBox(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(34),
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      scheme.primary.withValues(alpha: 0.14),
                      scheme.secondary.withValues(alpha: 0.10),
                      scheme.surfaceContainerHighest.withValues(alpha: 0.96),
                    ],
                  ),
                  border: Border.all(
                    color: scheme.outlineVariant.withValues(alpha: 0.32),
                    width: 1.2,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: scheme.shadow.withValues(alpha: 0.18),
                      blurRadius: 30,
                      offset: const Offset(0, 16),
                    ),
                  ],
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(34),
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      Image.network(
                        data.imageUrl,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return Container(
                            color: scheme.surfaceContainer,
                            child: Icon(
                              Icons.image_not_supported_outlined,
                              size: 64,
                              color: scheme.onSurfaceVariant,
                            ),
                          );
                        },
                      ),
                      DecoratedBox(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              scheme.surface.withValues(alpha: 0.10),
                              scheme.primary.withValues(alpha: 0.12),
                              scheme.surface.withValues(alpha: 0.26),
                            ],
                          ),
                        ),
                      ),
                      DecoratedBox(
                        decoration: BoxDecoration(
                          gradient: RadialGradient(
                            center: Alignment.topRight,
                            radius: 1.1,
                            colors: [
                              scheme.secondary.withValues(alpha: 0.18),
                              Colors.transparent,
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: AppSpacing.sectionGap),
            titleWidget,
            const SizedBox(height: AppSpacing.stackGap),
            Text(
              data.body,
              style: Theme.of(
                context,
              ).textTheme.bodyLarge?.copyWith(color: scheme.onSurfaceVariant),
              textAlign: TextAlign.center,
            ),
          ],
        );
      },
    );
  }
}
