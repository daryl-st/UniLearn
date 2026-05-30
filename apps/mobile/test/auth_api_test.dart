import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/core/api/auth_api.dart';

void main() {
  group('splitFullName', () {
    test('splits first and last name', () {
      expect(
        splitFullName('John Doe'),
        (firstName: 'John', lastName: 'Doe'),
      );
    });

    test('uses User when only one name part', () {
      expect(
        splitFullName('John'),
        (firstName: 'John', lastName: 'User'),
      );
    });

    test('joins middle names into last name', () {
      expect(
        splitFullName('John Paul Jones'),
        (firstName: 'John', lastName: 'Paul Jones'),
      );
    });
  });
}
