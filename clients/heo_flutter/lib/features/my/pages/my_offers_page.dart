import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../../data/models/my_offer.dart';
import '../../../data/providers.dart';
import '../../../shared/widgets/app_buttons.dart';
import '../../../shared/widgets/app_card.dart';
import '../../../shared/widgets/app_scaffold.dart';
import '../../../shared/widgets/empty_state.dart';
import '../../../shared/widgets/status_chip.dart';
import '../../../theme/app_theme.dart';

class MyOffersPage extends ConsumerWidget {
  const MyOffersPage({super.key});

  Future<void> _cancel(WidgetRef ref, String offerId) async {
    await ref.read(offerRepositoryProvider).cancelOffer(offerId);
    ref.refresh(_myOffersProvider);
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final offersAsync = ref.watch(_myOffersProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('我的帮助'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 18),
          onPressed: () => context.pop(),
        ),
      ),
      body: AppScaffold(
        child: ListView(
          children: [
            Text(
              '我的帮助',
              style: Theme.of(context).textTheme.headlineLarge,
            ),
            const SizedBox(height: 8),
            Text(
              '查看你申请的帮助与匹配状态。',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 16),
            offersAsync.when(
              data: (offers) {
                if (offers.isEmpty) {
                  return EmptyState(
                    title: '还没有帮助记录',
                    description: '去广场看看有没有适合你的求助。',
                    actionLabel: '去广场看看',
                    onAction: () => context.go('/'),
                  );
                }
                return Column(
                  children: offers.map((offer) {
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
                                      Text(
                                        offer.requestTitle,
                                        style: Theme.of(context)
                                            .textTheme
                                            .titleLarge,
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        '${offer.cityName} · ${offer.communityName} · ${DateFormat('MM/dd HH:mm').format(offer.requestTime)}',
                                        style: const TextStyle(
                                          fontSize: 12,
                                          color: AppColors.textSecondary,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                StatusChip(
                                  label: _statusLabel(offer.status),
                                  color: _statusColor(offer.status),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            if (offer.status == 'SELECTED')
                              const Text('你已被选中，请尽快线下联系发布者。'),
                            const SizedBox(height: 12),
                            if (offer.status == 'PENDING' ||
                                offer.status == 'SELECTED')
                              GhostButton(
                                label: '取消帮助',
                                onPressed: () => _cancel(ref, offer.id),
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
      case 'SELECTED':
        return '已选中';
      case 'REJECTED':
        return '已拒绝';
      case 'CANCELED':
        return '已取消';
      default:
        return '申请中';
    }
  }

  Color _statusColor(String status) {
    switch (status) {
      case 'SELECTED':
        return AppColors.accent;
      case 'REJECTED':
        return const Color(0xFF7A6E60);
      case 'CANCELED':
        return const Color(0xFF7A6E60);
      default:
        return AppColors.highlight;
    }
  }
}

final _myOffersProvider = FutureProvider<List<MyOffer>>((ref) {
  return ref.read(meRepositoryProvider).fetchMyOffers();
});
