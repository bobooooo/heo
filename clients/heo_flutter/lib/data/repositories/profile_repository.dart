import 'package:dio/dio.dart';

import '../models/profile.dart';

class ProfileRepository {
  ProfileRepository(this._dio);

  final Dio _dio;

  Future<Profile?> getProfile() async {
    final response = await _dio.get('/api/profile');
    if (response.data == null) return null;
    return Profile.fromJson(response.data as Map<String, dynamic>);
  }

  Future<Profile> updateProfile({
    required String? name,
    required String? phone,
    required String? wechat,
  }) async {
    final response = await _dio.put('/api/profile', data: {
      'name': name,
      'phone': phone,
      'wechat': wechat,
    });
    return Profile.fromJson(response.data as Map<String, dynamic>);
  }
}
