import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../features/auth/state/auth_notifier.dart';
import '../../../shared/widgets/app_buttons.dart';
import '../../../shared/widgets/app_card.dart';
import '../../../shared/widgets/app_scaffold.dart';

class ProfilePage extends ConsumerStatefulWidget {
  const ProfilePage({super.key});

  @override
  ConsumerState<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends ConsumerState<ProfilePage> {
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _wechatController = TextEditingController();
  bool _loading = false;
  String? _error;
  bool _prefilled = false;

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _wechatController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final profile = authState.profile;
    if (!_prefilled && profile != null) {
      _nameController.text = profile.name ?? '';
      _phoneController.text = profile.phone ?? '';
      _wechatController.text = profile.wechat ?? '';
      _prefilled = true;
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('编辑资料'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 18),
          onPressed: () => context.pop(),
        ),
      ),
      body: AppScaffold(
        child: ListView(
          children: [
            Text(
              '编辑资料',
              style: Theme.of(context).textTheme.headlineLarge,
            ),
            const SizedBox(height: 16),
            AppCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('姓名', style: Theme.of(context).textTheme.labelLarge),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _nameController,
                    decoration: const InputDecoration(hintText: '填写姓名'),
                  ),
                  const SizedBox(height: 16),
                  Text('电话', style: Theme.of(context).textTheme.labelLarge),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _phoneController,
                    decoration: const InputDecoration(hintText: '填写手机号'),
                  ),
                  const SizedBox(height: 16),
                  Text('微信', style: Theme.of(context).textTheme.labelLarge),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _wechatController,
                    decoration: const InputDecoration(hintText: '填写微信号'),
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
                    label: _loading ? '保存中...' : '保存资料',
                    loading: _loading,
                    expand: true,
                    onPressed: () async {
                      setState(() {
                        _loading = true;
                        _error = null;
                      });
                      try {
                        await ref.read(authProvider.notifier).updateProfile(
                              name: _nameController.text.trim(),
                              phone: _phoneController.text.trim(),
                              wechat: _wechatController.text.trim(),
                            );
                        if (!mounted) return;
                        WidgetsBinding.instance.addPostFrameCallback((_) {
                          if (!mounted) return;
                          if (context.canPop()) {
                            context.pop();
                          } else {
                            context.go('/me');
                          }
                        });
                      } catch (err) {
                        setState(() => _error = '保存失败，请稍后再试');
                      } finally {
                        if (mounted) {
                          setState(() => _loading = false);
                        }
                      }
                    },
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
