import 'help_offer.dart';

class MyRequest {
  const MyRequest({
    required this.id,
    required this.title,
    required this.status,
    required this.time,
    required this.cityName,
    required this.communityName,
    required this.offers,
  });

  final String id;
  final String title;
  final String status;
  final DateTime time;
  final String cityName;
  final String communityName;
  final List<HelpOffer> offers;

  factory MyRequest.fromJson(Map<String, dynamic> json) {
    final offersJson = json['offers'] as List<dynamic>? ?? [];
    return MyRequest(
      id: json['id']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      status: json['status']?.toString() ?? 'OPEN',
      time: DateTime.tryParse(json['time']?.toString() ?? '') ?? DateTime.now(),
      cityName: json['cityName']?.toString() ?? '',
      communityName: json['communityName']?.toString() ?? '',
      offers: offersJson
          .map((item) => HelpOffer.fromJson(item as Map<String, dynamic>))
          .toList(),
    );
  }
}
