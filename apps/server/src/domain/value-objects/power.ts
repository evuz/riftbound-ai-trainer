import { Domain } from '../enums/domain';

export class Power {
  private constructor(public readonly domain: Domain | null) {}

  static fury(): Power { return new Power(Domain.FURY); }
  static calm(): Power { return new Power(Domain.CALM); }
  static mind(): Power { return new Power(Domain.MIND); }
  static body(): Power { return new Power(Domain.BODY); }
  static chaos(): Power { return new Power(Domain.CHAOS); }
  static order(): Power { return new Power(Domain.ORDER); }
  static any(): Power { return new Power(null); }

  equals(other: Power): boolean {
    if (this.domain === null || other.domain === null) return true;
    return this.domain === other.domain;
  }
}