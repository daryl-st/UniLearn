/// Backend base URL for the Node API.
///
/// Physical devices cannot use `localhost` — pass your machine's LAN IP:
/// `flutter run --dart-define=API_BASE_URL=http://192.168.1.42:4000`
abstract final class ApiConfig {
  static const String _rawBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://127.0.0.1:4000',
  );

  static String get apiBaseUrl {
    final trimmed = _rawBaseUrl.trim();
    if (trimmed.isEmpty) {
      return 'http://127.0.0.1:4000';
    }
    return trimmed.endsWith('/') ? trimmed : '$trimmed/';
  }
}
