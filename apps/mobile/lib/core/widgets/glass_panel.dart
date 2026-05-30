import 'package:flutter/material.dart';
import 'package:mobile/theme/app_radii.dart';
import 'package:mobile/theme/uni_learn_theme_extension.dart';

/// Flat bordered panel (web shadcn card). Use from any feature.
class GlassPanel extends StatelessWidget {
  const GlassPanel({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(20),
  });

  final Widget child;
  final EdgeInsetsGeometry padding;

  @override
  Widget build(BuildContext context) {
    final extras = context.uniLearnExtras;

    return DecoratedBox(
      decoration: extras.cardDecoration(radius: AppRadii.lg),
      child: Padding(
        padding: padding,
        child: child,
      ),
    );
  }
}
