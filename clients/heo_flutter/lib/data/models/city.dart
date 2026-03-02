class City {
  const City({required this.id, required this.name});

  final String id;
  final String name;

  factory City.fromJson(Map<String, dynamic> json) {
    return City(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
    );
  }
}

class CityGroup {
  const CityGroup({required this.label, required this.cities});

  final String label;
  final List<CityOption> cities;
}

class CityOption {
  const CityOption({required this.code, required this.name});

  final String code;
  final String name;

  factory CityOption.fromJson(Map<String, dynamic> json) {
    return CityOption(
      code: json['code']?.toString() ?? '',
      name: json['city']?.toString() ?? '',
    );
  }
}
