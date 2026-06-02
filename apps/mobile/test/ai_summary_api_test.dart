import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/core/api/ai_api.dart';

void main() {
  test('SummaryRecord parses API JSON', () {
    final record = SummaryRecord.fromJson({
      'id': '11111111-1111-1111-1111-111111111111',
      'resourceId': '22222222-2222-2222-2222-222222222222',
      'content': '## Overview\n- Key point',
      'createdAt': '2026-05-31T12:00:00.000Z',
    });

    expect(record.content, contains('Overview'));
    expect(record.resourceId, startsWith('2222'));
  });
}
