import 'package:dio/dio.dart';

class AuthRepository {
  AuthRepository(this._dio);

  final Dio _dio;

  Future<String> login(String username, String password) async {
    final response = await _dio.post('/api/auth/login', data: {
      'username': username,
      'password': password,
    });
    return response.data['username']?.toString() ?? username;
  }

  Future<String> register(String username, String password) async {
    final response = await _dio.post('/api/auth/register', data: {
      'username': username,
      'password': password,
    });
    return response.data['username']?.toString() ?? username;
  }

  Future<void> logout() async {
    await _dio.post('/api/auth/logout');
  }
}
