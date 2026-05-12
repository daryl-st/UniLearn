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

  static const _pages = [
    _OnboardPageData(
      title: 'Your AI study partner',
      highlightWord: 'partner',
      body: 'Summarize lectures, generate quizzes, and track progress instantly.',
    ),
    _OnboardPageData(
      title: 'Stay exam-ready',
      highlightWord: 'exam-ready',
      body: 'Deadlines, streaks, and smart nudges keep you in rhythm.',
    ),
    _OnboardPageData(
      title: 'Built for focus',
      highlightWord: 'focus',
      body: 'A calm, cinematic workspace designed for deep work.',
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
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: Text('UniLearn', style: Theme.of(context).textTheme.titleMedium),
        actions: [
          TextButton(
            onPressed: () async {
              await _finishOnboardingAndGoLogin();
            },
            child: Text('Skip', style: TextStyle(color: scheme.secondary)),
          ),
        ],
      ),
      body: SafeArea(
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
                      color: active ? scheme.secondary : scheme.outlineVariant,
                      borderRadius: BorderRadius.circular(999),
                      boxShadow: active
                          ? [
                              BoxShadow(
                                color: scheme.secondary.withValues(alpha: 0.45),
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
                  label: _index == _pages.length - 1 ? 'Get started' : 'Next',
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
                      recognizer: TapGestureRecognizer()..onTap = _finishOnboardingAndGoLogin,
                    ),
                  ],
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
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
  });

  final String title;
  final String highlightWord;
  final String body;
}

class _OnboardPage extends StatelessWidget {
  const _OnboardPage({
    required this.data,
    required this.gradient,
  });

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
                  style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                        color: Colors.white,
                      ),
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

    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          height: 220,
          width: 220,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(24),
            gradient: LinearGradient(
              colors: [
                scheme.surfaceContainerHigh,
                scheme.surfaceContainer,
              ],
            ),
            border: Border.all(color: scheme.outlineVariant.withValues(alpha: 0.4)),
          ),
          child: Icon(Icons.auto_awesome, size: 72, color: scheme.primary.withValues(alpha: 0.9)),
        ),
        const SizedBox(height: AppSpacing.sectionGap),
        titleWidget,
        const SizedBox(height: AppSpacing.stackGap),
        Text(
          data.body,
          style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: scheme.onSurfaceVariant),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }
}
