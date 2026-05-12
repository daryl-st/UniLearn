import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'color_tokens.dart';

/// Text styles from [docs/DESIGN.md] typography YAML (Plus Jakarta Sans, Inter; Geist
/// is specified in DESIGN — [GoogleFonts] does not expose Geist yet, so Inter is used for labels).
abstract final class AppTypography {
  static TextTheme textTheme(ColorScheme scheme) {
    final onSurface = scheme.onSurface;
    final onSurfaceVariant = scheme.onSurfaceVariant;

    final displayLarge = GoogleFonts.plusJakartaSans(
      fontSize: 40,
      fontWeight: FontWeight.w800,
      height: 48 / 40,
      letterSpacing: -0.02 * 40,
      color: onSurface,
    );
    final headlineLarge = GoogleFonts.plusJakartaSans(
      fontSize: 32,
      fontWeight: FontWeight.w700,
      height: 40 / 32,
      letterSpacing: -0.01 * 32,
      color: onSurface,
    );
    final headlineMedium = GoogleFonts.plusJakartaSans(
      fontSize: 24,
      fontWeight: FontWeight.w700,
      height: 32 / 24,
      color: onSurface,
    );
    final bodyLarge = GoogleFonts.inter(
      fontSize: 16,
      fontWeight: FontWeight.w400,
      height: 24 / 16,
      color: onSurface,
    );
    final bodyMedium = GoogleFonts.inter(
      fontSize: 14,
      fontWeight: FontWeight.w400,
      height: 20 / 14,
      color: onSurfaceVariant,
    );
    final labelMedium = GoogleFonts.inter(
      fontSize: 12,
      fontWeight: FontWeight.w500,
      height: 16 / 12,
      letterSpacing: 0.05 * 12,
      color: onSurfaceVariant,
    );

    return TextTheme(
      displayLarge: displayLarge,
      displayMedium: displayLarge.copyWith(fontSize: 36, height: 44 / 36),
      displaySmall: displayLarge.copyWith(fontSize: 32, height: 40 / 32),
      headlineLarge: headlineLarge,
      headlineMedium: headlineMedium,
      headlineSmall: GoogleFonts.plusJakartaSans(
        fontSize: 20,
        fontWeight: FontWeight.w600,
        height: 28 / 20,
        color: onSurface,
      ),
      titleLarge: headlineMedium,
      titleMedium: GoogleFonts.plusJakartaSans(
        fontSize: 18,
        fontWeight: FontWeight.w600,
        height: 24 / 18,
        color: onSurface,
      ),
      titleSmall: GoogleFonts.inter(
        fontSize: 14,
        fontWeight: FontWeight.w600,
        height: 20 / 14,
        color: onSurface,
      ),
      bodyLarge: bodyLarge,
      bodyMedium: bodyMedium,
      bodySmall: GoogleFonts.inter(
        fontSize: 12,
        fontWeight: FontWeight.w400,
        height: 16 / 12,
        color: onSurfaceVariant,
      ),
      labelLarge: GoogleFonts.inter(
        fontSize: 14,
        fontWeight: FontWeight.w500,
        height: 20 / 14,
        color: onSurfaceVariant,
      ),
      labelMedium: labelMedium,
      labelSmall: GoogleFonts.inter(
        fontSize: 11,
        fontWeight: FontWeight.w500,
        height: 16 / 11,
        letterSpacing: 0.05 * 11,
        color: onSurfaceVariant,
      ),
    );
  }

  /// High-contrast label for text on violet–cyan gradient buttons ([docs/DESIGN.md]).
  static TextStyle primaryCtaText(BuildContext context) {
    return GoogleFonts.inter(
      fontSize: 16,
      fontWeight: FontWeight.w700,
      height: 24 / 16,
      color: ColorTokens.background,
    );
  }
}
