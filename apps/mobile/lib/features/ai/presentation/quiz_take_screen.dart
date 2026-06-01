import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/api/ai_api.dart';
import 'package:mobile/theme/color_tokens.dart';

final class QuizTakeArgs {
  const QuizTakeArgs({required this.quizId, required this.title});

  final String quizId;
  final String title;
}

class QuizTakeScreen extends ConsumerStatefulWidget {
  const QuizTakeScreen({super.key, required this.args});

  final QuizTakeArgs args;

  @override
  ConsumerState<QuizTakeScreen> createState() => _QuizTakeScreenState();
}

class _QuizTakeScreenState extends ConsumerState<QuizTakeScreen> {
  QuizRecord? _quiz;
  List<QuestionForTaking> _questions = [];
  final Map<String, String> _answers = {};
  bool _loading = true;
  bool _submitting = false;
  String? _error;
  QuizAttemptRecord? _attempt;

  @override
  void initState() {
    super.initState();
    Future.microtask(_loadQuiz);
  }

  Future<void> _loadQuiz() async {
    setState(() {
      _loading = true;
      _error = null;
      _attempt = null;
    });
    try {
      final api = ref.read(aiApiProvider);
      final result = await api.getQuiz(widget.args.quizId);
      if (!mounted) return;
      setState(() {
        _quiz = result.quiz;
        _questions = result.questions;
        _answers.clear();
        _loading = false;
      });
    } catch (error) {
      if (!mounted) return;
      setState(() {
        _loading = false;
        _error = aiResourceErrorMessage(error);
      });
    }
  }

  Future<void> _submit() async {
    setState(() {
      _submitting = true;
      _error = null;
    });
    try {
      final api = ref.read(aiApiProvider);
      final attempt = await api.submitQuiz(
        quizId: widget.args.quizId,
        answers: _questions
            .map(
              (q) => (
                questionId: q.id,
                answer: _answers[q.id] ?? '',
              ),
            )
            .toList(),
      );
      if (!mounted) return;
      setState(() {
        _attempt = attempt;
        _submitting = false;
      });
    } catch (error) {
      if (!mounted) return;
      setState(() {
        _submitting = false;
        _error = aiResourceErrorMessage(error);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Scaffold(
      backgroundColor: ColorTokens.background,
      appBar: AppBar(
        title: Text(widget.args.title, maxLines: 1, overflow: TextOverflow.ellipsis),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _quiz == null
          ? Center(child: Text(_error ?? 'Quiz not found.'))
          : _attempt != null
          ? _ResultsView(attempt: _attempt!, onDone: () => context.pop())
          : ListView(
              padding: const EdgeInsets.all(16),
              children: [
                Text(
                  _quiz!.title,
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '${_quiz!.difficulty} · ${_questions.length} questions',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
                if (_error != null) ...[
                  const SizedBox(height: 12),
                  Text(_error!, style: TextStyle(color: scheme.error)),
                ],
                const SizedBox(height: 20),
                ..._questions.asMap().entries.map((entry) {
                  final index = entry.key;
                  final q = entry.value;
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 20),
                    child: Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '${index + 1}. ${q.content}',
                              style: Theme.of(context).textTheme.titleSmall
                                  ?.copyWith(fontWeight: FontWeight.w600),
                            ),
                            const SizedBox(height: 12),
                            if (q.isMcq)
                              ...q.options!.entries.map(
                                (opt) => RadioListTile<String>(
                                  title: Text('${opt.key}. ${opt.value}'),
                                  value: opt.key,
                                  groupValue: _answers[q.id],
                                  onChanged: (value) {
                                    if (value == null) return;
                                    setState(() => _answers[q.id] = value);
                                  },
                                  contentPadding: EdgeInsets.zero,
                                  dense: true,
                                ),
                              )
                            else
                              TextField(
                                decoration: const InputDecoration(
                                  labelText: 'Your answer',
                                  border: OutlineInputBorder(),
                                  isDense: true,
                                ),
                                onChanged: (value) => _answers[q.id] = value,
                              ),
                          ],
                        ),
                      ),
                    ),
                  );
                }),
                FilledButton(
                  onPressed: _submitting || _questions.isEmpty ? null : _submit,
                  child: _submitting
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text('Submit answers'),
                ),
              ],
            ),
    );
  }
}

class _ResultsView extends StatelessWidget {
  const _ResultsView({required this.attempt, required this.onDone});

  final QuizAttemptRecord attempt;
  final VoidCallback onDone;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Card(
          color: scheme.primaryContainer,
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              children: [
                Text(
                  'Your score',
                  style: Theme.of(context).textTheme.labelLarge,
                ),
                const SizedBox(height: 8),
                Text(
                  '${attempt.score}%',
                  style: Theme.of(context).textTheme.displaySmall?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: scheme.primary,
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),
        ...attempt.results.map(
          (r) => Card(
            margin: const EdgeInsets.only(bottom: 8),
            child: ListTile(
              leading: Icon(
                r.isCorrect ? Icons.check_circle : Icons.cancel,
                color: r.isCorrect ? scheme.primary : scheme.error,
              ),
              title: Text(r.content),
              subtitle: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Your answer: ${r.userAnswer.isEmpty ? '—' : r.userAnswer}'),
                  if (!r.isCorrect)
                    Text('Correct: ${r.correctAnswer}', style: TextStyle(color: scheme.primary)),
                ],
              ),
            ),
          ),
        ),
        const SizedBox(height: 8),
        FilledButton(onPressed: onDone, child: const Text('Done')),
      ],
    );
  }
}
