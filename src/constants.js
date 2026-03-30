// src/constants.js
// 2025 Indian Solar Market Data

export const CONSTANTS = {
  year: 2025,
  currency: '₹',
  panels: {
    DCR: 30,     // ₹ per Watt — Domestically manufactured panels (PM-KUSUM eligible)
    NonDCR: 22,  // ₹ per Watt — Standard panels
  },
  inverters: {
    GridTie: 8,  // ₹ per Watt — Grid-tie inverter
    Hybrid: 15,  // ₹ per Watt — Hybrid inverter with battery management
    OffGrid: 10, // ₹ per Watt — Off-grid / standalone inverter
  },
  batteries: {
    LiFePO4: {
      label: 'LiFePO4 (Lithium Iron Phosphate)',
      pricePerKWh: 15000, // ₹ per kWh
      cycles: 3000,
      calendarLife: 15, // years
      DoD: 0.90,        // Depth of Discharge
      efficiency: 0.97, // round-trip efficiency
      selfDischarge: 0.01, // %/month
    },
    LeadAcid: {
      label: 'Lead Acid (VRLA Sealed)',
      pricePerKWh: 7000,
      cycles: 1000,
      calendarLife: 5,
      DoD: 0.50,
      efficiency: 0.80,
      selfDischarge: 0.03,
    },
  },
  // MNRE subsidy brackets (PM Surya Ghar 2024)
  subsidy: {
    upTo1kW: 30000,   // flat ₹30,000
    upTo2kW: 60000,   // flat ₹60,000
    upTo3kW: 78000,   // flat ₹78,000
    above3kW: 78000,  // capped at ₹78,000 for residential
  },
  // Efficiency components breakdown
  efficiency: {
    mppt: 0.97,      // MPPT controller efficiency
    inverter: 0.95,  // String inverter efficiency
    wiring: 0.98,    // DC & AC wiring losses
    soiling: 0.97,   // Soiling & dust losses (India avg)
  },
};

/**
 * Calculate Peak Sun Hours (PSH) based on latitude.
 * Uses a simplified solar irradiance model calibrated for India.
 * @param {number} lat - Latitude in degrees
 * @returns {number} PSH in hours/day
 */
export function calculatePSH(lat) {
  const absLat = Math.abs(lat);
  // India ranges roughly 8°N to 37°N
  // Higher irradiance in the Rajasthan/Gujarat belt (~5.5-6.0)
  // Lower in Northeast/Kashmir (3.5-4.5)
  if (absLat <= 15) return 5.8;  // South India / coastal
  if (absLat <= 20) return 5.5;  // Deccan plateau
  if (absLat <= 25) return 5.5;  // Central India - highest solar belt approx
  if (absLat <= 30) return 5.0;  // North India plains
  if (absLat <= 35) return 4.5;  // Himalayan foothills
  return Math.max(3.0, 5.5 - (absLat / 90) * 2); // General fallback
}

/**
 * Calculate applicable MNRE subsidy for a given system size.
 * Note: Subsidy is only for residential grid-tied / hybrid, not off-grid.
 * @param {number} sizeKW
 * @param {string} systemType
 * @param {number} panelCost
 * @returns {number} Subsidy amount in ₹
 */
export function calculateSubsidy(sizeKW, systemType, panelCost) {
  // Off-grid systems are not eligible for PM Surya Ghar subsidy
  if (systemType === 'Off-Grid') return 0;

  if (sizeKW <= 1) return CONSTANTS.subsidy.upTo1kW;
  if (sizeKW <= 2) return CONSTANTS.subsidy.upTo2kW;
  if (sizeKW <= 3) return CONSTANTS.subsidy.upTo3kW;
  return CONSTANTS.subsidy.above3kW; // Capped for residential
}

/**
 * Format Indian currency with lakh/crore notation.
 * @param {number} amount
 * @param {boolean} compact
 * @returns {string}
 */
export function formatINR(amount, compact = true) {
  if (!compact) {
    return '₹' + amount.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  }
  const abs = Math.abs(amount);
  if (abs >= 10000000) return '₹' + (amount / 10000000).toFixed(2) + ' Cr';
  if (abs >= 100000) return '₹' + (amount / 100000).toFixed(2) + ' L';
  if (abs >= 1000) return '₹' + (amount / 1000).toFixed(1) + 'K';
  return '₹' + amount.toFixed(0);
}
