import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/core/validation/auth_validation.dart';

void main() {
  group('AuthValidation.emailError', () {
    test('accepts valid AAU email', () {
      expect(
        AuthValidation.emailError('student.name@aau.edu.et'),
        isNull,
      );
    });

    test('rejects non-AAU domain', () {
      expect(
        AuthValidation.emailError('student@university.edu'),
        isNotNull,
      );
    });

    test('rejects empty email', () {
      expect(AuthValidation.emailError(''), isNotNull);
    });
  });

  group('AuthValidation.passwordError', () {
    test('accepts password with 8+ characters', () {
      expect(AuthValidation.passwordError('password1'), isNull);
    });

    test('rejects password shorter than 8', () {
      expect(AuthValidation.passwordError('short'), isNotNull);
    });

    test('rejects empty password', () {
      expect(AuthValidation.passwordError(''), isNotNull);
    });
  });
}
