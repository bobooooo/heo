import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../features/auth/pages/boot_page.dart';
import '../features/auth/pages/login_page.dart';
import '../features/auth/pages/register_page.dart';
import '../features/auth/state/auth_notifier.dart';
import '../features/auth/state/auth_state.dart';
import '../features/my/pages/me_page.dart';
import '../features/notifications/pages/notifications_page.dart';
import '../features/request/pages/request_detail_page.dart';
import '../features/request/pages/request_publish_page.dart';
import '../features/square/pages/square_page.dart';
import '../features/profile/pages/profile_page.dart';
import '../features/my/pages/my_offers_page.dart';
import '../features/my/pages/my_requests_page.dart';
import 'shell_page.dart';

class AuthRouterNotifier extends ChangeNotifier {
  AuthRouterNotifier(this.ref) {
    ref.listen<AuthState>(authProvider, (_, __) => notifyListeners());
  }

  final Ref ref;

  AuthState get authState => ref.read(authProvider);
}

final routerProvider = Provider<GoRouter>((ref) {
  final notifier = AuthRouterNotifier(ref);

  return GoRouter(
    refreshListenable: notifier,
    initialLocation: '/boot',
    routes: [
      GoRoute(
        path: '/boot',
        builder: (context, state) => const BootPage(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginPage(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => const RegisterPage(),
      ),
      GoRoute(
        path: '/requests/:id',
        builder: (context, state) =>
            RequestDetailPage(requestId: state.pathParameters['id'] ?? ''),
      ),
      GoRoute(
        path: '/me/profile',
        builder: (context, state) => const ProfilePage(),
      ),
      GoRoute(
        path: '/me/requests',
        builder: (context, state) => const MyRequestsPage(),
      ),
      GoRoute(
        path: '/me/offers',
        builder: (context, state) => const MyOffersPage(),
      ),
      GoRoute(
        path: '/publish',
        builder: (context, state) => const RequestPublishPage(),
      ),
      ShellRoute(
        builder: (context, state, child) {
          return ShellPage(child: child);
        },
        routes: [
          GoRoute(
            path: '/',
            builder: (context, state) => const SquarePage(),
          ),
          GoRoute(
            path: '/notifications',
            builder: (context, state) => const NotificationsPage(),
          ),
          GoRoute(
            path: '/me',
            builder: (context, state) => const MePage(),
          ),
        ],
      ),
    ],
    redirect: (context, state) {
      final status = notifier.authState.status;
      final isBoot = state.matchedLocation == '/boot';
      final isAuthPage = state.matchedLocation == '/login' ||
          state.matchedLocation == '/register';

      if (status == AuthStatus.loading || status == AuthStatus.unknown) {
        return isBoot ? null : '/boot';
      }

      if (status == AuthStatus.unauthenticated && !isAuthPage) {
        return '/login';
      }
      if (status == AuthStatus.authenticated && isAuthPage) {
        return '/';
      }
      if (status == AuthStatus.authenticated && isBoot) {
        return '/';
      }
      if (status == AuthStatus.unauthenticated && isBoot) {
        return '/login';
      }
      return null;
    },
  );
});
