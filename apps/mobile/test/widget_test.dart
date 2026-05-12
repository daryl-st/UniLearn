import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/app.dart';
import 'package:mobile/core/providers/shared_preferences_provider.dart';
import 'package:mobile/theme/color_tokens.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  testWidgets('Splash shows UniLearn branding then navigates to login', (WidgetTester tester) async {
    TestWidgetsFlutterBinding.ensureInitialized();
    SharedPreferences.setMockInitialValues({'unilearn_onboarding_done': true});
    final prefs = await SharedPreferences.getInstance();

    await tester.pumpWidget(
      ProviderScope(
        overrides: [sharedPreferencesProvider.overrideWithValue(prefs)],
        child: const UniLearnApp(),
      ),
    );

    expect(find.textContaining('UniLearn'), findsWidgets);
    expect(find.textContaining('Initializing'), findsOneWidget);

    final ctx = tester.element(find.byType(Scaffold));
    expect(Theme.of(ctx).colorScheme.primary, ColorTokens.primary);

    await tester.pump(const Duration(milliseconds: 950));
    await tester.pumpAndSettle();

    expect(find.text('Sign in'), findsOneWidget);
  });
}
