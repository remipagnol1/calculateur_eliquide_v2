
import { UserSettings, CalculationResult, DENSITY_PG, DENSITY_VG } from '../types';

export const calculateRecipe = (settings: UserSettings): CalculationResult => {
  const {
    targetVolume,
    targetNicotine,
    targetAromaPct,
    targetRatio,
    boosterStrength,
    boosterRatio,
    bases,
    aromaRatio
  } = settings;

  // 1. Calculate Fixed Volumes (Aroma & Booster)
  const aromaVolume = targetVolume * (targetAromaPct / 100);
  
  let boosterVolume = 0;
  if (boosterStrength > 0 && targetNicotine > 0) {
    boosterVolume = (targetVolume * targetNicotine) / boosterStrength;
  }

  // 2. Calculate Remaining Volume for Bases
  const volumeForBases = targetVolume - aromaVolume - boosterVolume;

  // Helper for density
  const getDensity = (pg: number, vg: number) => (pg / 100 * DENSITY_PG) + (vg / 100 * DENSITY_VG);
  
  // Basic impossibility check (Volume Overflow)
  if (volumeForBases < -0.01) {
    return {
      base1Volume: 0,
      base2Volume: 0,
      boosterVolume,
      aromaVolume,
      base1Weight: 0,
      base2Weight: 0,
      boosterWeight: 0,
      aromaWeight: 0,
      finalPg: 0,
      finalVg: 0,
      finalNicotine: 0,
      possible: false,
      error: "Le volume des ingrédients (nicotine + arôme) dépasse le volume total désiré."
    };
  }

  // 3. Calculate PG/VG contributed by fixed ingredients
  const aromaPg = aromaVolume * (aromaRatio.pg / 100);
  
  const boosterPg = boosterVolume * (boosterRatio.pg / 100);

  const fixedPg = aromaPg + boosterPg;
  
  // 4. Calculate Required PG to hit Target Ratio
  const totalPgNeeded = targetVolume * (targetRatio.pg / 100);
  const pgNeededFromBases = totalPgNeeded - fixedPg;

  // 5. Solve for Bases
  let base1Vol = 0;
  let base2Vol = 0;
  const base1 = bases[0];
  const base2 = bases.length > 1 ? bases[1] : null;

  // Logic: 
  // Eq 1: V1 + V2 = volumeForBases
  // Eq 2: V1*P1 + V2*P2 = pgNeededFromBases
  
  if (!base2) {
    // Single Base Mode: Just fill the rest, ratio will result in whatever it is
    base1Vol = volumeForBases;
  } else {
    // Dual Base Mode: Solve the system
    const p1 = base1.ratio.pg / 100;
    const p2 = base2.ratio.pg / 100;
    
    // Avoid division by zero if both bases are identical
    if (Math.abs(p1 - p2) < 0.001) {
      base1Vol = volumeForBases; // Just use base 1
      base2Vol = 0;
    } else {
      // V1 = (pgNeeded - volumeForBases*P2) / (P1 - P2)
      base1Vol = (pgNeededFromBases - (volumeForBases * p2)) / (p1 - p2);
      base2Vol = volumeForBases - base1Vol;
    }
  }

  // 6. Validate Solver Results & Clamp (Best Effort)
  let possible = true;
  let error = undefined;
  let warning = undefined;

  // Rounding errors tolerance check
  // If volumes are negative, it means the ratio is unreachable with these bases
  if (base1Vol < -0.01 || base2Vol < -0.01) {
    warning = "Le ratio cible exact est impossible avec ces bases. Voici le dosage le plus proche possible.";
    
    // Clamp to boundaries (Use 100% of the base that gets us closest)
    if (base1Vol < 0) { 
      base1Vol = 0; 
      base2Vol = volumeForBases; 
    } else { 
      // This implies base2Vol < 0
      base2Vol = 0; 
      base1Vol = volumeForBases; 
    }
  }

  // 7. Calculate Final Stats
  const base1Density = getDensity(base1.ratio.pg, base1.ratio.vg);
  const base2Density = base2 ? getDensity(base2.ratio.pg, base2.ratio.vg) : 0;
  const aromaDensity = getDensity(aromaRatio.pg, aromaRatio.vg);
  const boosterDensity = getDensity(boosterRatio.pg, boosterRatio.vg);

  const finalTotalPg = fixedPg + (base1Vol * (base1.ratio.pg / 100)) + (base2Vol * (base2 ? base2.ratio.pg / 100 : 0));
  const finalTotalVg = targetVolume - finalTotalPg;

  return {
    base1Volume: base1Vol,
    base2Volume: base2Vol,
    boosterVolume,
    aromaVolume,
    
    base1Weight: base1Vol * base1Density,
    base2Weight: base2Vol * base2Density,
    boosterWeight: boosterVolume * boosterDensity,
    aromaWeight: aromaVolume * aromaDensity,
    
    finalPg: (finalTotalPg / targetVolume) * 100,
    finalVg: (finalTotalVg / targetVolume) * 100,
    finalNicotine: targetNicotine,
    possible,
    error,
    warning
  };
};
