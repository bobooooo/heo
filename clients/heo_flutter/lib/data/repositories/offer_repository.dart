import 'package:dio/dio.dart';

class OfferRepository {
  OfferRepository(this._dio);

  final Dio _dio;

  Future<void> createOffer({
    required String requestId,
    required String name,
    required String phone,
    required String wechat,
  }) async {
    await _dio.post('/api/requests/$requestId/offers', data: {
      'name': name,
      'phone': phone,
      'wechat': wechat,
    });
  }

  Future<void> selectOffer(String offerId) async {
    await _dio.post('/api/offers/$offerId/select');
  }

  Future<void> cancelOffer(String offerId) async {
    await _dio.post('/api/offers/$offerId/cancel');
  }

  Future<void> cancelOfferByOwner(String offerId) async {
    await _dio.post('/api/offers/$offerId/cancel-by-owner');
  }
}
