import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/app.dart';
import 'package:mobile/core/contracts/auth_contract.dart';
import 'package:mobile/core/providers/auth_session_provider.dart';
import 'package:mobile/core/providers/course_providers.dart';
import 'package:mobile/core/providers/shared_preferences_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

class _PreloadedAuth extends AuthSessionNotifier {
  @override
  AuthSessionState build() => const AuthSessionState();

  @override
  Future<void> tryRestore() async {
    state = const AuthSessionState(
      accessToken: 'mock',
      user: AuthUser(
        id: 'u1',
        email: 'student@aau.edu.et',
        name: 'Alex',
        role: 'STUDENT',
      ),
    );
  }
}

void main() {
  setUp(() {
    GoogleFonts.config.allowRuntimeFetching = false;
  });

  testWidgets('Bottom nav shows four tabs without AI label', (tester) async {
    TestWidgetsFlutterBinding.ensureInitialized();
    SharedPreferences.setMockInitialValues({
      'unilearn_onboarding_done': true,
    });
    final prefs = await SharedPreferences.getInstance();

    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          sharedPreferencesProvider.overrideWithValue(prefs),
          authSessionProvider.overrideWith(_PreloadedAuth.new),
          courseCatalogProvider.overrideWith((ref) async => []),
          meProvider.overrideWith(
            (ref) async => const MeResponse(
              user: AuthUser(
                id: 'u1',
                email: 'student@aau.edu.et',
                name: 'Alex',
                role: 'STUDENT',
              ),
              courseProgress: [],
            ),
          ),
          studentDashboardProvider.overrideWith(
            (ref) async => const StudentDashboard(
              courseSummaries: [],
              progressByCourseId: {},
            ),
          ),
        ],
        child: const UniLearnApp(),
      ),
    );

    await tester.pump(const Duration(milliseconds: 200));
    await tester.pump(const Duration(milliseconds: 1800));
    await tester.pump(const Duration(milliseconds: 1000));

    expect(find.text('Home'), findsOneWidget);
    expect(find.text('Courses'), findsOneWidget);
    expect(find.text('Stats'), findsOneWidget);
    expect(find.text('Profile'), findsOneWidget);
    expect(find.text('AI'), findsNothing);
  });
}
