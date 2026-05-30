import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/app.dart';
import 'package:mobile/core/providers/shared_preferences_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  testWidgets('Bottom nav shows four tabs without AI label', (tester) async {
    TestWidgetsFlutterBinding.ensureInitialized();
    SharedPreferences.setMockInitialValues({
      'unilearn_onboarding_done': true,
      'unilearn_access_token': 'mock',
      'unilearn_user_json':
          '{"id":"u1","email":"s@u.edu","name":"Alex","role":"STUDENT"}',
    });
    final prefs = await SharedPreferences.getInstance();

    await tester.pumpWidget(
      ProviderScope(
        overrides: [sharedPreferencesProvider.overrideWithValue(prefs)],
        child: const UniLearnApp(),
      ),
    );

    await tester.pump(const Duration(milliseconds: 950));
    await tester.pumpAndSettle();

    expect(find.text('Home'), findsOneWidget);
    expect(find.text('Courses'), findsOneWidget);
    expect(find.text('Stats'), findsOneWidget);
    expect(find.text('Profile'), findsOneWidget);
    expect(find.text('AI'), findsNothing);
  });
}
