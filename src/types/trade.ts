export type BaseTradeCode = 'hvac' | 'plumbing' | 'electrical' | 'pipefitting' | 'controls';

export type SpecialtyCode = 'data-center' | 'central-plant' | 'healthcare' | 'high-rise' | 'industrial';

export type TradeCode = BaseTradeCode | SpecialtyCode;

export interface TradeConfig {
  name: string;
  icon: string;
  color: string;
  union: string;
  isSpecialty?: boolean;
  description?: string;
}

export type TradeMap = Record<TradeCode, TradeConfig>;
