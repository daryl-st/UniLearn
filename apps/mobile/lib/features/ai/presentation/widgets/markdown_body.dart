import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';

/// Renders AI-generated markdown (summaries, chat answers) with app typography.
class StudyMarkdownBody extends StatelessWidget {
  const StudyMarkdownBody({
    super.key,
    required this.data,
    this.shrinkWrap = false,
  });

  final String data;
  final bool shrinkWrap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;
    final base = theme.textTheme.bodyMedium?.copyWith(
      height: 1.5,
      color: scheme.onSurface,
    );

    return MarkdownBody(
      data: data,
      shrinkWrap: shrinkWrap,
      selectable: true,
      styleSheet: MarkdownStyleSheet(
        p: base,
        h1: theme.textTheme.titleMedium?.copyWith(
          fontWeight: FontWeight.w700,
          color: scheme.onSurface,
        ),
        h2: theme.textTheme.titleSmall?.copyWith(
          fontWeight: FontWeight.w700,
          color: scheme.onSurface,
        ),
        h3: theme.textTheme.labelLarge?.copyWith(
          fontWeight: FontWeight.w600,
          color: scheme.onSurface,
        ),
        strong: base?.copyWith(fontWeight: FontWeight.w700),
        em: base?.copyWith(fontStyle: FontStyle.italic),
        listBullet: base,
        code: base?.copyWith(
          fontFamily: 'monospace',
          backgroundColor: scheme.surfaceContainerHigh,
        ),
        blockSpacing: 8,
        listIndent: 20,
        a: base?.copyWith(
          color: scheme.primary,
          decoration: TextDecoration.underline,
        ),
      ),
    );
  }
}
