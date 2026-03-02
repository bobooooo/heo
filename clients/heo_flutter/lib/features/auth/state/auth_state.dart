import '../../../data/models/profile.dart';

enum AuthStatus {
  unknown,
  authenticated,
  unauthenticated,
  loading,
}

class AuthState {
  const AuthState({
    required this.status,
    this.username,
    this.profile,
    this.error,
  });

  final AuthStatus status;
  final String? username;
  final Profile? profile;
  final String? error;

  AuthState copyWith({
    AuthStatus? status,
    String? username,
    Profile? profile,
    String? error,
  }) {
    return AuthState(
      status: status ?? this.status,
      username: username ?? this.username,
      profile: profile ?? this.profile,
      error: error,
    );
  }
}

const authUnknownState = AuthState(status: AuthStatus.unknown);
