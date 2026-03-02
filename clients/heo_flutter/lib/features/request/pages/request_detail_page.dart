import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

import '../../../data/models/help_request.dart';
import '../../../data/providers.dart';
import '../../../shared/widgets/app_buttons.dart';
import '../../../shared/widgets/app_card.dart';
import '../../../shared/widgets/app_scaffold.dart';
import '../../../shared/widgets/status_chip.dart';
import '../../../theme/app_theme.dart';
import '../../auth/state/auth_notifier.dart';

class RequestDetailPage extends ConsumerStatefulWidget {
  const RequestDetailPage({super.key, required this.requestId});

  final String requestId;

  @override
  ConsumerState<RequestDetailPage> createState() => _RequestDetailPageState();
}

class _RequestDetailPageState extends ConsumerState<RequestDetailPage> {
  bool _loading = false;
  String? _error;
  String? _success;
  bool _prefilled = false;

  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _wechatController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _wechatController.dispose();
    super.dispose();
  }

  Future<void> _submitHelp(HelpRequest request) async {
    final name = _nameController.text.trim();
    final phone = _phoneController.text.trim();
    final wechat = _wechatController.text.trim();
    if (name.isEmpty || phone.isEmpty || wechat.isEmpty) {
      setState(() => _error = '请填写完整联系方式');
      return;
    }
    setState(() {
      _loading = true;
      _error = null;
      _success = null;
    });
    try {
      await ref.read(offerRepositoryProvider).createOffer(
            requestId: request.id,
            name: name,
            phone: phone,
            wechat: wechat,
          );
      setState(() => _success = '已提交帮助信息，请等待发布者选择。');
    } catch (err) {
      setState(() => _error = '提交失败，请稍后再试');
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('求助详情'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 18),
          onPressed: () {
            if (!context.canPop()) {
              context.go('/');
              return;
            }
            context.pop();
          },
        ),
      ),
      body: AppScaffold(
        child: FutureBuilder<HelpRequest>(
          future:
              ref.read(requestRepositoryProvider).getRequest(widget.requestId),
          builder: (context, snapshot) {
            if (!snapshot.hasData) {
              return const Center(child: CircularProgressIndicator());
            }
            final request = snapshot.data!;
            final isOwner =
                authState.profile?.userId == request.userId && request.userId.isNotEmpty;
            final canHelp = request.status == 'OPEN' && !isOwner;

            if (!_prefilled && authState.profile != null) {
              _nameController.text = authState.profile?.name ?? '';
              _phoneController.text = authState.profile?.phone ?? '';
              _wechatController.text = authState.profile?.wechat ?? '';
              _prefilled = true;
            }

            return ListView(
              children: [
                Text(
                  request.title,
                  style: Theme.of(context).textTheme.headlineLarge,
                ),
                const SizedBox(height: 8),
                Text(
                  '${request.cityName} · ${request.communityName}',
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
                const SizedBox(height: 8),
                StatusChip(
                  label: _statusLabel(request.status),
                  color: statusColor(request.status),
                ),
                const SizedBox(height: 16),
                AppCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('详情描述',
                          style: Theme.of(context).textTheme.labelLarge),
                      const SizedBox(height: 8),
                      Text(request.detail),
                      const SizedBox(height: 12),
                      Text(
                        '时间：${DateFormat('yyyy/MM/dd HH:mm').format(request.time)}',
                        style: const TextStyle(color: AppColors.textSecondary),
                      ),
                      Text(
                        '分类：${request.category}',
                        style: const TextStyle(color: AppColors.textSecondary),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                AppCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('联系信息',
                          style: Theme.of(context).textTheme.labelLarge),
                      const SizedBox(height: 8),
                      Text('电话：${request.contactPhone}'),
                      Text('微信：${request.contactWechat}'),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                AppCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('我可以帮忙',
                          style: Theme.of(context).textTheme.labelLarge),
                      const SizedBox(height: 12),
                      if (!canHelp)
                        Text(
                          isOwner ? '自己发布的求助无法申请' : '该求助已无法申请',
                          style: const TextStyle(color: AppColors.textSecondary),
                        ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: _nameController,
                        decoration: const InputDecoration(hintText: '姓名'),
                        enabled: canHelp,
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: _phoneController,
                        decoration: const InputDecoration(hintText: '联系电话'),
                        enabled: canHelp,
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: _wechatController,
                        decoration: const InputDecoration(hintText: '微信号'),
                        enabled: canHelp,
                      ),
                      if (_error != null) ...[
                        const SizedBox(height: 12),
                        Text(_error!,
                            style: const TextStyle(color: Colors.redAccent)),
                      ],
                      if (_success != null) ...[
                        const SizedBox(height: 12),
                        Text(_success!,
                            style: const TextStyle(color: AppColors.highlight)),
                      ],
                      const SizedBox(height: 16),
                      PrimaryButton(
                        label: _loading ? '提交中...' : '提交帮助',
                        loading: _loading,
                        expand: true,
                        onPressed: canHelp && !_loading
                            ? () => _submitHelp(request)
                            : null,
                      ),
                    ],
                  ),
                ),
              ],
            );
          },
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
