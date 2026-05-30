/// Client-side rules for login and registration (AAU student accounts).
abstract final class AuthValidation {
  static final RegExp _aauEmail = RegExp(
    r'^[a-zA-Z0-9._%+-]+@aau\.edu\.et$',
  );

  static const minPasswordLength = 8;

  static String? emailError(String email) {
    final trimmed = email.trim();
    if (trimmed.isEmpty) {
      return 'University email is required.';
    }
    if (!_aauEmail.hasMatch(trimmed)) {
      return 'Use your AAU email (username@aau.edu.et).';
    }
    return null;
  }

  static String? passwordError(String password) {
    if (password.isEmpty) {
      return 'Password is required.';
    }
    if (password.length < minPasswordLength) {
      return 'Password must be at least $minPasswordLength characters.';
    }
    return null;
  }
}
