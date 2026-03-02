import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/models/help_request.dart';
import '../../../data/models/city.dart';
import '../../../data/providers.dart';

final selectedCityIdProvider = StateProvider<String?>((ref) => null);
final selectedCityNameProvider = StateProvider<String?>((ref) => '全部');
final selectedStatusProvider = StateProvider<String>((ref) => 'OPEN');

final serverCitiesProvider = FutureProvider<List<City>>((ref) async {
  return ref.read(cityRepositoryProvider).fetchServerCities();
});

final cityGroupsProvider = FutureProvider<List<CityGroup>>((ref) async {
  return ref.read(cityRepositoryProvider).loadCityGroups();
});

final requestsProvider = FutureProvider<List<HelpRequest>>((ref) async {
  final cityId = ref.watch(selectedCityIdProvider);
  final status = ref.watch(selectedStatusProvider);
  return ref.read(requestRepositoryProvider).listRequests(
        cityId: cityId,
        status: status,
      );
});
