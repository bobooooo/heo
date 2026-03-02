import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  static const background = Color(0xFFF6EFE6);
  static const surface = Color(0xFFFFFBF7);
  static const surfaceWarm = Color(0xFFF9F1E6);
  static const border = Color(0xFFE7D6C4);
  static const textPrimary = Color(0xFF2B2620);
  static const textSecondary = Color(0xFF5B5146);
  static const accent = Color(0xFFB45632);
  static const accentDark = Color(0xFF8E4428);
  static const highlight = Color(0xFF2F6F68);
}

class AppTheme {
  static ThemeData light() {
    final base = ThemeData.light(useMaterial3: true);
    return base.copyWith(
      scaffoldBackgroundColor: AppColors.background,
      colorScheme: base.colorScheme.copyWith(
        primary: AppColors.accent,
        secondary: AppColors.highlight,
        surface: AppColors.surface,
        background: AppColors.background,
      ),
      textTheme: GoogleFonts.notoSansScTextTheme(base.textTheme).copyWith(
        headlineLarge: GoogleFonts.zcoolXiaoWei(
          fontSize: 30,
          fontWeight: FontWeight.w700,
          color: AppColors.textPrimary,
        ),
        headlineMedium: GoogleFonts.zcoolXiaoWei(
          fontSize: 24,
          fontWeight: FontWeight.w600,
          color: AppColors.textPrimary,
        ),
        titleLarge: GoogleFonts.notoSansSc(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: AppColors.textPrimary,
        ),
        bodyLarge: GoogleFonts.notoSansSc(
          fontSize: 16,
          color: AppColors.textSecondary,
        ),
        bodyMedium: GoogleFonts.notoSansSc(
          fontSize: 14,
          color: AppColors.textSecondary,
        ),
        labelLarge: GoogleFonts.notoSansSc(
          fontSize: 14,
          fontWeight: FontWeight.w600,
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.background,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
        centerTitle: false,
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.surface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: AppColors.border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: AppColors.border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: AppColors.accent),
        ),
      ),
      cardTheme: CardThemeData(
        color: AppColors.surface,
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      ),
    );
  }

  static CupertinoThemeData cupertino() {
    return CupertinoThemeData(
      brightness: Brightness.light,
      primaryColor: AppColors.accent,
      scaffoldBackgroundColor: AppColors.background,
      barBackgroundColor: AppColors.background.withOpacity(0.98),
      textTheme: CupertinoTextThemeData(
        navLargeTitleTextStyle: GoogleFonts.zcoolXiaoWei(
          fontSize: 30,
          fontWeight: FontWeight.w700,
          color: AppColors.textPrimary,
        ),
        navTitleTextStyle: GoogleFonts.notoSansSc(
          fontSize: 17,
          fontWeight: FontWeight.w600,
          color: AppColors.textPrimary,
        ),
        textStyle: GoogleFonts.notoSansSc(
          fontSize: 15,
          color: AppColors.textSecondary,
        ),
      ),
    );
  }
}
