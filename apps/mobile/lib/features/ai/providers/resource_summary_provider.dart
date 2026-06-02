import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/core/api/ai_api.dart';

typedef ResourceSummaryKey = ({String resourceId, String materialTitle});

class SummaryState {
  const SummaryState({
    this.summaries = const [],
    this.isLoadingList = false,
    this.isGenerating = false,
    this.error,
  });

  final List<SummaryRecord> summaries;
  final bool isLoadingList;
  final bool isGenerating;
  final String? error;

  SummaryState copyWith({
    List<SummaryRecord>? summaries,
    bool? isLoadingList,
    bool? isGenerating,
    String? error,
    bool clearError = false,
  }) {
    return SummaryState(
      summaries: summaries ?? this.summaries,
      isLoadingList: isLoadingList ?? this.isLoadingList,
      isGenerating: isGenerating ?? this.isGenerating,
      error: clearError ? null : (error ?? this.error),
    );
  }
}

class ResourceSummaryNotifier extends StateNotifier<SummaryState> {
  ResourceSummaryNotifier({required this.ref, required this.resourceId})
    : super(const SummaryState());

  final Ref ref;
  final String resourceId;

  Future<void> loadSummaries() async {
    state = state.copyWith(isLoadingList: true, clearError: true);
    try {
      final list = await ref.read(aiApiProvider).listSummaries(resourceId);
      state = state.copyWith(summaries: list, isLoadingList: false);
    } catch (error) {
      state = state.copyWith(
        isLoadingList: false,
        error: aiResourceErrorMessage(error),
      );
    }
  }

  Future<void> generate() async {
    if (state.isGenerating) return;
    state = state.copyWith(isGenerating: true, clearError: true);
    try {
      final record = await ref
          .read(aiApiProvider)
          .generateSummary(resourceId: resourceId);
      state = state.copyWith(
        summaries: [record, ...state.summaries],
        isGenerating: false,
      );
    } catch (error) {
      state = state.copyWith(
        isGenerating: false,
        error: aiResourceErrorMessage(error),
      );
    }
  }
}

final resourceSummaryProvider = StateNotifierProvider.autoDispose
    .family<ResourceSummaryNotifier, SummaryState, ResourceSummaryKey>((
      ref,
      key,
    ) {
      final notifier = ResourceSummaryNotifier(
        ref: ref,
        resourceId: key.resourceId,
      );
      ref.onDispose(() {});
      Future.microtask(notifier.loadSummaries);
      return notifier;
    });
