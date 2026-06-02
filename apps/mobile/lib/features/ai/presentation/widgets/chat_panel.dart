import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/features/ai/presentation/widgets/markdown_body.dart';
import 'package:mobile/features/ai/providers/resource_chat_provider.dart';
import 'package:mobile/theme/app_radii.dart';
import 'package:mobile/theme/app_spacing.dart';
import 'package:mobile/theme/app_typography.dart';

class ChatPanel extends ConsumerStatefulWidget {
  const ChatPanel({
    super.key,
    required this.chatKey,
    required this.title,
    this.subtitle,
  });

  final ResourceChatKey chatKey;
  final String title;
  final String? subtitle;

  @override
  ConsumerState<ChatPanel> createState() => _ChatPanelState();
}

class _ChatPanelState extends ConsumerState<ChatPanel> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _sendMessage() {
    final text = _messageController.text.trim();
    if (text.isEmpty) return;

    final chatState = ref.read(resourceChatProvider(widget.chatKey));
    if (chatState.isLoading) return;

    ref.read(resourceChatProvider(widget.chatKey).notifier).send(text);
    _messageController.clear();

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
    final chatState = ref.watch(resourceChatProvider(widget.chatKey));
    final messages = chatState.messages;
    final isLoading = chatState.isLoading;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(
            AppSpacing.stackGap,
            AppSpacing.stackGap,
            AppSpacing.stackGap,
            8,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: scheme.primary.withValues(alpha: 0.8),
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    widget.title,
                    style: Theme.of(context).textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
              if (widget.subtitle != null) ...[
                const SizedBox(height: 6),
                Text(
                  widget.subtitle!,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ],
            ],
          ),
        ),
        Divider(height: 1, color: scheme.outlineVariant),
        Expanded(
          child: chatState.isLoadingHistory
              ? const Center(child: CircularProgressIndicator())
              : ListView.separated(
                  controller: _scrollController,
                  padding: const EdgeInsets.all(AppSpacing.stackGap),
                  itemCount: messages.length,
                  separatorBuilder: (_, _) => const SizedBox(height: 10),
                  itemBuilder: (context, index) {
                    return _ChatBubble(message: messages[index], scheme: scheme);
                  },
                ),
        ),
        Divider(height: 1, color: scheme.outlineVariant),
        Padding(
          padding: const EdgeInsets.all(AppSpacing.stackGap),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _messageController,
                      textInputAction: TextInputAction.send,
                      onSubmitted: (_) => _sendMessage(),
                      decoration: InputDecoration(
                        hintText: 'Ask about this material...',
                        filled: true,
                        fillColor: scheme.surfaceContainerHigh,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(AppRadii.md),
                          borderSide: BorderSide(color: scheme.outlineVariant),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(AppRadii.md),
                          borderSide: BorderSide(color: scheme.outlineVariant),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(AppRadii.md),
                          borderSide: BorderSide(
                            color: scheme.primary.withValues(alpha: 0.35),
                          ),
                        ),
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 14,
                          vertical: 12,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton.filled(
                    onPressed: isLoading ? null : _sendMessage,
                    icon: isLoading
                        ? SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: scheme.onPrimary,
                            ),
                          )
                        : const Icon(Icons.send, size: 20),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text(
                'ENTER TO SEND',
                textAlign: TextAlign.center,
                style: AppTypography.eyebrow(scheme, opacity: 0.45),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _ChatBubble extends StatelessWidget {
  const _ChatBubble({required this.message, required this.scheme});

  final ChatMessage message;
  final ColorScheme scheme;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment:
          message.isBot ? MainAxisAlignment.start : MainAxisAlignment.end,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (message.isBot)
          CircleAvatar(
            radius: 14,
            backgroundColor: scheme.primary.withValues(alpha: 0.1),
            child: Icon(
              Icons.auto_awesome,
              size: 16,
              color: scheme.primary,
            ),
          ),
        if (message.isBot) const SizedBox(width: 8),
        Flexible(
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            decoration: BoxDecoration(
              color: message.isBot
                  ? scheme.surfaceContainerHigh
                  : scheme.primary.withValues(alpha: 0.14),
              borderRadius: BorderRadius.only(
                topLeft: const Radius.circular(18),
                topRight: const Radius.circular(18),
                bottomLeft: Radius.circular(message.isBot ? 4 : 18),
                bottomRight: Radius.circular(message.isBot ? 18 : 4),
              ),
              border: Border.all(
                color: message.isBot
                    ? scheme.outlineVariant
                    : scheme.primary.withValues(alpha: 0.14),
              ),
            ),
            child: message.isBot
                ? StudyMarkdownBody(data: message.text, shrinkWrap: true)
                : Text(
                    message.text,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      height: 1.25,
                    ),
                  ),
          ),
        ),
        if (!message.isBot) const SizedBox(width: 8),
        if (!message.isBot)
          CircleAvatar(
            radius: 14,
            backgroundColor: scheme.surfaceContainerHigh,
            child: Icon(Icons.person, size: 16, color: scheme.onSurfaceVariant),
          ),
      ],
    );
  }
}
