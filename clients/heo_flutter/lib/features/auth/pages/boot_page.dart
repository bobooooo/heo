import 'package:flutter/material.dart';

import '../../../shared/widgets/app_scaffold.dart';

class BootPage extends StatelessWidget {
  const BootPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: AppScaffold(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const [
            CircularProgressIndicator(),
            SizedBox(height: 16),
            Text('正在加载，请稍候...'),
          ],
        ),
      ),
    );
  }
}
