import 'package:flutter/material.dart';

import '../../theme/app_theme.dart';

class StatusChip extends StatelessWidget {
  const StatusChip({super.key, required this.label, required this.color});

  final String label;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        label,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

Color statusColor(String status) {
  switch (status) {
    case 'MATCHED':
      return AppColors.accent;
    case 'COMPLETED':
      return AppColors.textPrimary;
    case 'CANCELED':
      return const Color(0xFF7A6E60);
    default:
      return AppColors.highlight;
  }
}
