import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio/dio.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:path_provider/path_provider.dart';

class ApiClient {
  ApiClient._(this.dio);

  final Dio dio;

  static Future<ApiClient> create() async {
    final fallback = 'http://39.107.251.224:3000';
    final baseUrl = dotenv.env['API_BASE_URL'] ?? fallback;
    final options = BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 12),
      receiveTimeout: const Duration(seconds: 15),
      headers: {'Content-Type': 'application/json'},
    );
    final dio = Dio(options);
    final dir = await getApplicationDocumentsDirectory();
    final jar = PersistCookieJar(storage: FileStorage('${dir.path}/cookies'));
    dio.interceptors.add(CookieManager(jar));
    return ApiClient._(dio);
  }
}
