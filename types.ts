
export interface IngredientRatio {
  pg: number;
  vg: number;
}

export interface BaseDefinition {
  id: string;
  name: string;
  ratio: IngredientRatio;
}

export interface UserSettings {
  targetVolume: number; // mL
  targetNicotine: number; // mg/mL
  targetAromaPct: number; // %
  targetRatio: IngredientRatio; // Desired final ratio
  
  boosterStrength: number; // mg/mL
  boosterRatio: IngredientRatio;
  
  bases: BaseDefinition[]; // List of available bases to mix
  aromaRatio: IngredientRatio; // Usually 100% PG
}

export interface CalculationResult {
  base1Volume: number;
  base2Volume: number;
  boosterVolume: number;
  aromaVolume: number;
  
  base1Weight: number;
  base2Weight: number;
  boosterWeight: number;
  aromaWeight: number;
  
  finalPg: number;
  finalVg: number;
  finalNicotine: number;
  
  possible: boolean;
  error?: string;
  warning?: string;
}

export interface SavedRecipe {
  id: string;
  name: string;
  date: string; // ISO string
  settings: UserSettings;
}

// Densities (approximate g/ml)
export const DENSITY_PG = 1.036;
export const DENSITY_VG = 1.261;
export const DENSITY_NIC = 1.01;
