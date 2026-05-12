import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/providers/auth_session_provider.dart';
import 'package:mobile/core/routing/app_routes.dart';
import 'package:mobile/core/widgets/widgets.dart';
import 'package:mobile/theme/app_spacing.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _email = TextEditingController(text: 'student@university.edu');
  final _password = TextEditingController();
  bool _obscure = true;

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    await ref.read(authSessionProvider.notifier).signInWithMockCredentials(
          email: _email.text.trim(),
          password: _password.text,
        );
    if (!mounted) return;
    context.go(AppRoutes.home);
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.containerPadding),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 12),
              Text(
                'UniLearn',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.w800,
                      color: scheme.secondary,
                    ),
              ),
              const SizedBox(height: AppSpacing.sectionGap),
              GlassPanel(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Text(
                      'Intellectual access',
                      style: Theme.of(context).textTheme.headlineMedium,
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Resume your high-performance academic journey.',
                      style: Theme.of(context).textTheme.bodyMedium,
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: AppSpacing.stackGap),
                    LabeledTextField(
                      label: 'Institutional email',
                      hint: 'student@university.edu',
                      controller: _email,
                      keyboardType: TextInputType.emailAddress,
                      prefixIcon: Icons.mail_outline,
                    ),
                    const SizedBox(height: AppSpacing.stackGap),
                    Row(
                      children: [
                        Expanded(
                          child: LabeledTextField(
                            label: 'Secure passcode',
                            hint: '••••••••',
                            controller: _password,
                            obscureText: _obscure,
                            prefixIcon: Icons.lock_outline,
                            suffixIcon: IconButton(
                              onPressed: () => setState(() => _obscure = !_obscure),
                              icon: Icon(
                                _obscure ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                                color: scheme.onSurfaceVariant,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    Align(
                      alignment: Alignment.centerRight,
                      child: TextButton(
                        onPressed: () {},
                        child: Text(
                          'Forgot password?',
                          style: TextStyle(color: scheme.secondary, fontWeight: FontWeight.w600),
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                    GradientCtaButton(label: 'Sign in', onPressed: _submit),
                    const SizedBox(height: AppSpacing.stackGap),
                    Row(
                      children: [
                        Expanded(child: Divider(color: scheme.outlineVariant.withValues(alpha: 0.5))),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          child: Text(
                            'EXTERNAL ACCESS',
                            style: Theme.of(context).textTheme.labelSmall,
                          ),
                        ),
                        Expanded(child: Divider(color: scheme.outlineVariant.withValues(alpha: 0.5))),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.stackGap),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: () {},
                            icon: const Text('G', style: TextStyle(fontWeight: FontWeight.w800)),
                            label: const Text('Google'),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () {},
                            child: const Text('Apple'),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.stackGap),
              Text.rich(
                TextSpan(
                  text: 'New to UniLearn? ',
                  style: Theme.of(context).textTheme.bodyMedium,
                  children: [
                    TextSpan(
                      text: 'Create account',
                      style: TextStyle(color: scheme.secondary, fontWeight: FontWeight.w700),
                      recognizer: TapGestureRecognizer()
                        ..onTap = () => context.push(AppRoutes.register),
                    ),
                  ],
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: AppSpacing.sectionGap),
              Wrap(
                alignment: WrapAlignment.center,
                spacing: 16,
                runSpacing: 8,
                children: [
                  Text('Privacy', style: Theme.of(context).textTheme.bodySmall),
                  Text('Terms', style: Theme.of(context).textTheme.bodySmall),
                  Text('System status', style: Theme.of(context).textTheme.bodySmall),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
