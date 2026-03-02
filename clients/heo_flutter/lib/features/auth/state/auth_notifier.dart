import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/providers.dart';
import '../../../data/repositories/auth_repository.dart';
import '../../../data/repositories/profile_repository.dart';
import 'auth_state.dart';

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier(this._ref)
      : _authRepository = _ref.read(authRepositoryProvider),
        _profileRepository = _ref.read(profileRepositoryProvider),
        super(authUnknownState) {
    initialize();
  }

  final Ref _ref;
  final AuthRepository _authRepository;
  final ProfileRepository _profileRepository;

  Future<void> initialize() async {
    state = state.copyWith(status: AuthStatus.loading, error: null);
    try {
      final profile = await _profileRepository.getProfile();
      state = state.copyWith(
        status: AuthStatus.authenticated,
        profile: profile,
      );
    } on DioException catch (error) {
      if (error.response?.statusCode == 401) {
        state = state.copyWith(status: AuthStatus.unauthenticated);
      } else {
        state = state.copyWith(
          status: AuthStatus.unauthenticated,
          error: '无法连接服务器',
        );
      }
    }
  }

  Future<void> login(String username, String password) async {
    state = state.copyWith(status: AuthStatus.loading, error: null);
    try {
      final name = await _authRepository.login(username, password);
      final profile = await _profileRepository.getProfile();
      state = state.copyWith(
        status: AuthStatus.authenticated,
        username: name,
        profile: profile,
      );
    } on DioException catch (error) {
      final message =
          error.response?.data?['error']?.toString() ?? '登录失败';
      state = state.copyWith(
        status: AuthStatus.unauthenticated,
        error: message,
      );
    }
  }

  Future<void> register(String username, String password) async {
    state = state.copyWith(status: AuthStatus.loading, error: null);
    try {
      final name = await _authRepository.register(username, password);
      final profile = await _profileRepository.getProfile();
      state = state.copyWith(
        status: AuthStatus.authenticated,
        username: name,
        profile: profile,
      );
    } on DioException catch (error) {
      final message =
          error.response?.data?['error']?.toString() ?? '注册失败';
      state = state.copyWith(
        status: AuthStatus.unauthenticated,
        error: message,
      );
    }
  }

  Future<void> logout() async {
    await _authRepository.logout();
    state = authUnknownState.copyWith(status: AuthStatus.unauthenticated);
  }

  Future<void> refreshProfile() async {
    final profile = await _profileRepository.getProfile();
    state = state.copyWith(profile: profile);
  }

  Future<void> updateProfile({
    required String? name,
    required String? phone,
    required String? wechat,
  }) async {
    final profile = await _profileRepository.updateProfile(
      name: name,
      phone: phone,
      wechat: wechat,
    );
    state = state.copyWith(profile: profile);
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref);
});
