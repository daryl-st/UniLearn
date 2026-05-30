import 'package:flutter_riverpod/flutter_riverpod.dart';

class ChatMessage {
  const ChatMessage({required this.text, required this.isBot});

  final String text;
  final bool isBot;
}

typedef ResourceChatKey = ({String materialId, String materialTitle});

class ResourceChatNotifier extends StateNotifier<List<ChatMessage>> {
  ResourceChatNotifier({required String materialTitle})
    : super([
        ChatMessage(
          text:
              'Ask me anything about "$materialTitle" and I will help summarize it.',
          isBot: true,
        ),
      ]);

  void send(String text) {
    state = [
      ...state,
      ChatMessage(text: text, isBot: false),
      const ChatMessage(
        text:
            'I can help with a summary, key points, or a quick explanation of any section.',
        isBot: true,
      ),
    ];
  }
}

final resourceChatProvider = StateNotifierProvider.autoDispose
    .family<ResourceChatNotifier, List<ChatMessage>, ResourceChatKey>(
  (ref, key) => ResourceChatNotifier(materialTitle: key.materialTitle),
);
