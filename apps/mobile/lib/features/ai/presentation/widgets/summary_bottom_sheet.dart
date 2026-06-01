import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/features/ai/presentation/widgets/markdown_body.dart';
import 'package:mobile/features/ai/providers/resource_summary_provider.dart';
import 'package:mobile/theme/app_radii.dart';
import 'package:mobile/theme/color_tokens.dart';

void showResourceSummarySheet(
  BuildContext context, {
  required ResourceSummaryKey summaryKey,
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
                              'AI revision summary',
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
                  child: _SummarySheetBody(summaryKey: summaryKey),
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

class _SummarySheetBody extends ConsumerWidget {
  const _SummarySheetBody({required this.summaryKey});

  final ResourceSummaryKey summaryKey;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(resourceSummaryProvider(summaryKey));
    final notifier = ref.read(resourceSummaryProvider(summaryKey).notifier);
    final scheme = Theme.of(context).colorScheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: FilledButton.icon(
            onPressed: state.isGenerating ? null : () => notifier.generate(),
            icon: state.isGenerating
                ? SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: scheme.onPrimary,
                    ),
                  )
                : const Icon(Icons.auto_awesome, size: 18),
            label: Text(state.isGenerating ? 'Generating…' : 'Generate summary'),
          ),
        ),
        if (state.error != null)
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
            child: Text(
              state.error!,
              style: TextStyle(color: scheme.error, fontSize: 13),
            ),
          ),
        Expanded(
          child: state.isLoadingList
              ? const Center(child: CircularProgressIndicator())
              : state.summaries.isEmpty
              ? Center(
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Text(
                      'No summaries yet. Generate one from the indexed course content.',
                      textAlign: TextAlign.center,
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: scheme.onSurfaceVariant,
                      ),
                    ),
                  ),
                )
              : ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: state.summaries.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final item = state.summaries[index];
                    final whenLabel = _formatWhen(item.createdAt);
                    return Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: scheme.surfaceContainerHigh,
                        borderRadius: BorderRadius.circular(AppRadii.md),
                        border: Border.all(color: scheme.outlineVariant),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            whenLabel,
                            style: Theme.of(context).textTheme.labelSmall
                                ?.copyWith(color: scheme.onSurfaceVariant),
                          ),
                          const SizedBox(height: 8),
                          StudyMarkdownBody(
                            data: item.content,
                            shrinkWrap: true,
                          ),
                        ],
                      ),
                    );
                  },
                ),
        ),
      ],
    );
  }
}
