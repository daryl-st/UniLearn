import 'package:flutter/material.dart';
import 'package:mobile/theme/app_radii.dart';
import 'package:mobile/theme/app_typography.dart';
import 'package:mobile/theme/uni_learn_theme_extension.dart';

/// Shared gradient CTA. Use from any feature.
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
    final extras = context.uniLearnExtras;
    final enabled = onPressed != null;
    final labelStyle = AppTypography.primaryCtaText(context);

    return DecoratedBox(
      decoration: BoxDecoration(
        gradient: extras.primaryGradient,
        borderRadius: BorderRadius.circular(AppRadii.md),
        boxShadow: enabled ? extras.primaryButtonGlow : null,
      ),
      child: Material(
        type: MaterialType.transparency,
        child: InkWell(
          onTap: onPressed,
          borderRadius: BorderRadius.circular(AppRadii.md),
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 20),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(label, style: labelStyle),
                if (icon != null) ...[
                  const SizedBox(width: 8),
                  Icon(icon, color: labelStyle.color, size: 20),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}
