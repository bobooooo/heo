class Profile {
  const Profile({
    required this.id,
    required this.userId,
    this.name,
    this.phone,
    this.wechat,
  });

  final String id;
  final String userId;
  final String? name;
  final String? phone;
  final String? wechat;

  factory Profile.fromJson(Map<String, dynamic> json) {
    return Profile(
      id: json['id']?.toString() ?? '',
      userId: json['userId']?.toString() ?? '',
      name: json['name'] as String?,
      phone: json['phone'] as String?,
      wechat: json['wechat'] as String?,
    );
  }
}
