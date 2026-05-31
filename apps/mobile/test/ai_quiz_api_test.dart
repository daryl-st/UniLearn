import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/core/api/ai_api.dart';

void main() {
  test('QuizAttemptRecord parses submit response JSON', () {
    final attempt = QuizAttemptRecord.fromJson({
      'id': '11111111-1111-1111-1111-111111111111',
      'score': 75,
      'quizId': '22222222-2222-2222-2222-222222222222',
      'createdAt': '2026-05-31T12:00:00.000Z',
      'results': [
        {
          'questionId': '33333333-3333-3333-3333-333333333333',
          'content': 'What is ML?',
          'userAnswer': 'A',
          'correctAnswer': 'A',
          'isCorrect': true,
        },
        {
          'questionId': '44444444-4444-4444-4444-444444444444',
          'content': 'Define AI.',
          'userAnswer': 'wrong',
          'correctAnswer': 'artificial intelligence',
          'isCorrect': false,
        },
      ],
    });

    expect(attempt.score, 75);
    expect(attempt.results, hasLength(2));
    expect(attempt.results.first.isCorrect, isTrue);
    expect(attempt.results.last.isCorrect, isFalse);
  });

  test('QuestionForTaking detects MCQ from options', () {
    final mcq = QuestionForTaking.fromJson({
      'id': 'q1',
      'content': 'Pick one',
      'options': {'A': 'Yes', 'B': 'No'},
    });
    final short = QuestionForTaking.fromJson({
      'id': 'q2',
      'content': 'Explain',
      'options': null,
    });

    expect(mcq.isMcq, isTrue);
    expect(short.isMcq, isFalse);
  });
}
