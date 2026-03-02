import 'package:dio/dio.dart';

import '../models/notification_item.dart';

class NotificationRepository {
  NotificationRepository(this._dio);

  final Dio _dio;

  Future<List<NotificationItem>> fetchNotifications() async {
    final response = await _dio.get('/api/notifications');
    final list = response.data as List<dynamic>? ?? [];
    return list
        .map((item) => NotificationItem.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  Future<void> markRead(String id) async {
    await _dio.post('/api/notifications/$id/read');
  }
}
