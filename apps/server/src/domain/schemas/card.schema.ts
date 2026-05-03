import { z } from 'zod';
import { CardType, Domain, Rarity, Keyword } from '../enums';

export const cardSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.nativeEnum(CardType),
  domain: z.array(z.nativeEnum(Domain)),
  rarity: z.nativeEnum(Rarity),
  rulesText: z.string(),
  flavourText: z.string().optional(),
  keywords: z.array(z.nativeEnum(Keyword)),
  tags: z.array(z.string()),
  energyCost: z.number().int().min(0).optional(),
  powerCost: z.number().int().min(0).optional(),
  might: z.number().int().min(0).optional(),
  isChampion: z.boolean().optional(),
  isSignature: z.boolean().optional(),
  mightBonus: z.number().int().optional(),
  orientation: z.enum(['portrait', 'landscape']).optional(),
  championTag: z.string().optional(),
});