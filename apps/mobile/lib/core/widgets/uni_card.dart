import 'package:flutter/material.dart';
import 'package:mobile/theme/app_radii.dart';
import 'package:mobile/theme/color_tokens.dart';
import 'package:mobile/theme/uni_learn_theme_extension.dart';

/// Flat shadcn-style card (`bg-card` + border).
class UniCard extends StatelessWidget {
  const UniCard({
    super.key,
    required this.child,
    this.padding,
    this.color,
    this.radius = AppRadii.lg,
  });

  final Widget child;
  final EdgeInsetsGeometry? padding;
  final Color? color;
  final double radius;

  @override
  Widget build(BuildContext context) {
    final extras = context.uniLearnExtras;

    return DecoratedBox(
      decoration: extras.cardDecoration(color: color, radius: radius),
      child: Padding(
        padding: padding ?? const EdgeInsets.all(16),
        child: child,
      ),
    );
  }
}

/// Solid background scaffold (replaces gradient page backgrounds).
class UniScaffold extends StatelessWidget {
  const UniScaffold({
    super.key,
    required this.body,
    this.padding,
    this.scrollable = false,
  });

  final Widget body;
  final EdgeInsetsGeometry? padding;
  final bool scrollable;

  @override
  Widget build(BuildContext context) {
    final content = Padding(
      padding: padding ?? EdgeInsets.zero,
      child: body,
    );

    return ColoredBox(
      color: ColorTokens.background,
      child: scrollable
          ? SingleChildScrollView(child: content)
          : content,
    );
  }
}
