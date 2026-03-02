class MyOffer {
  const MyOffer({
    required this.id,
    required this.status,
    required this.name,
    required this.phone,
    required this.wechat,
    required this.requestId,
    required this.requestTitle,
    required this.requestCategory,
    required this.requestTime,
    required this.cityName,
    required this.communityName,
  });

  final String id;
  final String status;
  final String name;
  final String phone;
  final String wechat;
  final String requestId;
  final String requestTitle;
  final String requestCategory;
  final DateTime requestTime;
  final String cityName;
  final String communityName;

  factory MyOffer.fromJson(Map<String, dynamic> json) {
    final request = json['request'] as Map<String, dynamic>? ?? {};
    return MyOffer(
      id: json['id']?.toString() ?? '',
      status: json['status']?.toString() ?? 'PENDING',
      name: json['name']?.toString() ?? '',
      phone: json['phone']?.toString() ?? '',
      wechat: json['wechat']?.toString() ?? '',
      requestId: request['id']?.toString() ?? '',
      requestTitle: request['title']?.toString() ?? '',
      requestCategory: request['category']?.toString() ?? '',
      requestTime:
          DateTime.tryParse(request['time']?.toString() ?? '') ?? DateTime.now(),
      cityName: request['cityName']?.toString() ?? '',
      communityName: request['communityName']?.toString() ?? '',
    );
  }
}
