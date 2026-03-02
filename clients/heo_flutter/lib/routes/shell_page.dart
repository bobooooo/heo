import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../features/auth/state/auth_notifier.dart';
import '../features/auth/state/auth_state.dart';
import '../theme/app_theme.dart';

class ShellPage extends ConsumerStatefulWidget {
  const ShellPage({super.key, required this.child});

  final Widget child;

  @override
  ConsumerState<ShellPage> createState() => _ShellPageState();
}

class _ShellPageState extends ConsumerState<ShellPage> {
  bool _prompted = false;
  static const _iosTabBackground = Color(0xFFF2E7DB);

  int _indexForLocation(String location) {
    if (location.startsWith('/notifications')) return 1;
    if (location.startsWith('/me')) return 2;
    return 0;
  }

  void _onTap(BuildContext context, int index) {
    switch (index) {
      case 1:
        context.go('/notifications');
        break;
      case 2:
        context.go('/me');
        break;
      default:
        context.go('/');
    }
  }

  @override
  Widget build(BuildContext context) {
    final location = GoRouterState.of(context).uri.toString();
    final currentIndex = _indexForLocation(location);
    final authState = ref.watch(authProvider);

    if (!_prompted &&
        authState.status == AuthStatus.authenticated &&
        (authState.profile == null ||
            (authState.profile?.name ?? '').isEmpty)) {
      _prompted = true;
      WidgetsBinding.instance.addPostFrameCallback((_) {
        showDialog(
          context: context,
          builder: (context) {
            return AlertDialog(
              title: const Text('完善资料'),
              content: const Text('填写联系方式后，帮助与匹配更顺畅。'),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(context).pop(),
                  child: const Text('稍后再说'),
                ),
                TextButton(
                  onPressed: () {
                    Navigator.of(context).pop();
                    context.push('/me/profile');
                  },
                  child: const Text('去填写'),
                ),
              ],
            );
          },
        );
      });
    }

    return Scaffold(
      extendBody: Platform.isIOS,
      body: widget.child,
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppColors.accent,
        foregroundColor: Colors.white,
        icon: const Icon(CupertinoIcons.plus),
        label: const Text('发布求助'),
        onPressed: () => context.push('/publish'),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Platform.isIOS ? _iosTabBackground : AppColors.surface,
          border: Platform.isIOS
              ? null
              : Border(top: BorderSide(color: AppColors.border)),
        ),
        child: SafeArea(
          child: BottomNavigationBar(
            currentIndex: currentIndex,
            onTap: (index) => _onTap(context, index),
            backgroundColor:
                Platform.isIOS ? _iosTabBackground : AppColors.surface,
            selectedItemColor: AppColors.accent,
            unselectedItemColor: AppColors.textSecondary,
            type: BottomNavigationBarType.fixed,
            items: const [
              BottomNavigationBarItem(
                icon: Icon(CupertinoIcons.group_solid),
                label: '广场',
              ),
              BottomNavigationBarItem(
                icon: Icon(CupertinoIcons.bell_fill),
                label: '通知',
              ),
              BottomNavigationBarItem(
                icon: Icon(CupertinoIcons.person_fill),
                label: '我的',
              ),
            ],
          ),
        ),
      ),
    );
  }
}
