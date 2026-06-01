import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/core/api/api_exception.dart';
import 'package:mobile/core/providers/dio_provider.dart';

final aiApiProvider = Provider<AiApi>((ref) {
  return AiApi(ref.watch(dioProvider));
});

final class ChatMessageRecord {
  const ChatMessageRecord({
    required this.id,
    required this.role,
    required this.content,
    required this.createdAt,
    this.citations,
  });

  final String id;
  final String role;
  final String content;
  final String createdAt;
  final List<AskCitation>? citations;

  factory ChatMessageRecord.fromJson(Map<String, dynamic> json) {
    final citations = json['citations'];
    return ChatMessageRecord(
      id: json['id'] as String,
      role: json['role'] as String,
      content: json['content'] as String,
      createdAt: json['createdAt'] as String,
      citations: citations is List
          ? citations
                .whereType<Map<String, dynamic>>()
                .map(AskCitation.fromJson)
                .toList()
          : null,
    );
  }
}

final class AskResourceResponse {
  const AskResourceResponse({
    required this.resourceId,
    required this.answer,
    required this.citations,
    required this.usedChunks,
    this.messages,
  });

  final String resourceId;
  final String answer;
  final List<AskCitation> citations;
  final int usedChunks;
  final List<ChatMessageRecord>? messages;

