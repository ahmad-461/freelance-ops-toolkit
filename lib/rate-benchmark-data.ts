export type SkillCategory =
  | "Web Development"
  | "Mobile App Development"
  | "UI/UX Design"
  | "Graphic Design"
  | "Content Writing"
  | "Copywriting"
  | "Video Editing"
  | "Digital Marketing"
  | "SEO Specialist"
  | "Translation"
  | "Virtual Assistant"
  | "Cybersecurity Consultant";

export type ExperienceLevel = "beginner" | "intermediate" | "expert";

export type Region =
  | "North America"
  | "Europe"
  | "South Asia"
  | "Southeast Asia"
  | "Middle East"
  | "Latin America"
  | "Africa"
  | "Oceania";

export interface RateRange {
  min: number;
  max: number;
}

// Experience Level Labels for UI
export const EXPERIENCE_LEVEL_LABELS: Record<ExperienceLevel, string> = {
  beginner: "Beginner (0-2 years)",
  intermediate: "Intermediate (2-5 years)",
  expert: "Expert (5+ years)",
};

// Base Rate Ranges (using North America as base, 1.0 multiplier)
const BASE_RATES: Record<SkillCategory, Record<ExperienceLevel, RateRange>> = {
  "Web Development": {
    beginner: { min: 35, max: 60 },
    intermediate: { min: 65, max: 110 },
    expert: { min: 120, max: 200 },
  },
  "Mobile App Development": {
    beginner: { min: 40, max: 70 },
    intermediate: { min: 75, max: 130 },
    expert: { min: 140, max: 250 },
  },
  "UI/UX Design": {
    beginner: { min: 35, max: 55 },
    intermediate: { min: 60, max: 100 },
    expert: { min: 110, max: 180 },
  },
  "Graphic Design": {
    beginner: { min: 25, max: 45 },
    intermediate: { min: 50, max: 80 },
    expert: { min: 85, max: 140 },
  },
  "Content Writing": {
    beginner: { min: 20, max: 40 },
    intermediate: { min: 45, max: 75 },
    expert: { min: 80, max: 130 },
  },
  "Copywriting": {
    beginner: { min: 30, max: 50 },
    intermediate: { min: 55, max: 95 },
    expert: { min: 100, max: 180 },
  },
  "Video Editing": {
    beginner: { min: 25, max: 45 },
    intermediate: { min: 50, max: 85 },
    expert: { min: 90, max: 150 },
  },
  "Digital Marketing": {
    beginner: { min: 25, max: 45 },
    intermediate: { min: 50, max: 90 },
    expert: { min: 95, max: 160 },
  },
  "SEO Specialist": {
    beginner: { min: 25, max: 45 },
    intermediate: { min: 50, max: 85 },
    expert: { min: 90, max: 150 },
  },
  "Translation": {
    beginner: { min: 20, max: 35 },
    intermediate: { min: 40, max: 70 },
    expert: { min: 75, max: 120 },
  },
  "Virtual Assistant": {
    beginner: { min: 15, max: 25 },
    intermediate: { min: 30, max: 50 },
    expert: { min: 55, max: 90 },
  },
  "Cybersecurity Consultant": {
    beginner: { min: 45, max: 80 },
    intermediate: { min: 85, max: 150 },
    expert: { min: 160, max: 300 },
  },
};

// Regional Multipliers
const REGIONAL_MULTIPLIERS: Record<Region, number> = {
  "North America": 1.0,
  "Europe": 0.85,
  "Oceania": 0.9,
  "Middle East": 0.7,
  "Latin America": 0.5,
  "Southeast Asia": 0.45,
  "South Asia": 0.4,
  "Africa": 0.4,
};

// Helper to round rate to nearest logical step (e.g. nearest $1, and minimum $10)
function roundRate(rate: number): number {
  const rounded = Math.round(rate);
  return Math.max(10, rounded);
}

/**
 * Gets the benchmark rate range for a given skill, experience, and region combination.
 */
export function getRateRange(
  skill: SkillCategory,
  experience: ExperienceLevel,
  region: Region
): RateRange {
  const base = BASE_RATES[skill]?.[experience];
  if (!base) {
    return { min: 15, max: 30 }; // Safe fallback
  }

  const multiplier = REGIONAL_MULTIPLIERS[region] ?? 1.0;
  return {
    min: roundRate(base.min * multiplier),
    max: roundRate(base.max * multiplier),
  };
}

/**
 * Returns the absolute min and absolute max rates across all regions and experiences
 * for a specific skill category to anchor the absolute horizontal range indicator bar.
 */
export function getAbsoluteRangeForSkill(skill: SkillCategory): RateRange {
  let absoluteMin = Infinity;
  let absoluteMax = -Infinity;

  const experiences: ExperienceLevel[] = ["beginner", "intermediate", "expert"];
  const regions: Region[] = [
    "North America",
    "Europe",
    "Oceania",
    "Middle East",
    "Latin America",
    "Southeast Asia",
    "South Asia",
    "Africa",
  ];

  for (const exp of experiences) {
    for (const reg of regions) {
      const range = getRateRange(skill, exp, reg);
      if (range.min < absoluteMin) absoluteMin = range.min;
      if (range.max > absoluteMax) absoluteMax = range.max;
    }
  }

  return {
    min: absoluteMin === Infinity ? 10 : absoluteMin,
    max: absoluteMax === -Infinity ? 100 : absoluteMax,
  };
}

// Lists of options for forms
export const SKILL_CATEGORIES: SkillCategory[] = [
  "Web Development",
  "Mobile App Development",
  "UI/UX Design",
  "Graphic Design",
  "Content Writing",
  "Copywriting",
  "Video Editing",
  "Digital Marketing",
  "SEO Specialist",
  "Translation",
  "Virtual Assistant",
  "Cybersecurity Consultant",
];

export const EXPERIENCE_LEVELS: ExperienceLevel[] = ["beginner", "intermediate", "expert"];

export const REGIONS: Region[] = [
  "North America",
  "Europe",
  "Oceania",
  "Middle East",
  "Latin America",
  "Southeast Asia",
  "South Asia",
  "Africa",
];
