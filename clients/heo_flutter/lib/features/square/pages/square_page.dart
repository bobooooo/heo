import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../../data/models/city.dart';
import '../../../shared/widgets/app_card.dart';
import '../../../shared/widgets/app_scaffold.dart';
import '../../../shared/widgets/city_picker.dart';
import '../../../shared/widgets/status_chip.dart';
import '../../../theme/app_theme.dart';
import '../state/square_providers.dart';

class SquarePage extends ConsumerWidget {
  const SquarePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final requestsAsync = ref.watch(requestsProvider);
    final cityGroupsAsync = ref.watch(cityGroupsProvider);
    final serverCitiesAsync = ref.watch(serverCitiesProvider);
    final selectedCityName = ref.watch(selectedCityNameProvider);
    final selectedStatus = ref.watch(selectedStatusProvider);

    return AppScaffold(
      child: ListView(
        children: [
            Text(
              '互相帮助广场',
              style: Theme.of(context).textTheme.headlineLarge,
            ),
            const SizedBox(height: 8),
            Text(
              '筛选城市后查看附近的求助需求。',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 16),
            AppCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    '筛选范围',
                    style: TextStyle(
                      fontSize: 12,
                      color: AppColors.textSecondary,
                      letterSpacing: 2,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: GestureDetector(
                          onTap: () async {
                            final groups =
                                await ref.read(cityGroupsProvider.future);
                            final serverCities =
                                await ref.read(serverCitiesProvider.future);
                            if (!context.mounted) return;
                            showModalBottomSheet(
                              context: context,
                              isScrollControlled: true,
                              builder: (_) => CityPickerSheet(
                                groups: groups,
                                allowAll: true,
                                onSelect: (name) {
                                  Navigator.of(context).pop();
                                  if (name == '全部') {
                                    ref
                                        .read(selectedCityIdProvider.notifier)
                                        .state = null;
                                    ref
                                        .read(selectedCityNameProvider.notifier)
                                        .state = '全部';
                                    return;
                                  }
                                  final matched = serverCities.firstWhere(
                                    (city) => city.name == name,
                                    orElse: () => const City(id: '', name: ''),
                                  );
                                  if (matched.id.isEmpty) {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(
                                        content: Text('该城市暂未开放'),
                                      ),
                                    );
                                    return;
                                  }
                                  ref
                                      .read(selectedCityIdProvider.notifier)
                                      .state = matched.id;
                                  ref
                                      .read(selectedCityNameProvider.notifier)
                                      .state = matched.name;
                                },
                              ),
                            );
                          },
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 12,
                            ),
                            decoration: BoxDecoration(
                              color: AppColors.surfaceWarm,
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(color: AppColors.border),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.location_on_outlined,
                                    size: 18, color: AppColors.accent),
                                const SizedBox(width: 8),
                                Text(
                                  selectedCityName ?? '全部',
                                  style: const TextStyle(
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                const Spacer(),
                                const Icon(Icons.expand_more),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: ['OPEN', 'MATCHED', 'COMPLETED', 'CANCELED']
                        .map((status) => ChoiceChip(
                              label: Text(_statusLabel(status)),
                              selected: selectedStatus == status,
                              selectedColor:
                                  AppColors.accent.withOpacity(0.15),
                              onSelected: (_) {
                                ref
                                    .read(selectedStatusProvider.notifier)
                                    .state = status;
                              },
                            ))
                        .toList(),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            requestsAsync.when(
              data: (requests) {
                if (requests.isEmpty) {
                  return AppCard(
                    child: Text(
                      '当前筛选条件下暂无求助需求。',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                  );
                }
                return Column(
                  children: requests.map((request) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: AppCard(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        '${request.cityName} · ${request.communityName}',
                                        style: const TextStyle(
                                          fontSize: 12,
                                          color: AppColors.textSecondary,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        request.title,
                                        style: Theme.of(context)
                                            .textTheme
                                            .titleLarge,
                                      ),
                                    ],
                                  ),
                                ),
                                StatusChip(
                                  label: _statusLabel(request.status),
                                  color: statusColor(request.status),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            Text(
                              request.detail,
                              style: Theme.of(context).textTheme.bodyMedium,
                            ),
                            const SizedBox(height: 12),
                            Text(
                              '时间：${DateFormat('yyyy/MM/dd HH:mm').format(request.time)} · 分类：${request.category} · 已有 ${request.offersCount} 人申请',
                              style: const TextStyle(
                                fontSize: 12,
                                color: AppColors.textSecondary,
                              ),
                            ),
                            const SizedBox(height: 12),
                            Row(
                              children: [
                                TextButton(
                                  onPressed: () {
                                    context.push('/requests/${request.id}');
                                  },
                                  child: const Text('查看详情'),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    );
                  }).toList(),
                );
              },
              loading: () => const Center(
                child: Padding(
                  padding: EdgeInsets.all(24),
                  child: CircularProgressIndicator(),
                ),
              ),
              error: (error, _) => AppCard(
                child: Text('加载失败：$error'),
              ),
            ),
          ],
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