  factory AskResourceResponse.fromJson(Map<String, dynamic> json) {
    final citations = json['citations'];
    final messages = json['messages'];
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
      messages: messages is List
          ? messages
                .whereType<Map<String, dynamic>>()
                .map(ChatMessageRecord.fromJson)
                .toList()
          : null,
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

typedef QuizDifficulty = String;

final class QuizRecord {
  const QuizRecord({
    required this.id,
    required this.title,
    required this.difficulty,
    required this.resourceId,
    required this.createdAt,
    this.attemptCount,
  });

  final String id;
  final String title;
  final QuizDifficulty difficulty;
  final String resourceId;
  final String createdAt;
  final int? attemptCount;

  factory QuizRecord.fromJson(Map<String, dynamic> json) {
    return QuizRecord(
      id: json['id'] as String,
      title: json['title'] as String,
      difficulty: json['difficulty'] as String,
      resourceId: json['resourceId'] as String,
      createdAt: json['createdAt'] as String,
      attemptCount: (json['attemptCount'] as num?)?.toInt(),
    );
  }
}

final class QuestionForTaking {
  const QuestionForTaking({
    required this.id,
    required this.content,
    this.options,
  });

  final String id;
  final String content;
  final Map<String, String>? options;

  factory QuestionForTaking.fromJson(Map<String, dynamic> json) {
    final rawOptions = json['options'];
    Map<String, String>? options;
    if (rawOptions is Map) {
      options = rawOptions.map(
        (key, value) => MapEntry(key.toString(), value.toString()),
      );
    }
    return QuestionForTaking(
      id: json['id'] as String,
      content: json['content'] as String,
      options: options,
    );
  }

  bool get isMcq => options != null && options!.isNotEmpty;
}

final class QuizQuestionResult {
  const QuizQuestionResult({
    required this.questionId,
    required this.content,
    required this.userAnswer,
    required this.correctAnswer,
    required this.isCorrect,
  });

  final String questionId;
  final String content;
  final String userAnswer;
  final String correctAnswer;
  final bool isCorrect;

  factory QuizQuestionResult.fromJson(Map<String, dynamic> json) {
    return QuizQuestionResult(
      questionId: json['questionId'] as String,
      content: json['content'] as String,
      userAnswer: json['userAnswer'] as String? ?? '',
      correctAnswer: json['correctAnswer'] as String,
      isCorrect: json['isCorrect'] as bool? ?? false,
    );
  }
}

final class QuizAttemptRecord {
  const QuizAttemptRecord({
    required this.id,
    required this.score,
    required this.quizId,
    required this.createdAt,
    required this.results,
  });

  final String id;
  final int score;
  final String quizId;
  final String createdAt;
  final List<QuizQuestionResult> results;

  factory QuizAttemptRecord.fromJson(Map<String, dynamic> json) {
    final rawResults = json['results'];
    return QuizAttemptRecord(
      id: json['id'] as String,
      score: (json['score'] as num).toInt(),
      quizId: json['quizId'] as String,
      createdAt: json['createdAt'] as String,
      results: rawResults is List
          ? rawResults
                .whereType<Map<String, dynamic>>()
                .map(QuizQuestionResult.fromJson)
                .toList()
          : const [],
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

  Future<({QuizRecord quiz, List<QuestionForTaking> questions})> generateQuiz({
    required String resourceId,
    required QuizDifficulty difficulty,
  }) async {
    try {
      final response = await _dio.post<Map<String, dynamic>>(
        'ai/generate-quiz',
        data: {'resourceId': resourceId, 'difficulty': difficulty},
        options: Options(
          receiveTimeout: const Duration(seconds: 120),
          sendTimeout: const Duration(seconds: 120),
        ),
      );
      final data = response.data;
      final quiz = data?['quiz'];
      final questions = data?['questions'];
      if (quiz is! Map<String, dynamic> || questions is! List) {
        throw ApiException('Invalid quiz response.');
      }
      return (
        quiz: QuizRecord.fromJson(quiz),
        questions: questions
            .whereType<Map<String, dynamic>>()
            .map(QuestionForTaking.fromJson)
            .toList(),
      );
    } on DioException catch (e) {
      throw ApiException.fromDio(e);
    }
  }

  Future<List<QuizRecord>> listQuizzes(String resourceId) async {
    try {
      final response = await _dio.get<Map<String, dynamic>>(
        'ai/quizzes',
        queryParameters: {'resourceId': resourceId},
      );
      final data = response.data;
      final list = data?['quizzes'];
      if (list is! List) {
        throw ApiException('Invalid quizzes response.');
      }
      return list
          .whereType<Map<String, dynamic>>()
          .map(QuizRecord.fromJson)
          .toList();
    } on DioException catch (e) {
      throw ApiException.fromDio(e);
    }
  }

  Future<({QuizRecord quiz, List<QuestionForTaking> questions})> getQuiz(
    String quizId,
  ) async {
    try {
      final response = await _dio.get<Map<String, dynamic>>(
        'ai/quizzes/$quizId',
      );
      final data = response.data;
      final quiz = data?['quiz'];
      final questions = data?['questions'];
      if (quiz is! Map<String, dynamic> || questions is! List) {
        throw ApiException('Invalid quiz response.');
      }
      return (
        quiz: QuizRecord.fromJson(quiz),
        questions: questions
            .whereType<Map<String, dynamic>>()
            .map(QuestionForTaking.fromJson)
            .toList(),
      );
    } on DioException catch (e) {
      throw ApiException.fromDio(e);
    }
  }

  Future<QuizAttemptRecord> submitQuiz({
    required String quizId,
    required List<({String questionId, String answer})> answers,
  }) async {
    try {
      final response = await _dio.post<Map<String, dynamic>>(
        'ai/quizzes/$quizId/submit',
        data: {
          'answers': answers
              .map(
                (a) => {'questionId': a.questionId, 'answer': a.answer},
              )
              .toList(),
        },
      );
      final data = response.data;
      final attempt = data?['attempt'];
      if (attempt is! Map<String, dynamic>) {
        throw ApiException('Invalid submit response.');
      }
      return QuizAttemptRecord.fromJson(attempt);
    } on DioException catch (e) {
      throw ApiException.fromDio(e);
    }
  }

  Future<List<ChatMessageRecord>> getChat(String resourceId) async {
    try {
      final response = await _dio.get<Map<String, dynamic>>(
        'ai/chat',
        queryParameters: {'resourceId': resourceId},
      );
      final data = response.data;
      final messages = data?['messages'];
      if (messages is! List) {
        return const [];
      }
      return messages
          .whereType<Map<String, dynamic>>()
          .map(ChatMessageRecord.fromJson)
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
