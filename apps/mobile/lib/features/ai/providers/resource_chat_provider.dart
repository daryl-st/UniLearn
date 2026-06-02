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
    this.isLoadingHistory = false,
    this.error,
  });

  final List<ChatMessage> messages;
  final bool isLoading;
  final bool isLoadingHistory;
  final String? error;

  ChatState copyWith({
    List<ChatMessage>? messages,
    bool? isLoading,
    bool? isLoadingHistory,
    String? error,
    bool clearError = false,
  }) {
    return ChatState(
      messages: messages ?? this.messages,
      isLoading: isLoading ?? this.isLoading,
      isLoadingHistory: isLoadingHistory ?? this.isLoadingHistory,
      error: clearError ? null : (error ?? this.error),
    );
  }
}

typedef ResourceChatKey = ({String resourceId, String materialTitle});

class ResourceChatNotifier extends StateNotifier<ChatState> {
  ResourceChatNotifier({
    required this.ref,
    required this.resourceId,
    required this.materialTitle,
  }) : super(const ChatState(messages: []));

  final Ref ref;
  final String resourceId;
  final String materialTitle;

  String get _welcomeText =>
      'Ask me anything about "$materialTitle" and I will help summarize it.';

  List<ChatMessage> _mapRecords(List<ChatMessageRecord> records) {
    return records
        .map(
          (m) => ChatMessage(
            text: m.content,
            isBot: m.role == 'assistant',
          ),
        )
        .toList();
  }

  Future<void> loadChat() async {
    state = state.copyWith(isLoadingHistory: true, clearError: true);
    try {
      final records = await ref.read(aiApiProvider).getChat(resourceId);
      final mapped = _mapRecords(records);
      state = ChatState(
        messages: mapped.isEmpty
            ? [ChatMessage(text: _welcomeText, isBot: true)]
            : mapped,
        isLoadingHistory: false,
      );
    } catch (error) {
      state = ChatState(
        messages: [ChatMessage(text: _welcomeText, isBot: true)],
        isLoadingHistory: false,
        error: askResourceErrorMessage(error),
      );
    }
  }

  Future<void> send(String text) async {
    if (state.isLoading) return;

    final trimmed = text.trim();
    if (trimmed.isEmpty) return;

    final pending = [
      ...state.messages,
      ChatMessage(text: trimmed, isBot: false),
    ];
    state = state.copyWith(messages: pending, isLoading: true, clearError: true);

    try {
      final response = await ref.read(aiApiProvider).askResource(
        resourceId: resourceId,
        question: trimmed,
      );
      if (response.messages != null && response.messages!.isNotEmpty) {
        state = ChatState(messages: _mapRecords(response.messages!));
      } else {
        state = ChatState(
          messages: [
            ...pending,
            ChatMessage(text: response.answer, isBot: true),
          ],
        );
      }
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
      final notifier = ResourceChatNotifier(
        ref: ref,
        resourceId: key.resourceId,
        materialTitle: key.materialTitle,
      );
      Future.microtask(notifier.loadChat);
      return notifier;
    });
