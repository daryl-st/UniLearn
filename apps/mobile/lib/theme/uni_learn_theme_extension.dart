import 'package:flutter/material.dart';

import 'color_tokens.dart';

/// shadcn-style helpers beyond [ColorScheme] ([docs/DESIGN.md]).
@immutable
class UniLearnThemeExtension extends ThemeExtension<UniLearnThemeExtension> {
  const UniLearnThemeExtension({
    required this.cardBorderColor,
    required this.focusRingColor,
    required this.ambientShadow,
    required this.aiAccentTint,
  });

  final Color cardBorderColor;
  final Color focusRingColor;
  final List<BoxShadow> ambientShadow;
  final Color aiAccentTint;

  static final UniLearnThemeExtension dark = UniLearnThemeExtension(
    cardBorderColor: ColorTokens.outlineVariant,
    focusRingColor: ColorTokens.primary.withValues(alpha: 0.5),
    ambientShadow: const [
      BoxShadow(
        color: Color(0xA6000000),
        blurRadius: 40,
        offset: Offset(0, 20),
      ),
    ],
    aiAccentTint: ColorTokens.primary.withValues(alpha: 0.1),
  );

  /// Flat card decoration (web `bg-card` + border).
  BoxDecoration cardDecoration({Color? color, double radius = 12}) {
    return BoxDecoration(
      color: color ?? ColorTokens.surfaceContainerLow,
      borderRadius: BorderRadius.circular(radius),
      border: Border.all(color: cardBorderColor),
    );
  }

  @override
  UniLearnThemeExtension copyWith({
    Color? cardBorderColor,
    Color? focusRingColor,
    List<BoxShadow>? ambientShadow,
    Color? aiAccentTint,
  }) {
    return UniLearnThemeExtension(
      cardBorderColor: cardBorderColor ?? this.cardBorderColor,
      focusRingColor: focusRingColor ?? this.focusRingColor,
      ambientShadow: ambientShadow ?? this.ambientShadow,
      aiAccentTint: aiAccentTint ?? this.aiAccentTint,
    );
  }

  @override
  UniLearnThemeExtension lerp(
    ThemeExtension<UniLearnThemeExtension>? other,
    double t,
  ) {
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
