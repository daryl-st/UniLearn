import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/main.dart';

void main() {
  testWidgets('UniLearn home smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const UniLearnApp());

    expect(find.text('UniLearn'), findsWidgets);
    expect(
      find.textContaining('Connect the API'),
      findsOneWidget,
    );
  });
}
