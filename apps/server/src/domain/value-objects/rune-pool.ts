import { Energy } from './energy';
import { Power } from './power';
import { Cost } from './cost';
import { Domain } from '../enums/domain';

export class RunePool {
  private constructor(
    public readonly energy: Energy,
    public readonly power: Map<Domain, number>,
  ) {}

  static empty(): RunePool {
    const power = new Map<Domain, number>();
    for (const d of Object.values(Domain)) {
      power.set(d, 0);
    }
    return new RunePool(Energy.zero(), power);
  }

  addEnergy(amount: Energy): RunePool {
    return new RunePool(this.energy.add(amount), new Map(this.power));
  }

  addPower(p: Power): RunePool {
    const newPower = new Map(this.power);
    if (p.domain) {
      newPower.set(p.domain, (newPower.get(p.domain) || 0) + 1);
    } else {
      newPower.set(Domain.COLORLESS, (newPower.get(Domain.COLORLESS) || 0) + 1);
    }
    return new RunePool(this.energy, newPower);
  }

  canPay(cost: Cost): boolean {
    if (this.energy.value < cost.energy.value) return false;
    const available = new Map(this.power);
    const anyPower = available.get(Domain.COLORLESS) || 0;
    let remainingAny = anyPower;
    for (const p of cost.powers) {
      if (p.domain === null) {
        remainingAny--;
        if (remainingAny < 0) return false;
      } else {
        const count = available.get(p.domain) || 0;
        if (count > 0) {
          available.set(p.domain, count - 1);
        } else if (remainingAny > 0) {
          remainingAny--;
        } else {
          return false;
        }
      }
    }
    return true;
  }

  spend(cost: Cost): RunePool {
    if (!this.canPay(cost)) throw new Error('Cannot pay cost');
    let newEnergy = this.energy.subtract(cost.energy);
    const newPower = new Map(this.power);
    let remainingAny = newPower.get(Domain.COLORLESS) || 0;
    for (const p of cost.powers) {
      if (p.domain === null) {
        remainingAny--;
      } else {
        const count = newPower.get(p.domain) || 0;
        if (count > 0) {
          newPower.set(p.domain, count - 1);
        } else {
          remainingAny--;
        }
      }
    }
    newPower.set(Domain.COLORLESS, Math.max(0, remainingAny));
    return new RunePool(newEnergy, newPower);
  }

  empty(): RunePool {
    return RunePool.empty();
  }
}