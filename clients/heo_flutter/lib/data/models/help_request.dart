class HelpRequest {
  const HelpRequest({
    required this.id,
    required this.title,
    required this.detail,
    required this.category,
    required this.time,
    required this.status,
    required this.cityName,
    required this.communityName,
    required this.userId,
    required this.offersCount,
    required this.contactPhone,
    required this.contactWechat,
  });

  final String id;
  final String title;
  final String detail;
  final String category;
  final DateTime time;
  final String status;
  final String cityName;
  final String communityName;
  final String userId;
  final int offersCount;
  final String contactPhone;
  final String contactWechat;

  factory HelpRequest.fromJson(Map<String, dynamic> json) {
    final count = json['_count'] as Map<String, dynamic>?;
    final city = json['city'] as Map<String, dynamic>?;
    final community = json['community'] as Map<String, dynamic>?;
    return HelpRequest(
      id: json['id']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      detail: json['detail']?.toString() ?? '',
      category: json['category']?.toString() ?? '',
      time: DateTime.tryParse(json['time']?.toString() ?? '') ?? DateTime.now(),
      status: json['status']?.toString() ?? 'OPEN',
      cityName: city?['name']?.toString() ?? '',
      communityName: community?['name']?.toString() ?? '',
      userId: json['userId']?.toString() ?? '',
      offersCount: count?['offers'] as int? ?? 0,
      contactPhone: json['contactPhone']?.toString() ?? '',
      contactWechat: json['contactWechat']?.toString() ?? '',
    );
  }
}
