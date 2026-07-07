export type Language = 'en' | 'ca' | 'es';

export type SessionStatus = 'pending' | 'in-progress' | 'completed';

export type PositionKind = 'sitting' | 'lying-right' | 'rest' | 'lying-left' | 'long-rest';

export type DurationKind = 'transition' | 'positionDuration' | 'restBetweenPositions' | 'restBetweenCycles';

export interface TreatmentConfig {
  positionDuration: number;
  restBetweenPositions: number;
  restBetweenCycles: number;
  sessionsPerDay: number;
  totalDays: number;
}

export interface Settings {
  sound: boolean;
  vibration: boolean;
}

export interface PositionDef {
  kind: PositionKind;
  labelKey: string;
  durationKind: DurationKind;
  canAdvanceEarly: boolean;
}

export interface SessionSlot {
  id: string;
  labelKey: string;
}

export type SessionMap = Record<string, Record<string, SessionStatus>>;
