import 'package:flutter/material.dart';
import 'package:mobile/theme/app_radii.dart';
import 'package:mobile/theme/app_typography.dart';
import 'package:mobile/theme/color_tokens.dart';

/// Shared primary CTA (solid lavender, shadcn-style).
class GradientCtaButton extends StatelessWidget {
  const GradientCtaButton({
    super.key,
    required this.label,
    this.onPressed,
    this.icon,
  });

  final String label;
  final VoidCallback? onPressed;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    final enabled = onPressed != null;
    final labelStyle = AppTypography.primaryCtaText(context);

    return Material(
      color: enabled ? ColorTokens.primary : ColorTokens.primary.withValues(alpha: 0.5),
      borderRadius: BorderRadius.circular(AppRadii.sm),
      child: InkWell(
        onTap: onPressed,
        borderRadius: BorderRadius.circular(AppRadii.sm),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(label, style: labelStyle),
              if (icon != null) ...[
                const SizedBox(width: 8),
                Icon(icon, color: labelStyle.color, size: 18),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
