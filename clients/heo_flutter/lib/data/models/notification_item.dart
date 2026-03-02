class NotificationItem {
  const NotificationItem({
    required this.id,
    required this.type,
    required this.payload,
    required this.createdAt,
    required this.readAt,
  });

  final String id;
  final String type;
  final Map<String, dynamic> payload;
  final DateTime createdAt;
  final DateTime? readAt;

  factory NotificationItem.fromJson(Map<String, dynamic> json) {
    return NotificationItem(
      id: json['id']?.toString() ?? '',
      type: json['type']?.toString() ?? '',
      payload: Map<String, dynamic>.from(json['payload'] as Map? ?? {}),
      createdAt:
          DateTime.tryParse(json['createdAt']?.toString() ?? '') ?? DateTime.now(),
      readAt: json['readAt'] != null
          ? DateTime.tryParse(json['readAt']?.toString() ?? '')
          : null,
    );
  }
}
