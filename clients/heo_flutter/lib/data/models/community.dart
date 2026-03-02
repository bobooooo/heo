class Community {
  const Community({required this.id, required this.name});

  final String id;
  final String name;

  factory Community.fromJson(Map<String, dynamic> json) {
    return Community(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
    );
  }
}
