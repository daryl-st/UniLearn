import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/core/api/ai_api.dart';

class ChatMessage {
  const ChatMessage({required this.text, required this.isBot});

  final String text;
  final bool isBot;
}

class ChatState {
  const ChatState({
    required this.messages,
    this.isLoading = false,
  });

  final List<ChatMessage> messages;
  final bool isLoading;
}

typedef ResourceChatKey = ({String resourceId, String materialTitle});

class ResourceChatNotifier extends StateNotifier<ChatState> {
  ResourceChatNotifier({
    required this.ref,
    required this.resourceId,
    required String materialTitle,
  }) : super(
         ChatState(
           messages: [
             ChatMessage(
               text:
                   'Ask me anything about "$materialTitle" and I will help summarize it.',
               isBot: true,
             ),
           ],
         ),
       );

  final Ref ref;
  final String resourceId;

  Future<void> send(String text) async {
    if (state.isLoading) return;

    final trimmed = text.trim();
    if (trimmed.isEmpty) return;

    final pending = [
      ...state.messages,
      ChatMessage(text: trimmed, isBot: false),
    ];
    state = ChatState(messages: pending, isLoading: true);

    try {
      final response = await ref.read(aiApiProvider).askResource(
        resourceId: resourceId,
        question: trimmed,
      );
      state = ChatState(
        messages: [
          ...pending,
          ChatMessage(text: response.answer, isBot: true),
        ],
      );
    } catch (error) {
      state = ChatState(
        messages: [
          ...pending,
          ChatMessage(text: askResourceErrorMessage(error), isBot: true),
        ],
      );
    }
  }
}

final resourceChatProvider = StateNotifierProvider.autoDispose
    .family<ResourceChatNotifier, ChatState, ResourceChatKey>((ref, key) {
      return ResourceChatNotifier(
        ref: ref,
        resourceId: key.resourceId,
        materialTitle: key.materialTitle,
      );
    });
