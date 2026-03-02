import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../features/auth/state/auth_notifier.dart';
import '../../../features/auth/state/auth_state.dart';
import '../../../shared/widgets/app_buttons.dart';
import '../../../shared/widgets/app_card.dart';
import '../../../shared/widgets/app_scaffold.dart';
import '../../../theme/app_theme.dart';

class RegisterPage extends ConsumerStatefulWidget {
  const RegisterPage({super.key});

  @override
  ConsumerState<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends ConsumerState<RegisterPage> {
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmController = TextEditingController();
  String? _localError;

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    _confirmController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final loading = authState.status == AuthStatus.loading;

    return Scaffold(
      body: AppScaffold(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 16),
            Text(
              '创建账号',
              style: Theme.of(context).textTheme.headlineLarge,
            ),
            const SizedBox(height: 8),
            Text(
              '加入互相帮助社区',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 24),
            AppCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('用户名', style: Theme.of(context).textTheme.labelLarge),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _usernameController,
                    decoration: const InputDecoration(hintText: '设置用户名'),
                  ),
                  const SizedBox(height: 16),
                  Text('密码', style: Theme.of(context).textTheme.labelLarge),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _passwordController,
                    obscureText: true,
                    decoration: const InputDecoration(hintText: '设置密码'),
                  ),
                  const SizedBox(height: 16),
                  Text('确认密码', style: Theme.of(context).textTheme.labelLarge),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _confirmController,
                    obscureText: true,
                    decoration: const InputDecoration(hintText: '再次输入密码'),
                  ),
                  if (_localError != null) ...[
                    const SizedBox(height: 16),
                    Text(
                      _localError!,
                      style: const TextStyle(color: Colors.redAccent),
                    ),
                  ],
                  if (authState.error != null) ...[
                    const SizedBox(height: 8),
                    Text(
                      authState.error!,
                      style: const TextStyle(color: Colors.redAccent),
                    ),
                  ],
                  const SizedBox(height: 20),
                  PrimaryButton(
                    label: loading ? '正在注册...' : '完成注册',
                    loading: loading,
                    expand: true,
                    onPressed: () {
                      final password = _passwordController.text.trim();
                      if (password != _confirmController.text.trim()) {
                        setState(() {
                          _localError = '两次输入的密码不一致';
                        });
                        return;
                      }
                      setState(() => _localError = null);
                      ref.read(authProvider.notifier).register(
                            _usernameController.text.trim(),
                            password,
                          );
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            GestureDetector(
              onTap: () => context.go('/login'),
              child: const Text(
                '已有账号？返回登录',
                style: TextStyle(
                  color: AppColors.accent,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
