export interface MightModifier {
  source: string;
  type: 'base_override' | 'increase' | 'decrease';
  value: number;
  snapshotMin?: number;
  duration: 'permanent' | 'this_turn' | 'this_combat';
}