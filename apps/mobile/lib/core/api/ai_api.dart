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

final class SummaryRecord {
  const SummaryRecord({
    required this.id,
    required this.resourceId,
    required this.content,
    required this.createdAt,
  });

  final String id;
  final String resourceId;
  final String content;
  final String createdAt;

  factory SummaryRecord.fromJson(Map<String, dynamic> json) {
    return SummaryRecord(
      id: json['id'] as String,
      resourceId: json['resourceId'] as String,
      content: json['content'] as String,
      createdAt: json['createdAt'] as String,
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

  Future<SummaryRecord> generateSummary({required String resourceId}) async {
    try {
      final response = await _dio.post<Map<String, dynamic>>(
        'ai/summarize',
        data: {'resourceId': resourceId},
        options: Options(
          receiveTimeout: const Duration(seconds: 120),
          sendTimeout: const Duration(seconds: 120),
        ),
      );
      final data = response.data;
      final summary = data?['summary'];
      if (summary is! Map<String, dynamic>) {
        throw ApiException('Invalid summary response.');
      }
      return SummaryRecord.fromJson(summary);
    } on DioException catch (e) {
      throw ApiException.fromDio(e);
    }
  }

  Future<List<SummaryRecord>> listSummaries(String resourceId) async {
    try {
      final response = await _dio.get<Map<String, dynamic>>(
        'ai/summaries',
        queryParameters: {'resourceId': resourceId},
      );
      final data = response.data;
      final list = data?['summaries'];
      if (list is! List) {
        throw ApiException('Invalid summaries response.');
      }
      return list
          .whereType<Map<String, dynamic>>()
          .map(SummaryRecord.fromJson)
          .toList();
    } on DioException catch (e) {
      throw ApiException.fromDio(e);
    }
  }

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

String aiResourceErrorMessage(Object error) {
  if (error is ApiException) {
    final message = error.message.toLowerCase();
    if (error.statusCode == 400 &&
        (message.contains('not indexed') ||
            message.contains('no vectorized chunks') ||
            message.contains('no chunks found'))) {
      return 'This material is still being processed. Try again after upload finishes.';
    }
    if (error.statusCode == 408) {
      return 'Request timed out — try again later.';
    }
    if (error.statusCode == 502 || error.statusCode == 503) {
      return 'AI service is unavailable right now. Please try again later.';
    }
    return error.message;
  }
  if (error is Exception) return error.toString();
  return 'Something went wrong. Please try again.';
}

String askResourceErrorMessage(Object error) => aiResourceErrorMessage(error);
