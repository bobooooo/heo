import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'api/api_client.dart';
import 'repositories/auth_repository.dart';
import 'repositories/city_repository.dart';
import 'repositories/me_repository.dart';
import 'repositories/notification_repository.dart';
import 'repositories/offer_repository.dart';
import 'repositories/profile_repository.dart';
import 'repositories/request_repository.dart';

final apiClientProvider = Provider<ApiClient>((ref) {
  throw UnimplementedError('ApiClient must be overridden in ProviderScope');
});

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository(ref.watch(apiClientProvider).dio);
});

final profileRepositoryProvider = Provider<ProfileRepository>((ref) {
  return ProfileRepository(ref.watch(apiClientProvider).dio);
});

final requestRepositoryProvider = Provider<RequestRepository>((ref) {
  return RequestRepository(ref.watch(apiClientProvider).dio);
});

final offerRepositoryProvider = Provider<OfferRepository>((ref) {
  return OfferRepository(ref.watch(apiClientProvider).dio);
});

final notificationRepositoryProvider = Provider<NotificationRepository>((ref) {
  return NotificationRepository(ref.watch(apiClientProvider).dio);
});

final cityRepositoryProvider = Provider<CityRepository>((ref) {
  return CityRepository(ref.watch(apiClientProvider).dio);
});

final meRepositoryProvider = Provider<MeRepository>((ref) {
  return MeRepository(ref.watch(apiClientProvider).dio);
});
