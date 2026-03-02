import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../../data/models/my_request.dart';
import '../../../data/providers.dart';
import '../../../shared/widgets/app_buttons.dart';
import '../../../shared/widgets/app_card.dart';
import '../../../shared/widgets/app_scaffold.dart';
import '../../../shared/widgets/empty_state.dart';
import '../../../shared/widgets/status_chip.dart';
import '../../../theme/app_theme.dart';

class MyRequestsPage extends ConsumerWidget {
  const MyRequestsPage({super.key});

  Future<void> _handleAction(
    WidgetRef ref,
    Future<void> Function() action,
  ) async {
    await action();
    ref.refresh(_myRequestsProvider);
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final requestsAsync = ref.watch(_myRequestsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('我的求助'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 18),
          onPressed: () => context.pop(),
        ),
      ),
      body: AppScaffold(
        child: ListView(
          children: [
            Text(
              '我的求助',
              style: Theme.of(context).textTheme.headlineLarge,
            ),
            const SizedBox(height: 8),
            Text(
              '选择合适的帮助者并推进进度。',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 16),
            requestsAsync.when(
              data: (items) {
                if (items.isEmpty) {
                  return EmptyState(
                    title: '还没有发布求助',
                    description: '发布求助后可以在这里选择帮助者。',
                    actionLabel: '去发布求助',
                    onAction: () => context.push('/publish'),
                  );
                }
                return Column(
                  children: items.map((item) {
                    final selected = item.offers
                        .where((offer) => offer.status == 'SELECTED')
                        .toList();
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: AppCard(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(item.title,
                                          style: Theme.of(context)
                                              .textTheme
                                              .titleLarge),
                                      const SizedBox(height: 4),
                                      Text(
                                        '${item.cityName} · ${item.communityName} · ${DateFormat('MM/dd HH:mm').format(item.time)}',
                                        style: const TextStyle(
                                          fontSize: 12,
                                          color: AppColors.textSecondary,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                StatusChip(
                                  label: _statusLabel(item.status),
                                  color: statusColor(item.status),
                                ),
                              ],
                            ),
                            if (selected.isNotEmpty) ...[
                              const SizedBox(height: 12),
                              Text('已选择帮助者：${selected.first.name}'),
                              Text('电话：${selected.first.phone}'),
                              Text('微信：${selected.first.wechat}'),
                            ],
                            const SizedBox(height: 12),
                            if (item.offers.isNotEmpty)
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    '帮助申请（${item.offers.length}）',
                                    style: Theme.of(context).textTheme.bodyMedium,
                                  ),
                                  const SizedBox(height: 8),
                                  ...item.offers.map((offer) {
                                    return Padding(
                                      padding:
                                          const EdgeInsets.only(bottom: 8.0),
                                      child: Container(
                                        padding: const EdgeInsets.all(12),
                                        decoration: BoxDecoration(
                                          color: AppColors.surfaceWarm,
                                          borderRadius:
                                              BorderRadius.circular(14),
                                          border: Border.all(
                                              color: AppColors.border),
                                        ),
                                        child: Row(
                                          children: [
                                            Expanded(
                                              child: Column(
                                                crossAxisAlignment:
                                                    CrossAxisAlignment.start,
                                                children: [
                                                  Text(
                                                    offer.name,
                                                    style: const TextStyle(
                                                        fontWeight:
                                                            FontWeight.w600),
                                                  ),
                                                  Text(
                                                      '电话：${offer.phone} · 微信：${offer.wechat}'),
                                                ],
                                              ),
                                            ),
                                            if (item.status == 'OPEN' &&
                                                offer.status == 'PENDING')
                                              PrimaryButton(
                                                label: '选择',
                                                onPressed: () => _handleAction(
                                                  ref,
                                                  () => ref
                                                      .read(offerRepositoryProvider)
                                                      .selectOffer(offer.id),
                                                ),
                                              ),
                                          ],
                                        ),
                                      ),
                                    );
                                  }).toList(),
                                ],
                              ),
                            const SizedBox(height: 12),
                            Wrap(
                              spacing: 8,
                              children: [
                                if (item.status == 'OPEN')
                                  GhostButton(
                                    label: '取消求助',
                                    onPressed: () => _handleAction(
                                      ref,
                                      () => ref
                                          .read(requestRepositoryProvider)
                                          .cancelRequest(item.id),
                                    ),
                                  ),
                                if (item.status == 'MATCHED' &&
                                    selected.isNotEmpty) ...[
                                  PrimaryButton(
                                    label: '标记完成',
                                    onPressed: () => _handleAction(
                                      ref,
                                      () => ref
                                          .read(requestRepositoryProvider)
                                          .completeRequest(item.id),
                                    ),
                                  ),
                                  GhostButton(
                                    label: '取消匹配',
                                    onPressed: () => _handleAction(
                                      ref,
                                      () => ref
                                          .read(offerRepositoryProvider)
                                          .cancelOfferByOwner(selected.first.id),
                                    ),
                                  ),
                                ],
                              ],
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
      ),
    );
  }

  String _statusLabel(String status) {
    switch (status) {
      case 'MATCHED':
        return '待完成';
      case 'COMPLETED':
        return '已完成';
      case 'CANCELED':
        return '已取消';
      default:
        return '发布中';
    }
  }
}

final _myRequestsProvider = FutureProvider<List<MyRequest>>((ref) {
  return ref.read(meRepositoryProvider).fetchMyRequests();
});
