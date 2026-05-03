import { Card } from './card';
import { Damage } from '../value-objects/damage';
import { Might } from '../value-objects/might';
import { CombatDesignation } from '../enums/combat-designation';
import { MightModifier } from '../../shared/types';

export class UnitOnBoard {
  public readonly instanceId: string;
  private card: Card;
  private damage: Damage;
  private exhausted: boolean;
  private buffed: boolean;
  private modifiers: MightModifier[];
  private attachedGear: Card[];
  private designation: CombatDesignation | null;

  constructor(card: Card, instanceId?: string) {
    this.card = card;
    this.instanceId = instanceId || `${card.id}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    this.damage = Damage.zero();
    this.exhausted = true;
    this.buffed = false;
    this.modifiers = [];
    this.attachedGear = [];
    this.designation = null;
  }

  getCard(): Card { return this.card; }
  isExhausted(): boolean { return this.exhausted; }
  hasBuff(): boolean { return this.buffed; }
  getAttachedGear(): Card[] { return [...this.attachedGear]; }
  getDesignation(): CombatDesignation | null { return this.designation; }

  exhaust(): void { this.exhausted = true; }
  ready(): void { this.exhausted = false; }

  takeDamage(amount: number): void {
    this.damage = this.damage.add(amount);
  }

  heal(amount: number): void {
    this.damage = this.damage.heal(amount);
  }

  buff(): void {
    if (!this.buffed) {
      this.buffed = true;
      this.modifiers.push({
        source: 'buff',
        type: 'increase' as const,
        value: 1,
        duration: 'permanent' as const,
      });
    }
  }

  spendBuff(): void {
    if (!this.buffed) throw new Error('Unit does not have a buff to spend');
    this.buffed = false;
    this.modifiers = this.modifiers.filter(m => m.source !== 'buff');
  }

  currentMight(): number {
    let might = this.card.might?.value ?? 0;
    for (const mod of this.modifiers) {
      switch (mod.type) {
        case 'base_override':
          might = mod.value;
          break;
        case 'increase':
          might += mod.value;
          break;
        case 'decrease':
          might -= mod.value;
          break;
      }
    }
    for (const gear of this.attachedGear) {
      if (gear.mightBonus) might += gear.mightBonus;
    }
    return Math.max(0, might);
  }

  isAlive(): boolean {
    return !this.damage.isLethal(Might.of(this.currentMight()));
  }

  attachGear(gear: Card): void {
    this.attachedGear.push(gear);
  }

  detachGear(gearId: string): void {
    this.attachedGear = this.attachedGear.filter(g => g.id !== gearId);
  }

  setDesignation(d: CombatDesignation): void {
    this.designation = d;
  }

  clearDesignation(): void {
    this.designation = null;
  }
}