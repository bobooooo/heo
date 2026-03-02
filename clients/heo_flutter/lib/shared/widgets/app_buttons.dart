import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../../theme/app_theme.dart';

class PrimaryButton extends StatelessWidget {
  const PrimaryButton({
    super.key,
    required this.label,
    this.onPressed,
    this.loading = false,
    this.expand = false,
  });

  final String label;
  final VoidCallback? onPressed;
  final bool loading;
  final bool expand;

  @override
  Widget build(BuildContext context) {
    final child = loading
        ? const SizedBox(
            height: 18,
            width: 18,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
            ),
          )
        : Text(label);

    if (Platform.isIOS) {
      return SizedBox(
        width: expand ? double.infinity : null,
        child: CupertinoButton(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          color: AppColors.accent,
          borderRadius: BorderRadius.circular(14),
          onPressed: loading ? null : onPressed,
          child: loading
              ? child
              : Text(
                  label,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                  ),
                ),
        ),
      );
    }

    return SizedBox(
      width: expand ? double.infinity : null,
      child: FilledButton(
        style: FilledButton.styleFrom(
          backgroundColor: AppColors.accent,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        ),
        onPressed: loading ? null : onPressed,
        child: child,
      ),
    );
  }
}

class GhostButton extends StatelessWidget {
  const GhostButton({
    super.key,
    required this.label,
    this.onPressed,
    this.expand = false,
  });

  final String label;
  final VoidCallback? onPressed;
  final bool expand;

  @override
  Widget build(BuildContext context) {
    if (Platform.isIOS) {
      return SizedBox(
        width: expand ? double.infinity : null,
        child: CupertinoButton(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          borderRadius: BorderRadius.circular(14),
          color: AppColors.surface,
          onPressed: onPressed,
          child: Text(label, style: const TextStyle(color: AppColors.accent)),
        ),
      );
    }

    return SizedBox(
      width: expand ? double.infinity : null,
      child: OutlinedButton(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.accent,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          side: const BorderSide(color: AppColors.border),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        ),
        onPressed: onPressed,
        child: Text(label),
      ),
    );
  }
}
