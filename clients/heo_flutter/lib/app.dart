import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'routes/app_router.dart';
import 'theme/app_theme.dart';

class MutualHelpApp extends ConsumerWidget {
  const MutualHelpApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);
    return MaterialApp.router(
      title: '互相帮助',
      theme: AppTheme.light(),
      routerConfig: router,
      builder: (context, child) {
        return CupertinoTheme(
          data: AppTheme.cupertino(),
          child: child ?? const SizedBox.shrink(),
        );
      },
    );
  }
}
