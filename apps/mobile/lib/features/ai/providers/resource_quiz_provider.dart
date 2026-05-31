import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/core/api/ai_api.dart';

typedef ResourceQuizKey = ({String resourceId, String materialTitle});

class QuizState {
  const QuizState({
    this.quizzes = const [],
    this.difficulty = 'MEDIUM',
    this.isLoadingList = false,
    this.isGenerating = false,
    this.error,
  });

  final List<QuizRecord> quizzes;
  final QuizDifficulty difficulty;
  final bool isLoadingList;
  final bool isGenerating;
  final String? error;

  QuizState copyWith({
    List<QuizRecord>? quizzes,
    QuizDifficulty? difficulty,
    bool? isLoadingList,
    bool? isGenerating,
    String? error,
    bool clearError = false,
  }) {
    return QuizState(
      quizzes: quizzes ?? this.quizzes,
      difficulty: difficulty ?? this.difficulty,
      isLoadingList: isLoadingList ?? this.isLoadingList,
      isGenerating: isGenerating ?? this.isGenerating,
      error: clearError ? null : (error ?? this.error),
    );
  }
}

class ResourceQuizNotifier extends StateNotifier<QuizState> {
  ResourceQuizNotifier({required this.ref, required this.resourceId})
    : super(const QuizState());

  final Ref ref;
  final String resourceId;

  void setDifficulty(QuizDifficulty difficulty) {
    state = state.copyWith(difficulty: difficulty);
  }

  Future<void> loadQuizzes() async {
    state = state.copyWith(isLoadingList: true, clearError: true);
    try {
      final list = await ref.read(aiApiProvider).listQuizzes(resourceId);
      state = state.copyWith(quizzes: list, isLoadingList: false);
    } catch (error) {
      state = state.copyWith(
        isLoadingList: false,
        error: aiResourceErrorMessage(error),
      );
    }
  }

  /// Returns generated quiz id when successful.
  Future<String?> generate() async {
    if (state.isGenerating) return null;
    state = state.copyWith(isGenerating: true, clearError: true);
    try {
      final result = await ref.read(aiApiProvider).generateQuiz(
        resourceId: resourceId,
        difficulty: state.difficulty,
      );
      state = state.copyWith(
        quizzes: [result.quiz, ...state.quizzes],
        isGenerating: false,
      );
      return result.quiz.id;
    } catch (error) {
      state = state.copyWith(
        isGenerating: false,
        error: aiResourceErrorMessage(error),
      );
      return null;
    }
  }
}

final resourceQuizProvider = StateNotifierProvider.autoDispose
    .family<ResourceQuizNotifier, QuizState, ResourceQuizKey>((ref, key) {
      final notifier = ResourceQuizNotifier(
        ref: ref,
        resourceId: key.resourceId,
      );
      Future.microtask(notifier.loadQuizzes);
      return notifier;
    });
