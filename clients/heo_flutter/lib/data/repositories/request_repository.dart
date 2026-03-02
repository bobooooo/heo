import 'package:dio/dio.dart';

import '../models/help_request.dart';

class RequestRepository {
  RequestRepository(this._dio);

  final Dio _dio;

  Future<List<HelpRequest>> listRequests({
    String? cityId,
    String? communityId,
    String? status,
  }) async {
    final response = await _dio.get('/api/requests', queryParameters: {
      if (cityId != null && cityId.isNotEmpty) 'cityId': cityId,
      if (communityId != null && communityId.isNotEmpty)
        'communityId': communityId,
      if (status != null && status.isNotEmpty) 'status': status,
    });
    final list = response.data as List<dynamic>? ?? [];
    return list
        .map((item) => HelpRequest.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  Future<HelpRequest> getRequest(String id) async {
    final response = await _dio.get('/api/requests/$id');
    return HelpRequest.fromJson(response.data as Map<String, dynamic>);
  }

  Future<String> createRequest({
    required String time,
    required String title,
    required String cityId,
    required String communityId,
    required String category,
    required String detail,
    required String contactPhone,
    required String contactWechat,
  }) async {
    final response = await _dio.post('/api/requests', data: {
      'time': time,
      'title': title,
      'cityId': cityId,
      'communityId': communityId,
      'category': category,
      'detail': detail,
      'contactPhone': contactPhone,
      'contactWechat': contactWechat,
    });
    return response.data['id']?.toString() ?? '';
  }

  Future<void> cancelRequest(String id) async {
    await _dio.post('/api/requests/$id/cancel');
  }

  Future<void> completeRequest(String id) async {
    await _dio.post('/api/requests/$id/complete');
  }
}
