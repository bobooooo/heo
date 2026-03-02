import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../../shared/widgets/app_card.dart';
import '../../../shared/widgets/app_scaffold.dart';
import '../../../shared/widgets/empty_state.dart';
import '../../../theme/app_theme.dart';
import '../state/notifications_provider.dart';
import '../../../data/providers.dart';

class NotificationsPage extends ConsumerWidget {
  const NotificationsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final notificationsAsync = ref.watch(notificationsProvider);

    return AppScaffold(
      child: ListView(
        children: [
            Text(
              '通知中心',
              style: Theme.of(context).textTheme.headlineLarge,
            ),
            const SizedBox(height: 8),
            Text(
              '系统会在这里提醒你求助进度。',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 16),
            notificationsAsync.when(
              data: (items) {
                if (items.isEmpty) {
                  return EmptyState(
                    title: '暂无通知',
                    description: '等有人回应你的求助时，这里会第一时间提示。',
                    actionLabel: '去广场看看',
                    onAction: () => context.go('/'),
                  );
                }
                return Column(
                  children: items.map((note) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: AppCard(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _typeLabel(note.type),
                              style: Theme.of(context).textTheme.titleLarge,
                            ),
                            const SizedBox(height: 8),
                            Text(
                              DateFormat('yyyy/MM/dd HH:mm')
                                  .format(note.createdAt),
                              style: const TextStyle(
                                fontSize: 12,
                                color: AppColors.textSecondary,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              '相关求助：${note.payload['requestId'] ?? '-'}',
                              style: Theme.of(context).textTheme.bodyMedium,
                            ),
                            const SizedBox(height: 12),
                            TextButton(
                              onPressed: () async {
                                await ref
                                    .read(notificationRepositoryProvider)
                                    .markRead(note.id);
                                ref.refresh(notificationsProvider);
                              },
                              child: Text(note.readAt == null ? '标记已读' : '已读'),
                            ),
                          ],
                        ),
                      ),
                    );
                  }).toList(),
                );
              },
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (error, _) => AppCard(child: Text('加载失败：$error')),
            ),
          ],
        ),
      );
  }

  String _typeLabel(String type) {
    switch (type) {
      case 'offer_submitted':
        return '收到新的帮助申请';
      case 'offer_selected':
        return '你被选为帮助者';
      case 'offer_rejected':
        return '你的帮助申请被婉拒';
      case 'offer_canceled':
        return '帮助者取消了申请';
      case 'offer_canceled_by_owner':
        return '发布者取消了匹配';
      case 'request_canceled':
        return '求助已取消';
      case 'request_completed':
        return '求助赢得完成';
      default:
        return '系统通知';
    }
  }
}
