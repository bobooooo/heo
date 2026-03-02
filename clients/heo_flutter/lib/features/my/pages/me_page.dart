import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../features/auth/state/auth_notifier.dart';
import '../../../shared/widgets/app_buttons.dart';
import '../../../shared/widgets/app_card.dart';
import '../../../shared/widgets/app_scaffold.dart';
import '../../../theme/app_theme.dart';

class MePage extends ConsumerWidget {
  const MePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final profile = authState.profile;

    return AppScaffold(
      child: ListView(
        children: [
            Text(
              '我的',
              style: Theme.of(context).textTheme.headlineLarge,
            ),
            const SizedBox(height: 8),
            Text(
              profile?.name?.isNotEmpty == true
                  ? '你好，${profile!.name}'
                  : '管理你的求助与帮助记录',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 16),
            AppCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('个人资料', style: Theme.of(context).textTheme.titleLarge),
                  const SizedBox(height: 8),
                  Text('姓名：${profile?.name ?? '未填写'}'),
                  Text('电话：${profile?.phone ?? '未填写'}'),
                  Text('微信：${profile?.wechat ?? '未填写'}'),
                  const SizedBox(height: 12),
                  GhostButton(
                    label: '编辑资料',
                    onPressed: () => context.push('/me/profile'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            AppCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('我的求助', style: Theme.of(context).textTheme.titleLarge),
                  const SizedBox(height: 8),
                  Text(
                    '查看你发布的求助并选择帮助者。',
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                  const SizedBox(height: 12),
                  GhostButton(
                    label: '进入我的求助',
                    onPressed: () => context.push('/me/requests'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            AppCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('我的帮助', style: Theme.of(context).textTheme.titleLarge),
                  const SizedBox(height: 8),
                  Text(
                    '查看你申请的帮助与匹配状态。',
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                  const SizedBox(height: 12),
                  GhostButton(
                    label: '进入我的帮助',
                    onPressed: () => context.push('/me/offers'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            PrimaryButton(
              label: '退出登录',
              expand: true,
              onPressed: () => ref.read(authProvider.notifier).logout(),
            ),
          ],
        ),
      );
  }
}
