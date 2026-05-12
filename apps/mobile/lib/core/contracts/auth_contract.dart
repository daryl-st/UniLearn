import 'dart:convert';

/// Mirrors `AuthUser` + login response from
/// [apps/frontend/src/api/auth.ts](../../../../frontend/src/api/auth.ts).
///
/// **Frozen fields** (do not rename without bumping [apiContractVersion]):
/// - `user.id`, `user.email`, `user.name`, `user.role`
/// - `accessToken` (JWT string from `POST /auth/login` and `POST /auth/register`)
final class AuthUser {
  const AuthUser({
    required this.id,
    required this.email,
    required this.name,
    required this.role,
  });

  final String id;
  final String email;
  final String name;

  /// `STUDENT` | `INSTRUCTOR` | `ADMIN` (uppercase, as returned by the API).
  final String role;

  Map<String, dynamic> toJson() => {
        'id': id,
        'email': email,
        'name': name,
        'role': role,
      };

  static AuthUser fromJson(Map<String, dynamic> json) {
    return AuthUser(
      id: json['id'] as String,
      email: json['email'] as String,
      name: json['name'] as String,
      role: json['role'] as String,
    );
  }

  static AuthUser? tryFromJsonString(String? raw) {
    if (raw == null || raw.isEmpty) return null;
    return AuthUser.fromJson(jsonDecode(raw) as Map<String, dynamic>);
  }

  String toJsonString() => jsonEncode(toJson());
}

/// Response body for `POST auth/login` and `POST auth/register` (access token only; refresh is httpOnly cookie on web).
final class LoginResponse {
  const LoginResponse({
    required this.accessToken,
    required this.user,
  });

  final String accessToken;
  final AuthUser user;

  factory LoginResponse.fromJson(Map<String, dynamic> json) {
    return LoginResponse(
      accessToken: json['accessToken'] as String,
      user: AuthUser.fromJson(json['user'] as Map<String, dynamic>),
    );
  }
}
