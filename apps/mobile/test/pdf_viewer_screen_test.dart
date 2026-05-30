import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/features/courses/presentation/course_detail_screen.dart';
import 'package:mobile/features/courses/presentation/pdf_viewer_screen.dart';
import 'package:mobile/theme/theme.dart';

void main() {
  const material = LectureMaterial(
    id: 'test-pdf',
    title: 'Linear Algebra Notes.pdf',
    type: 'pdf',
    sizeOrDuration: '2.3 MB',
    pdfUrl:
        'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  );

  const layoutMaterial = LectureMaterial(
    id: 'test-pdf',
    title: 'Linear Algebra Notes.pdf',
  );

  testWidgets('PDF viewer shows title bar and no embedded chat panel', (
    tester,
  ) async {
    await tester.pumpWidget(
      ProviderScope(
        child: MaterialApp(
          theme: AppTheme.dark,
          home: const PdfViewerScreen(material: layoutMaterial),
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Linear Algebra Notes.pdf'), findsOneWidget);
    expect(find.text('PDF Viewer'), findsNothing);
    expect(find.text('AI STUDY ASSISTANT'), findsNothing);
    expect(find.byType(FloatingActionButton), findsOneWidget);
    expect(
      find.text('No PDF source is attached to this material yet.'),
      findsOneWidget,
    );
  });

  testWidgets('FAB opens half-height chat sheet with composer', (tester) async {
    await tester.pumpWidget(
      ProviderScope(
        child: MaterialApp(
          theme: AppTheme.dark,
          home: const PdfViewerScreen(material: material),
        ),
      ),
    );
    await tester.pump();

    await tester.tap(find.byType(FloatingActionButton));
    await tester.pumpAndSettle();

    expect(find.text('Study assistant'), findsOneWidget);
    expect(find.text('Ask about this material...'), findsOneWidget);
    expect(find.textContaining('Ask me anything about'), findsOneWidget);
  });
}
