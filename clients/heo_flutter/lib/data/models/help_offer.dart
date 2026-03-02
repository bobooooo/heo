class HelpOffer {
  const HelpOffer({
    required this.id,
    required this.name,
    required this.phone,
    required this.wechat,
    required this.status,
  });

  final String id;
  final String name;
  final String phone;
  final String wechat;
  final String status;

  factory HelpOffer.fromJson(Map<String, dynamic> json) {
    return HelpOffer(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      phone: json['phone']?.toString() ?? '',
      wechat: json['wechat']?.toString() ?? '',
      status: json['status']?.toString() ?? 'PENDING',
    );
  }
}
