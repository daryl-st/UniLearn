import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/api/api_exception.dart';
import 'package:mobile/core/providers/auth_session_provider.dart';
import 'package:mobile/core/routing/app_routes.dart';
import 'package:mobile/core/validation/auth_validation.dart';
import 'package:mobile/features/auth/presentation/widgets/auth_error_banner.dart';
import 'package:mobile/core/widgets/widgets.dart';
import 'package:mobile/theme/app_spacing.dart';
import 'package:mobile/theme/app_typography.dart';
import 'package:mobile/theme/color_tokens.dart';

final loginPasswordObscureProvider = StateProvider.autoDispose<bool>(
  (ref) => true,
);

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _email = TextEditingController();
  final _password = TextEditingController();
  String? _emailError;
  String? _passwordError;
  String? _apiError;
  bool _isLoading = false;

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final emailError = AuthValidation.emailError(_email.text);
    final passwordError = AuthValidation.passwordError(_password.text);

    setState(() {
      _emailError = emailError;
      _passwordError = passwordError;
      _apiError = null;
    });

    if (emailError != null || passwordError != null) return;

    setState(() => _isLoading = true);
    try {
      await ref.read(authSessionProvider.notifier).signIn(
            email: _email.text.trim(),
            password: _password.text,
          );
      if (!mounted) return;
      context.go(AppRoutes.home);
    } on ApiException catch (e) {
      if (!mounted) return;
      setState(() => _apiError = e.message);
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final obscure = ref.watch(loginPasswordObscureProvider);

    return Scaffold(
      backgroundColor: ColorTokens.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.containerPadding),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 24),
              Text(
                'SECURE ACCESS',
                style: AppTypography.eyebrow(scheme),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: AppSpacing.stackGap),
              Text(
                'Welcome back',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.displaySmall,
              ),
              const SizedBox(height: 8),
              Text(
                'Sign in with your AAU email to continue.',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: scheme.onSurfaceVariant,
                  height: 1.45,
                ),
              ),
              const SizedBox(height: AppSpacing.sectionGap),
              GlassPanel(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    if (_apiError != null) ...[
                      AuthErrorBanner(message: _apiError!),
                      const SizedBox(height: AppSpacing.stackGap),
                    ],
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: scheme.surfaceContainerHigh,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: scheme.outlineVariant),
                          ),
                          child: Icon(
                            Icons.school_outlined,
                            color: scheme.primary,
                            size: 18,
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Sign in to your workspace',
                                style: Theme.of(context).textTheme.titleSmall
                                    ?.copyWith(fontWeight: FontWeight.w600),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                'Enter your university credentials.',
                                style: Theme.of(context).textTheme.labelSmall
                                    ?.copyWith(color: scheme.onSurfaceVariant),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.sectionGap),
                    LabeledTextField(
                      label: 'University email',
                      hint: 'username@aau.edu.et',
                      controller: _email,
                      keyboardType: TextInputType.emailAddress,
                      prefixIcon: Icons.mail_outline,
                      errorText: _emailError,
                    ),
                    const SizedBox(height: AppSpacing.stackGap),
                    LabeledTextField(
                      label: 'Password',
                      hint: 'Enter your password',
                      controller: _password,
                      obscureText: obscure,
                      prefixIcon: Icons.lock_outline,
                      errorText: _passwordError,
                      suffixIcon: IconButton(
                        onPressed: () =>
                            ref
                                    .read(
                                      loginPasswordObscureProvider.notifier,
                                    )
                                    .state =
                                !obscure,
                        icon: Icon(
                          obscure
                              ? Icons.visibility_outlined
                              : Icons.visibility_off_outlined,
                          color: scheme.onSurfaceVariant,
                        ),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Align(
                      alignment: Alignment.centerRight,
                      child: TextButton(
                        onPressed: () {},
                        child: Text(
                          'Forgot password?',
                          style: TextStyle(
                            color: scheme.secondary,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                    GradientCtaButton(
                      label: 'Sign in',
                      onPressed: _isLoading ? null : _submit,
                      icon: Icons.arrow_forward_rounded,
                    ),
                    const SizedBox(height: AppSpacing.sectionGap),
                    Row(
                      children: [
                        Expanded(
                          child: Divider(
                            color: scheme.outlineVariant,
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          child: Text(
                            'OR CONTINUE WITH',
                            style: AppTypography.eyebrow(scheme, opacity: 0.5),
                          ),
                        ),
                        Expanded(
                          child: Divider(
                            color: scheme.outlineVariant,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.stackGap),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: () {},
                            icon: const Text(
                              'G',
                              style: TextStyle(fontWeight: FontWeight.w800),
                            ),
                            label: const Text('Google'),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: () {},
                            icon: const Icon(Icons.apple),
                            label: const Text('Apple'),
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
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: scheme.onSurfaceVariant,
                  ),
                  children: [
                    TextSpan(
                      text: 'Create account',
                      style: TextStyle(
                        color: scheme.secondary,
                        fontWeight: FontWeight.w600,
                      ),
                      recognizer: TapGestureRecognizer()
                        ..onTap = () => context.push(AppRoutes.register),
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
