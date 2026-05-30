import 'package:flutter/material.dart';
import 'package:mobile/features/ai/presentation/widgets/chat_panel.dart';
import 'package:mobile/features/ai/providers/resource_chat_provider.dart';
import 'package:mobile/theme/app_radii.dart';
import 'package:mobile/theme/color_tokens.dart';

/// Half-height study chat sheet that shifts above the on-screen keyboard.
void showResourceChatSheet(
  BuildContext context, {
  required ResourceChatKey chatKey,
  required String title,
  String? subtitle,
}) {
  showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    backgroundColor: ColorTokens.surfaceContainerLow,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(AppRadii.lg)),
    ),
    builder: (sheetContext) {
      final keyboardInset = MediaQuery.viewInsetsOf(sheetContext).bottom;
      final sheetHeight = MediaQuery.sizeOf(sheetContext).height * 0.5;

      return AnimatedPadding(
        padding: EdgeInsets.only(bottom: keyboardInset),
        duration: const Duration(milliseconds: 150),
        curve: Curves.easeOut,
        child: SafeArea(
          top: false,
          child: SizedBox(
            height: sheetHeight,
            child: Column(
              children: [
                const SizedBox(height: 8),
                Container(
                  width: 36,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Theme.of(sheetContext).colorScheme.outlineVariant,
                    borderRadius: BorderRadius.circular(AppRadii.full),
                  ),
                ),
                Expanded(
                  child: ChatPanel(
                    chatKey: chatKey,
                    title: title,
                    subtitle: subtitle,
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    },
  );
}
