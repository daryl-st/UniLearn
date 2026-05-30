import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/core/api/api_exception.dart';
import 'package:mobile/core/providers/dio_provider.dart';

final aiApiProvider = Provider<AiApi>((ref) {
  return AiApi(ref.watch(dioProvider));
});

final class AskResourceResponse {
  const AskResourceResponse({
    required this.resourceId,
    required this.answer,
    required this.citations,
    required this.usedChunks,
  });

  final String resourceId;
  final String answer;
  final List<AskCitation> citations;
  final int usedChunks;

  factory AskResourceResponse.fromJson(Map<String, dynamic> json) {
    final citations = json['citations'];
    return AskResourceResponse(
      resourceId: json['resourceId'] as String,
      answer: json['answer'] as String,
      citations: citations is List
          ? citations
                .whereType<Map<String, dynamic>>()
                .map(AskCitation.fromJson)
                .toList()
          : const [],
      usedChunks: (json['usedChunks'] as num?)?.toInt() ?? 0,
    );
  }
}

final class AskCitation {
  const AskCitation({
    required this.chunkIndex,
    required this.pageNumber,
    required this.score,
  });

  final int chunkIndex;
  final int pageNumber;
  final double score;

  factory AskCitation.fromJson(Map<String, dynamic> json) {
    return AskCitation(
      chunkIndex: (json['chunkIndex'] as num).toInt(),
      pageNumber: (json['pageNumber'] as num).toInt(),
      score: (json['score'] as num).toDouble(),
    );
  }
}

class AiApi {
  AiApi(this._dio);

  final Dio _dio;

  Future<AskResourceResponse> askResource({
    required String resourceId,
    required String question,
    int topK = 5,
  }) async {
    try {
      final response = await _dio.post<Map<String, dynamic>>(
        'ai/ask',
        data: {
          'resourceId': resourceId,
          'question': question,
          'topK': topK,
        },
        options: Options(
          receiveTimeout: const Duration(seconds: 120),
          sendTimeout: const Duration(seconds: 120),
        ),
      );
      final data = response.data;
      if (data == null) {
        throw ApiException('Invalid AI response.');
      }
      return AskResourceResponse.fromJson(data);
    } on DioException catch (e) {
      throw ApiException.fromDio(e);
    }
  }
}

String askResourceErrorMessage(Object error) {
  if (error is ApiException) {
    final message = error.message.toLowerCase();
    if (error.statusCode == 400 &&
        (message.contains('not indexed') ||
            message.contains('no vectorized chunks'))) {
      return 'This material is still being processed. Try again after upload finishes.';
    }
    if (error.statusCode == 408) {
      return 'Request timed out — try a shorter question.';
    }
    if (error.statusCode == 502 || error.statusCode == 503) {
      return 'AI service is unavailable right now. Please try again later.';
    }
    return error.message;
  }
  if (error is Exception) return error.toString();
  return 'Something went wrong. Please try again.';
}
