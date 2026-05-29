import 'package:flutter/material.dart';
import 'package:mobile/theme/app_spacing.dart';

class AppHeader extends StatelessWidget {
  const AppHeader({super.key});

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    final gradient = LinearGradient(
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
      colors: [scheme.primary, scheme.secondary],
    );

    Widget gradientText(String text, TextStyle? style) {
      return ShaderMask(
        shaderCallback: (bounds) =>
            gradient.createShader(Rect.fromLTWH(0, 0, bounds.width, bounds.height)),
        blendMode: BlendMode.srcIn,
        child: Text(text, style: style?.copyWith(color: Colors.white)),
      );
    }

    return SafeArea(
      bottom: false,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(
          AppSpacing.containerPadding,
          12,
          AppSpacing.containerPadding,
          12,
        ),
        child: Row(
          children: [
            const CircleAvatar(
              radius: 20,
              child: Icon(Icons.school, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: gradientText(
                'UniLearn',
                Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w900,
                    ),
              ),
            ),
            IconButton(
              onPressed: () {},
              icon: const Icon(Icons.notifications_none_rounded),
            ),
          ],
        ),
      ),
    );
  }
}
