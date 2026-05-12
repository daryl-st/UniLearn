import 'package:flutter/material.dart';

import 'color_tokens.dart';

/// Effects and tokens beyond [ColorScheme] ([docs/DESIGN.md] gradients, glow, glass).
@immutable
class UniLearnThemeExtension extends ThemeExtension<UniLearnThemeExtension> {
  const UniLearnThemeExtension({
    required this.primaryGradient,
    required this.primaryButtonGlow,
    required this.aiInputGlow,
    required this.glassFill,
    required this.glassBorder,
    required this.glassBlurSigma,
  });

  final LinearGradient primaryGradient;
  final List<BoxShadow> primaryButtonGlow;
  final List<BoxShadow> aiInputGlow;
  final Color glassFill;
  final Color glassBorder;
  final double glassBlurSigma;

  static final UniLearnThemeExtension dark = UniLearnThemeExtension(
    primaryGradient: const LinearGradient(
      colors: [ColorTokens.primary, ColorTokens.secondary],
      begin: Alignment.centerLeft,
      end: Alignment.centerRight,
    ),
    primaryButtonGlow: [
      BoxShadow(
        color: ColorTokens.primary.withValues(alpha: 0.35),
        blurRadius: 24,
        spreadRadius: 0,
      ),
      BoxShadow(
        color: ColorTokens.secondary.withValues(alpha: 0.22),
        blurRadius: 32,
        spreadRadius: 2,
      ),
    ],
    aiInputGlow: [
      BoxShadow(
        color: ColorTokens.secondary.withValues(alpha: 0.28),
        blurRadius: 14,
        spreadRadius: 0,
      ),
    ],
    glassFill: const Color(0x14FFFFFF),
    glassBorder: const Color(0x1FFFFFFF),
    glassBlurSigma: 28,
  );

  @override
  UniLearnThemeExtension copyWith({
    LinearGradient? primaryGradient,
    List<BoxShadow>? primaryButtonGlow,
    List<BoxShadow>? aiInputGlow,
    Color? glassFill,
    Color? glassBorder,
    double? glassBlurSigma,
  }) {
    return UniLearnThemeExtension(
      primaryGradient: primaryGradient ?? this.primaryGradient,
      primaryButtonGlow: primaryButtonGlow ?? this.primaryButtonGlow,
      aiInputGlow: aiInputGlow ?? this.aiInputGlow,
      glassFill: glassFill ?? this.glassFill,
      glassBorder: glassBorder ?? this.glassBorder,
      glassBlurSigma: glassBlurSigma ?? this.glassBlurSigma,
    );
  }

  @override
  UniLearnThemeExtension lerp(ThemeExtension<UniLearnThemeExtension>? other, double t) {
    if (other is! UniLearnThemeExtension) return this;
    if (t <= 0) return this;
    if (t >= 1) return other;
    return t < 0.5 ? this : other;
  }
}

extension UniLearnThemeExtensionX on BuildContext {
  UniLearnThemeExtension get uniLearnExtras {
    final ext = Theme.of(this).extension<UniLearnThemeExtension>();
    assert(ext != null, 'UniLearnThemeExtension not registered on ThemeData');
    return ext!;
  }
}
