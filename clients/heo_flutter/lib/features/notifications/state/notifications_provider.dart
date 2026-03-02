import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/models/notification_item.dart';
import '../../../data/providers.dart';

final notificationsProvider = FutureProvider<List<NotificationItem>>((ref) {
  return ref.read(notificationRepositoryProvider).fetchNotifications();
});
