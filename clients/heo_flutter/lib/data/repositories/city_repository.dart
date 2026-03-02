import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:flutter/services.dart';

import '../models/city.dart';
import '../models/community.dart';

class CityRepository {
  CityRepository(this._dio);

  final Dio _dio;

  Future<List<City>> fetchServerCities() async {
    final response = await _dio.get('/api/cities');
    final list = response.data as List<dynamic>? ?? [];
    return list.map((item) => City.fromJson(item as Map<String, dynamic>)).toList();
  }

  Future<List<Community>> fetchCommunities(String cityId) async {
    final response = await _dio.get('/api/cities/$cityId/communities');
    final list = response.data as List<dynamic>? ?? [];
    return list
        .map((item) => Community.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  Future<List<CityGroup>> loadCityGroups() async {
    final raw = await rootBundle.loadString('assets/cities/city_list.json');
    final json = jsonDecode(raw) as Map<String, dynamic>;
    final selectList = (json['select_list'] as List<dynamic>? ?? [])
        .map((item) => item.toString())
        .toList();
    final cityList = json['city_list'] as Map<String, dynamic>? ?? {};

    return selectList.map((groupLabel) {
      final List<CityOption> options = [];
      if (groupLabel == '热门城市') {
        final hotList = cityList['热门城市'] as List<dynamic>? ?? [];
        options.addAll(
          hotList
              .map((item) => CityOption.fromJson(item as Map<String, dynamic>))
              .toList(),
        );
      } else {
        for (final code in groupLabel.split('')) {
          final list = cityList[code] as List<dynamic>? ?? [];
          options.addAll(
            list
                .map((item) => CityOption.fromJson(item as Map<String, dynamic>))
                .toList(),
          );
        }
      }
      return CityGroup(label: groupLabel, cities: options);
    }).toList();
  }
}
