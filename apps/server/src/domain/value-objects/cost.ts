import { Energy } from './energy';
import { Power } from './power';

export class Cost {
  private constructor(
    public readonly energy: Energy,
    public readonly powers: Power[],
  ) {}

  static of(energy: number, powers: Power[]): Cost {
    return new Cost(Energy.of(energy), powers);
  }

  static zero(): Cost {
    return new Cost(Energy.zero(), []);
  }
}