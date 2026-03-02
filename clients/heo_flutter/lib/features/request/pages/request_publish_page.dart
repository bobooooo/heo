import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../../data/models/city.dart';
import '../../../data/providers.dart';
import '../../../shared/widgets/app_buttons.dart';
import '../../../shared/widgets/app_card.dart';
import '../../../shared/widgets/app_scaffold.dart';
import '../../../shared/widgets/city_picker.dart';
import '../../../theme/app_theme.dart';

class RequestPublishPage extends ConsumerStatefulWidget {
  const RequestPublishPage({super.key});

  @override
  ConsumerState<RequestPublishPage> createState() => _RequestPublishPageState();
}

class _RequestPublishPageState extends ConsumerState<RequestPublishPage> {
  final _titleController = TextEditingController();
  final _detailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _wechatController = TextEditingController();
  DateTime? _time;
  String? _cityId;
  String? _cityName;
  String? _communityId;
  String _category = '陪诊';
  bool _loading = false;
  String? _error;

  @override
  void dispose() {
    _titleController.dispose();
    _detailController.dispose();
    _phoneController.dispose();
    _wechatController.dispose();
    super.dispose();
  }

  Future<void> _pickCity() async {
    final cityGroups = await ref.read(cityRepositoryProvider).loadCityGroups();
    final serverCities = await ref.read(cityRepositoryProvider).fetchServerCities();
    if (!mounted) return;
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (_) => CityPickerSheet(
        groups: cityGroups,
        allowAll: false,
        onSelect: (name) async {
          Navigator.of(context).pop();
          final matched = serverCities.firstWhere(
            (city) => city.name == name,
            orElse: () => const City(id: '', name: ''),
          );
          if (matched.id.isEmpty) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('该城市暂未开放')),
            );
            return;
          }
          final communities =
              await ref.read(cityRepositoryProvider).fetchCommunities(matched.id);
          setState(() {
            _cityId = matched.id;
            _cityName = matched.name;
            _communityId = communities.isNotEmpty ? communities.first.id : null;
          });
        },
      ),
    );
  }

  Future<void> _submit() async {
    if (_time == null ||
        _cityId == null ||
        _communityId == null ||
        _titleController.text.trim().isEmpty ||
        _detailController.text.trim().isEmpty ||
        _phoneController.text.trim().isEmpty ||
        _wechatController.text.trim().isEmpty) {
      setState(() => _error = '请完整填写信息');
      return;
    }
    setState(() {
      _error = null;
      _loading = true;
    });
    try {
      final id = await ref.read(requestRepositoryProvider).createRequest(
            time: _time!.toIso8601String(),
            title: _titleController.text.trim(),
            cityId: _cityId!,
            communityId: _communityId!,
            category: _category,
            detail: _detailController.text.trim(),
            contactPhone: _phoneController.text.trim(),
            contactWechat: _wechatController.text.trim(),
          );
      if (!mounted) return;
      context.go('/requests/$id');
    } catch (err) {
      setState(() => _error = '发布失败，请稍后再试');
    } finally {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('发布求助'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 18),
          onPressed: () => context.pop(),
        ),
      ),
      body: AppScaffold(
        child: ListView(
          children: [
            Text(
              '发布求助',
              style: Theme.of(context).textTheme.headlineLarge,
            ),
            const SizedBox(height: 8),
            Text(
              '清晰描述需求，方便找到合适帮手。',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 16),
            AppCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('求助时间', style: Theme.of(context).textTheme.labelLarge),
                  const SizedBox(height: 8),
                  GestureDetector(
                    onTap: () async {
                      final picked = await showDatePicker(
                        context: context,
                        firstDate: DateTime.now(),
                        lastDate: DateTime.now().add(const Duration(days: 180)),
                      );
                      if (picked == null) return;
                      final time = await showTimePicker(
                        context: context,
                        initialTime: TimeOfDay.fromDateTime(DateTime.now()),
                      );
                      if (time == null) return;
                      setState(() {
                        _time = DateTime(
                          picked.year,
                          picked.month,
                          picked.day,
                          time.hour,
                          time.minute,
                        );
                      });
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 14,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.surfaceWarm,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: Text(
                        _time == null
                            ? '选择时间'
                            : DateFormat('yyyy/MM/dd HH:mm').format(_time!),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text('标题', style: Theme.of(context).textTheme.labelLarge),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _titleController,
                    decoration: const InputDecoration(hintText: '简洁描述需求'),
                  ),
                  const SizedBox(height: 16),
                  Text('城市', style: Theme.of(context).textTheme.labelLarge),
                  const SizedBox(height: 8),
                  GestureDetector(
                    onTap: _pickCity,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 14,
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
                          Text(_cityName ?? '选择城市'),
                          const Spacer(),
                          const Icon(Icons.expand_more),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text('分类', style: Theme.of(context).textTheme.labelLarge),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    children: ['陪诊', '喂猫', '遛狗']
                        .map(
                          (item) => ChoiceChip(
                            label: Text(item),
                            selected: _category == item,
                            onSelected: (_) {
                              setState(() => _category = item);
                            },
                          ),
                        )
                        .toList(),
                  ),
                  const SizedBox(height: 16),
                  Text('联系电话', style: Theme.of(context).textTheme.labelLarge),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _phoneController,
                    decoration: const InputDecoration(hintText: '填写手机号'),
                  ),
                  const SizedBox(height: 16),
                  Text('联系微信', style: Theme.of(context).textTheme.labelLarge),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _wechatController,
                    decoration: const InputDecoration(hintText: '填写微信号'),
                  ),
                  const SizedBox(height: 16),
                  Text('详情描述', style: Theme.of(context).textTheme.labelLarge),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _detailController,
                    maxLines: 5,
                    decoration: const InputDecoration(hintText: '描述具体需求'),
                  ),
                  if (_error != null) ...[
                    const SizedBox(height: 12),
                    Text(
                      _error!,
                      style: const TextStyle(color: Colors.redAccent),
                    ),
                  ],
                  const SizedBox(height: 16),
                  PrimaryButton(
                    label: _loading ? '正在发布...' : '发布求助',
                    loading: _loading,
                    expand: true,
                    onPressed: _loading ? null : _submit,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
