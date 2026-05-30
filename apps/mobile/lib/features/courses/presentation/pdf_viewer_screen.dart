import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/widgets/uni_card.dart';
import 'package:mobile/features/courses/presentation/course_detail_screen.dart';
import 'package:mobile/theme/app_radii.dart';
import 'package:mobile/theme/app_spacing.dart';
import 'package:mobile/theme/app_typography.dart';
import 'package:mobile/theme/color_tokens.dart';
import 'package:mobile/theme/uni_learn_theme_extension.dart';
import 'package:syncfusion_flutter_pdfviewer/pdfviewer.dart';

final pdfChatMessagesProvider =
    StateNotifierProvider.autoDispose<
      PdfChatMessagesNotifier,
      List<_ChatMessage>
    >((ref) => PdfChatMessagesNotifier());

class PdfViewerScreen extends ConsumerStatefulWidget {
  final LectureMaterial? material;

  const PdfViewerScreen({super.key, required this.material});

  @override
  ConsumerState<PdfViewerScreen> createState() => _PdfViewerScreenState();
}

class _PdfViewerScreenState extends ConsumerState<PdfViewerScreen> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  @override
  void dispose() {
    _messageController.dispose();
    super.dispose();
  }

  void _sendMessage() {
    final text = _messageController.text.trim();
    if (text.isEmpty) {
      return;
    }

    ref.read(pdfChatMessagesProvider.notifier).send(text);

    _messageController.clear();

    // Scroll to bottom so the latest message is visible
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent + 120,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final materialData = widget.material;
    final messages = ref.watch(pdfChatMessagesProvider);

    return Scaffold(
      backgroundColor: ColorTokens.background,
      appBar: AppBar(
        backgroundColor: ColorTokens.surfaceContainerLow,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: scheme.onSurface),
          onPressed: () => context.pop(),
        ),
        title: Text(
          'PDF Viewer',
          style: Theme.of(context).textTheme.titleSmall,
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.containerPadding),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              UniCard(
                child: Row(
                  children: [
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: scheme.surfaceContainerHigh,
                        borderRadius: BorderRadius.circular(AppRadii.sm),
                        border: Border.all(color: scheme.outlineVariant),
                      ),
                      child: Icon(
                        Icons.picture_as_pdf_rounded,
                        color: scheme.primary,
                        size: 22,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            materialData?.title ?? 'Lecture PDF',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: Theme.of(context).textTheme.titleSmall
                                ?.copyWith(fontWeight: FontWeight.w600),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Review the lecture material below.',
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      onPressed: () {},
                      icon: Icon(Icons.download_outlined, color: scheme.onSurface),
                    ),
                    IconButton(
                      onPressed: () {},
                      icon: Icon(Icons.share_outlined, color: scheme.onSurface),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              Expanded(
                flex: 6,
                child: Container(
                  decoration: BoxDecoration(
                    color: scheme.surfaceContainerLow,
                    borderRadius: BorderRadius.circular(AppRadii.lg),
                    border: Border.all(color: scheme.outlineVariant),
                  ),
                  clipBehavior: Clip.antiAlias,
                    child: materialData == null || materialData.pdfUrl.isEmpty
                        ? Center(
                            child: Padding(
                              padding: const EdgeInsets.all(24),
                              child: Text(
                                'No PDF source is attached to this material yet.',
                                textAlign: TextAlign.center,
                                style: Theme.of(context).textTheme.bodyMedium
                                    ?.copyWith(color: scheme.onSurfaceVariant),
                              ),
                            ),
                          )
                        : SfPdfViewer.network(
                            materialData.pdfUrl,
                            canShowScrollHead: true,
                            canShowPaginationDialog: true,
                            pageLayoutMode: PdfPageLayoutMode.single,
                          ),
                  ),
                ),
                const SizedBox(height: 16),
                Expanded(
                  flex: 4,
                  child: DecoratedBox(
                    decoration: context.uniLearnExtras.cardDecoration(
                      color: context.uniLearnExtras.aiAccentTint,
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(AppSpacing.stackGap),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'AI STUDY ASSISTANT',
                            style: AppTypography.eyebrow(scheme),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Ask for summaries, definitions, or quick notes.',
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                          const SizedBox(height: 10),
                        Row(
                          children: [
                            Expanded(
                              child: TextField(
                                controller: _messageController,
                                textInputAction: TextInputAction.send,
                                onSubmitted: (_) => _sendMessage(),
                                decoration: InputDecoration(
                                  hintText: 'Type your message...',
                                  filled: true,
                                  fillColor: scheme.surface.withValues(
                                    alpha: 0.92,
                                  ),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(18),
                                    borderSide: BorderSide(
                                      color: scheme.outline.withValues(
                                        alpha: 0.12,
                                      ),
                                    ),
                                  ),
                                  enabledBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(18),
                                    borderSide: BorderSide(
                                      color: scheme.outline.withValues(
                                        alpha: 0.10,
                                      ),
                                    ),
                                  ),
                                  focusedBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(18),
                                    borderSide: BorderSide(
                                      color: scheme.primary.withValues(
                                        alpha: 0.35,
                                      ),
                                    ),
                                  ),
                                  contentPadding: const EdgeInsets.symmetric(
                                    horizontal: 14,
                                    vertical: 14,
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            IconButton(
                              icon: Icon(Icons.send, color: scheme.primary),
                              onPressed: _sendMessage,
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Expanded(
                          child: ListView.separated(
                            controller: _scrollController,
                            itemCount: messages.length,
                            separatorBuilder: (_, _) =>
                                const SizedBox(height: 10),
                            itemBuilder: (context, index) {
                              final message = messages[index];
                              return Row(
                                mainAxisAlignment: message.isBot
                                    ? MainAxisAlignment.start
                                    : MainAxisAlignment.end,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  if (message.isBot)
                                    CircleAvatar(
                                      radius: 14,
                                      backgroundColor: scheme.surface
                                          .withValues(alpha: 0.96),
                                      child: Icon(
                                        Icons.smart_toy_outlined,
                                        size: 16,
                                        color: scheme.primary,
                                      ),
                                    ),
                                  if (message.isBot) const SizedBox(width: 8),
                                  Container(
                                    constraints: const BoxConstraints(
                                      maxWidth: 280,
                                    ),
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 14,
                                      vertical: 12,
                                    ),
                                    decoration: BoxDecoration(
                                      color: message.isBot
                                          ? scheme.surface.withValues(
                                              alpha: 0.96,
                                            )
                                          : scheme.primary.withValues(
                                              alpha: 0.14,
                                            ),
                                      borderRadius: BorderRadius.only(
                                        topLeft: const Radius.circular(18),
                                        topRight: const Radius.circular(18),
                                        bottomLeft: Radius.circular(
                                          message.isBot ? 4 : 18,
                                        ),
                                        bottomRight: Radius.circular(
                                          message.isBot ? 18 : 4,
                                        ),
                                      ),
                                      border: Border.all(
                                        color: message.isBot
                                            ? scheme.outline.withValues(
                                                alpha: 0.08,
                                              )
                                            : scheme.primary.withValues(
                                                alpha: 0.14,
                                              ),
                                      ),
                                    ),
                                    child: Text(
                                      message.text,
                                      style: Theme.of(context)
                                          .textTheme
                                          .bodyMedium
                                          ?.copyWith(
                                            color: scheme.onSurface,
                                            height: 1.25,
                                          ),
                                    ),
                                  ),
                                  if (!message.isBot) const SizedBox(width: 8),
                                  if (!message.isBot)
                                    CircleAvatar(
                                      radius: 14,
                                      backgroundColor: scheme.primary
                                          .withValues(alpha: 0.14),
                                      child: Icon(
                                        Icons.person,
                                        size: 16,
                                        color: scheme.primary,
                                      ),
                                    ),
                                ],
                              );
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ChatMessage {
  final String text;
  final bool isBot;

  const _ChatMessage({required this.text, required this.isBot});
}

class PdfChatMessagesNotifier extends StateNotifier<List<_ChatMessage>> {
  PdfChatMessagesNotifier()
    : super([
        const _ChatMessage(
          text: 'Ask me anything about this PDF and I will help summarize it.',
          isBot: true,
        ),
      ]);

  void send(String text) {
    state = [
      ...state,
      _ChatMessage(text: text, isBot: false),
      const _ChatMessage(
        text:
            'I can help with a summary, key points, or a quick explanation of any section.',
        isBot: true,
      ),
    ];
  }
}
