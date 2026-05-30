/// Mutable holder for the current JWT so Dio interceptors can attach Bearer auth.
class AuthTokenStore {
  String? accessToken;

  void setToken(String? token) {
    accessToken = token;
  }

  void clear() {
    accessToken = null;
  }
}
