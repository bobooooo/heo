import 'package:dio/dio.dart';

import '../models/my_offer.dart';
import '../models/my_request.dart';

class MeRepository {
  MeRepository(this._dio);

  final Dio _dio;

  Future<List<MyRequest>> fetchMyRequests() async {
    final response = await _dio.get('/api/me/requests');
    final list = response.data as List<dynamic>? ?? [];
    return list
        .map((item) => MyRequest.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  Future<List<MyOffer>> fetchMyOffers() async {
    final response = await _dio.get('/api/me/offers');
    final list = response.data as List<dynamic>? ?? [];
    return list
        .map((item) => MyOffer.fromJson(item as Map<String, dynamic>))
        .toList();
  }
}
