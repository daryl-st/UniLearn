import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/routing/app_routes.dart';
import 'package:mobile/features/ai/presentation/quiz_take_screen.dart';
import 'package:mobile/features/ai/providers/resource_quiz_provider.dart';
import 'package:mobile/theme/app_radii.dart';
import 'package:mobile/theme/color_tokens.dart';

void showResourceQuizSheet(
  BuildContext context, {
  required ResourceQuizKey quizKey,
  required String title,
}) {
  showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    backgroundColor: ColorTokens.surfaceContainerLow,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(AppRadii.lg)),
    ),
    builder: (sheetContext) {
      final keyboardInset = MediaQuery.viewInsetsOf(sheetContext).bottom;
      final sheetHeight = MediaQuery.sizeOf(sheetContext).height * 0.55;

      return AnimatedPadding(
        padding: EdgeInsets.only(bottom: keyboardInset),
        duration: const Duration(milliseconds: 150),
        curve: Curves.easeOut,
        child: SafeArea(
          top: false,
          child: SizedBox(
            height: sheetHeight,
            child: Column(
              children: [
                const SizedBox(height: 8),
                Container(
                  width: 36,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Theme.of(sheetContext).colorScheme.outlineVariant,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              title,
                              style: Theme.of(sheetContext).textTheme.titleSmall
                                  ?.copyWith(fontWeight: FontWeight.w700),
                            ),
                            Text(
                              'Practice quiz',
                              style: Theme.of(sheetContext).textTheme.bodySmall,
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        onPressed: () => Navigator.of(sheetContext).pop(),
                        icon: const Icon(Icons.close),
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: _QuizSheetBody(quizKey: quizKey),
                ),
              ],
            ),
          ),
        ),
      );
    },
  );
}

String _formatWhen(String iso) {
  final when = DateTime.tryParse(iso);
  if (when == null) return iso;
  final local = when.toLocal();
  final h = local.hour.toString().padLeft(2, '0');
  final m = local.minute.toString().padLeft(2, '0');
  return '${local.year}-${local.month.toString().padLeft(2, '0')}-${local.day.toString().padLeft(2, '0')} $h:$m';
}

class _QuizSheetBody extends ConsumerWidget {
  const _QuizSheetBody({required this.quizKey});

  final ResourceQuizKey quizKey;

  static const _difficulties = ['EASY', 'MEDIUM', 'HARD'];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(resourceQuizProvider(quizKey));
    final notifier = ref.read(resourceQuizProvider(quizKey).notifier);
    final scheme = Theme.of(context).colorScheme;

    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
      children: [
        DropdownButtonFormField<String>(
          value: state.difficulty,
          decoration: const InputDecoration(
            labelText: 'Difficulty',
            isDense: true,
          ),
          items: _difficulties
              .map(
                (d) => DropdownMenuItem(
                  value: d,
                  child: Text(d[0] + d.substring(1).toLowerCase()),
                ),
              )
              .toList(),
          onChanged: state.isGenerating
              ? null
              : (value) {
                  if (value != null) notifier.setDifficulty(value);
                },
        ),
        const SizedBox(height: 12),
        FilledButton.icon(
          onPressed: state.isGenerating
              ? null
              : () async {
                  final quizId = await notifier.generate();
                  if (!context.mounted || quizId == null) return;
                  Navigator.of(context).pop();
                  context.push(
                    AppRoutes.quizTake,
                    extra: QuizTakeArgs(quizId: quizId, title: quizKey.materialTitle),
                  );
                },
          icon: state.isGenerating
              ? SizedBox(
                  width: 18,
                  height: 18,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: scheme.onPrimary,
                  ),
                )
              : const Icon(Icons.quiz_outlined, size: 18),
          label: Text(state.isGenerating ? 'Generating…' : 'Generate quiz'),
        ),
        if (state.error != null) ...[
          const SizedBox(height: 12),
          Text(state.error!, style: TextStyle(color: scheme.error, fontSize: 13)),
        ],
        const SizedBox(height: 16),
        Text(
          'Previous quizzes',
          style: Theme.of(context).textTheme.labelLarge?.copyWith(
            fontWeight: FontWeight.w700,
          ),
        ),
        const SizedBox(height: 8),
        if (state.isLoadingList)
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 16),
            child: Center(child: CircularProgressIndicator()),
          )
        else if (state.quizzes.isEmpty)
          Text(
            'No quizzes yet. Generate one from indexed content.',
            style: Theme.of(context).textTheme.bodySmall,
          )
        else
          ...state.quizzes.map(
            (quiz) => Card(
              margin: const EdgeInsets.only(bottom: 8),
              child: ListTile(
                title: Text(quiz.title, maxLines: 2, overflow: TextOverflow.ellipsis),
                subtitle: Text(
                  '${quiz.difficulty} · ${_formatWhen(quiz.createdAt)}'
                  '${quiz.attemptCount != null && quiz.attemptCount! > 0 ? ' · ${quiz.attemptCount} attempt(s)' : ''}',
                ),
                trailing: const Icon(Icons.chevron_right),
                onTap: () {
                  Navigator.of(context).pop();
                  context.push(
                    AppRoutes.quizTake,
                    extra: QuizTakeArgs(quizId: quiz.id, title: quiz.title),
                  );
                },
              ),
            ),
          ),
      ],
    );
  }
}
