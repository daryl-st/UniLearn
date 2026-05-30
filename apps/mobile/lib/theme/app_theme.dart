import 'package:flutter/material.dart';

import 'app_radii.dart';
import 'app_spacing.dart';
import 'app_typography.dart';
import 'color_tokens.dart';
import 'uni_learn_theme_extension.dart';

/// UniLearn mobile [ThemeData] from [docs/DESIGN.md] (dark-first, shadcn-aligned).
abstract final class AppTheme {
  static ThemeData get dark {
    const scheme = ColorScheme(
      brightness: Brightness.dark,
      primary: ColorTokens.primary,
      onPrimary: ColorTokens.onPrimary,
      primaryContainer: ColorTokens.primaryContainer,
      onPrimaryContainer: ColorTokens.onPrimaryContainer,
      primaryFixed: ColorTokens.primaryFixed,
      primaryFixedDim: ColorTokens.primaryFixedDim,
      onPrimaryFixed: ColorTokens.onPrimaryFixed,
      onPrimaryFixedVariant: ColorTokens.onPrimaryFixedVariant,
      secondary: ColorTokens.secondary,
      onSecondary: ColorTokens.onSecondary,
      secondaryContainer: ColorTokens.secondaryContainer,
      onSecondaryContainer: ColorTokens.onSecondaryContainer,
      secondaryFixed: ColorTokens.secondaryFixed,
      secondaryFixedDim: ColorTokens.secondaryFixedDim,
      onSecondaryFixed: ColorTokens.onSecondaryFixed,
      onSecondaryFixedVariant: ColorTokens.onSecondaryFixedVariant,
      tertiary: ColorTokens.tertiary,
      onTertiary: ColorTokens.onTertiary,
      tertiaryContainer: ColorTokens.tertiaryContainer,
      onTertiaryContainer: ColorTokens.onTertiaryContainer,
      tertiaryFixed: ColorTokens.tertiaryFixed,
      tertiaryFixedDim: ColorTokens.tertiaryFixedDim,
      onTertiaryFixed: ColorTokens.onTertiaryFixed,
      onTertiaryFixedVariant: ColorTokens.onTertiaryFixedVariant,
      error: ColorTokens.error,
      onError: ColorTokens.onError,
      errorContainer: ColorTokens.errorContainer,
      onErrorContainer: ColorTokens.onErrorContainer,
      surface: ColorTokens.surface,
      onSurface: ColorTokens.onSurface,
      onSurfaceVariant: ColorTokens.onSurfaceVariant,
      surfaceDim: ColorTokens.surfaceDim,
      surfaceBright: ColorTokens.surfaceBright,
      surfaceContainerLowest: ColorTokens.surfaceContainerLowest,
      surfaceContainerLow: ColorTokens.surfaceContainerLow,
      surfaceContainer: ColorTokens.surfaceContainer,
      surfaceContainerHigh: ColorTokens.surfaceContainerHigh,
      surfaceContainerHighest: ColorTokens.surfaceContainerHighest,
      outline: ColorTokens.outline,
      outlineVariant: ColorTokens.outlineVariant,
      shadow: Color(0x66000000),
      scrim: Color(0x99000000),
      inverseSurface: ColorTokens.inverseSurface,
      onInverseSurface: ColorTokens.inverseOnSurface,
      inversePrimary: ColorTokens.inversePrimary,
      surfaceTint: ColorTokens.surfaceTint,
    );

    final textTheme = AppTypography.textTheme(scheme);
    final extras = UniLearnThemeExtension.dark;

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: scheme,
      scaffoldBackgroundColor: ColorTokens.background,
      canvasColor: ColorTokens.background,
      textTheme: textTheme,
      extensions: [extras],
      appBarTheme: AppBarTheme(
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: true,
        backgroundColor: ColorTokens.surfaceContainerLow,
        foregroundColor: ColorTokens.onSurface,
        titleTextStyle: textTheme.titleSmall,
        surfaceTintColor: Colors.transparent,
      ),
      cardTheme: CardThemeData(
        elevation: 0,
        color: ColorTokens.surfaceContainerLow,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadii.lg),
          side: BorderSide(color: extras.cardBorderColor),
        ),
      ),
      dividerTheme: DividerThemeData(
        color: ColorTokens.onSurface.withValues(alpha: 0.1),
        thickness: 1,
        space: 1,
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: ColorTokens.primary,
          foregroundColor: ColorTokens.onPrimary,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppRadii.sm),
          ),
          textStyle: textTheme.labelLarge?.copyWith(
            fontWeight: FontWeight.w600,
            color: ColorTokens.onPrimary,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: ColorTokens.onSurface,
          backgroundColor: ColorTokens.surfaceContainerHigh,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppRadii.sm),
          ),
          side: BorderSide(color: extras.cardBorderColor),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: ColorTokens.onSurfaceVariant,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppRadii.sm),
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: ColorTokens.surfaceContainerHigh,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadii.sm),
          borderSide: BorderSide(
            color: ColorTokens.onSurface.withValues(alpha: 0.05),
          ),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadii.sm),
          borderSide: BorderSide(
            color: ColorTokens.onSurface.withValues(alpha: 0.05),
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadii.sm),
          borderSide: BorderSide(color: extras.focusRingColor, width: 1),
        ),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.stackGap,
          vertical: 14,
        ),
        labelStyle: AppTypography.eyebrow(scheme),
        hintStyle: textTheme.bodyMedium?.copyWith(
          color: scheme.onSurfaceVariant.withValues(alpha: 0.2),
        ),
      ),
      progressIndicatorTheme: const ProgressIndicatorThemeData(
        color: ColorTokens.primary,
        linearTrackColor: ColorTokens.surfaceContainerHigh,
      ),
    );
  }
}
