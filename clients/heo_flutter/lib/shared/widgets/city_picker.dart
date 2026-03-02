import 'package:flutter/material.dart';

import '../../data/models/city.dart';
import '../../theme/app_theme.dart';

class CityPickerSheet extends StatefulWidget {
  const CityPickerSheet({
    super.key,
    required this.groups,
    required this.onSelect,
    this.allowAll = false,
  });

  final List<CityGroup> groups;
  final void Function(String name) onSelect;
  final bool allowAll;

  @override
  State<CityPickerSheet> createState() => _CityPickerSheetState();
}

class _CityPickerSheetState extends State<CityPickerSheet> {
  String query = '';

  @override
  Widget build(BuildContext context) {
    final filteredGroups = widget.groups.map((group) {
      final list = group.cities
          .where((city) => city.name.contains(query))
          .toList();
      return CityGroup(label: group.label, cities: list);
    }).where((group) => group.cities.isNotEmpty).toList();

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Container(
              height: 4,
              width: 48,
              decoration: BoxDecoration(
                color: AppColors.border,
                borderRadius: BorderRadius.circular(999),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              decoration: const InputDecoration(
                hintText: '搜索城市',
                prefixIcon: Icon(Icons.search),
              ),
              onChanged: (value) => setState(() => query = value.trim()),
            ),
            const SizedBox(height: 12),
            if (widget.allowAll)
              ListTile(
                title: const Text('全部城市'),
                onTap: () => widget.onSelect('全部'),
              ),
            Expanded(
              child: ListView.builder(
                itemCount: filteredGroups.length,
                itemBuilder: (context, index) {
                  final group = filteredGroups[index];
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          group.label,
                          style: const TextStyle(
                            fontSize: 12,
                            color: AppColors.textSecondary,
                            letterSpacing: 1.2,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Wrap(
                          spacing: 10,
                          runSpacing: 8,
                          children: group.cities.map((city) {
                            return GestureDetector(
                              onTap: () => widget.onSelect(city.name),
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 8,
                                ),
                                decoration: BoxDecoration(
                                  color: AppColors.surfaceWarm,
                                  borderRadius: BorderRadius.circular(14),
                                  border: Border.all(color: AppColors.border),
                                ),
                                child: Text(city.name),
                              ),
                            );
                          }).toList(),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
