import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/features/ai/presentation/widgets/chat_bottom_sheet.dart';
import 'package:mobile/features/ai/presentation/widgets/quiz_bottom_sheet.dart';
import 'package:mobile/features/ai/presentation/widgets/summary_bottom_sheet.dart';
import 'package:mobile/features/ai/providers/resource_quiz_provider.dart';
import 'package:mobile/features/courses/presentation/course_detail_screen.dart';
import 'package:mobile/theme/color_tokens.dart';
import 'package:share_plus/share_plus.dart';
import 'package:syncfusion_flutter_pdfviewer/pdfviewer.dart';
import 'package:url_launcher/url_launcher.dart';

class PdfViewerScreen extends ConsumerWidget {
  const PdfViewerScreen({super.key, required this.material});

  final LectureMaterial? material;

  Future<void> _download(BuildContext context) async {
    final url = material?.pdfUrl ?? '';
    if (url.isEmpty) {
      _showSnack(context, 'No download link for this resource.');
      return;
    }
    final uri = Uri.tryParse(url);
    if (uri == null || !await launchUrl(uri, mode: LaunchMode.externalApplication)) {
      if (context.mounted) {
        _showSnack(context, 'Could not open download link.');
      }
    }
  }

  Future<void> _share(BuildContext context) async {
    final url = material?.pdfUrl ?? '';
    final title = material?.title ?? 'Resource';
    if (url.isEmpty) {
      _showSnack(context, 'Nothing to share for this resource.');
      return;
    }
    await Share.share('$title\n$url', subject: title);
  }

  void _showSnack(BuildContext context, String message) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
  }

  void _openChatSheet(BuildContext context) {
    final materialData = material;
    final materialId = materialData?.id ?? 'unknown';
    final materialTitle = materialData?.title ?? 'Resource';

    showResourceChatSheet(
      context,
      chatKey: (resourceId: materialId, materialTitle: materialTitle),
      title: 'Study assistant',
      subtitle: materialTitle,
    );
  }

  void _openQuizSheet(BuildContext context) {
    final materialData = material;
    final materialId = materialData?.id ?? 'unknown';
    final materialTitle = materialData?.title ?? 'Resource';

    showResourceQuizSheet(
      context,
      quizKey: (resourceId: materialId, materialTitle: materialTitle),
      title: materialTitle,
    );
  }

  void _openSummarySheet(BuildContext context) {
    final materialData = material;
    final materialId = materialData?.id ?? 'unknown';
    final materialTitle = materialData?.title ?? 'Resource';

    showResourceSummarySheet(
      context,
      summaryKey: (resourceId: materialId, materialTitle: materialTitle),
      title: materialTitle,
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final scheme = Theme.of(context).colorScheme;
    final materialData = material;
    final title = materialData?.title ?? 'Resource';

    return Scaffold(
      backgroundColor: ColorTokens.background,
      floatingActionButton: materialData?.id.isNotEmpty == true
          ? Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  FloatingActionButton.small(
                    heroTag: 'summary',
                    onPressed: () => _openSummarySheet(context),
                    child: const Icon(Icons.summarize_outlined),
                  ),
                  const SizedBox(height: 10),
                  FloatingActionButton.small(
                    heroTag: 'quiz',
                    onPressed: () => _openQuizSheet(context),
                    child: const Icon(Icons.quiz_outlined),
                  ),
                  const SizedBox(height: 10),
                  FloatingActionButton(
                    heroTag: 'chat',
                    onPressed: () => _openChatSheet(context),
                    child: const Icon(Icons.auto_awesome),
                  ),
                ],
              ),
            )
          : null,
      floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            SizedBox(
              height: 52,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4),
                child: Row(
                  children: [
                    IconButton(
                      icon: Icon(Icons.arrow_back, color: scheme.onSurface),
                      onPressed: () => context.pop(),
                    ),
                    Expanded(
                      child: Text(
                        title,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: Theme.of(context).textTheme.titleSmall?.copyWith(
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    IconButton(
                      onPressed: () => _download(context),
                      icon: Icon(Icons.download_outlined, color: scheme.onSurface),
                      tooltip: 'Download',
                    ),
                    IconButton(
                      onPressed: () => _share(context),
                      icon: Icon(Icons.share_outlined, color: scheme.onSurface),
                      tooltip: 'Share',
                    ),
                  ],
                ),
              ),
            ),
            Divider(height: 1, color: scheme.outlineVariant),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(8, 4, 8, 4),
                child: materialData == null || materialData.pdfUrl.isEmpty
                    ? Center(
                        child: Padding(
                          padding: const EdgeInsets.all(24),
                          child: Text(
                            'No PDF source is attached to this material yet.',
                            textAlign: TextAlign.center,
                            style: Theme.of(context).textTheme.bodyMedium
                                ?.copyWith(color: scheme.onSurfaceVariant),
                          ),
                        ),
                      )
                    : SfPdfViewer.network(
                        materialData.pdfUrl,
                        canShowScrollHead: true,
                        canShowPaginationDialog: true,
                        pageLayoutMode: PdfPageLayoutMode.single,
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
