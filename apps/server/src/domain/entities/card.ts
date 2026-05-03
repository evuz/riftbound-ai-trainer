import { CardType } from '../enums/card-type';
import { Domain } from '../enums/domain';
import { Rarity } from '../enums/rarity';
import { Keyword } from '../enums/keyword';
import { Might } from '../value-objects/might';
import { Energy } from '../value-objects/energy';

export interface CardProps {
  id: string;
  name: string;
  type: CardType;
  domain: Domain[];
  rarity: Rarity;
  rulesText: string;
  flavourText?: string;
  keywords: Keyword[];
  tags: string[];
  energyCost?: number;
  powerCost?: number;
  might?: number;
  isChampion?: boolean;
  isSignature?: boolean;
  mightBonus?: number;
  orientation?: 'portrait' | 'landscape';
  championTag?: string;
}

export class Card {
  public readonly id: string;
  public readonly name: string;
  public readonly type: CardType;
  public readonly domain: Domain[];
  public readonly rarity: Rarity;
  public readonly rulesText: string;
  public readonly flavourText?: string;
  public readonly keywords: Keyword[];
  public readonly tags: string[];
  public readonly energyCost: Energy;
  public readonly powerCost: number;
  public readonly might?: Might;
  public readonly isChampion: boolean;
  public readonly isSignature: boolean;
  public readonly mightBonus?: number;
  public readonly orientation?: 'portrait' | 'landscape';
  public readonly championTag?: string;

  constructor(props: CardProps) {
    this.id = props.id;
    this.name = props.name;
    this.type = props.type;
    this.domain = props.domain;
    this.rarity = props.rarity;
    this.rulesText = props.rulesText;
    this.flavourText = props.flavourText;
    this.keywords = props.keywords;
    this.tags = props.tags;
    this.energyCost = Energy.of(props.energyCost ?? 0);
    this.powerCost = props.powerCost ?? 0;
    this.might = props.might != null ? Might.of(props.might) : undefined;
    this.isChampion = props.isChampion ?? false;
    this.isSignature = props.isSignature ?? false;
    this.mightBonus = props.mightBonus;
    this.orientation = props.orientation;
    this.championTag = props.championTag;
  }

  getEnergyCost(): number {
    return this.energyCost.value;
  }

  getPowerCost(): number {
    return this.powerCost;
  }
}