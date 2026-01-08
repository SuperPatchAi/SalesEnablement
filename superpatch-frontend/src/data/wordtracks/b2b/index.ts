import { WordTrack } from "@/types/wordtrack";
import { chiropractorsWordTrack } from "./chiropractors";
import { naturopathsWordTrack } from "./naturopaths";
import { acupuncturistsWordTrack } from "./acupuncturists";
import { massageTherapistsWordTrack } from "./massage-therapists";
import { functionalMedicineWordTrack } from "./functional-medicine";
import { integrativeMedicineWordTrack } from "./integrative-medicine";

// Export individual word tracks
export {
  chiropractorsWordTrack,
  naturopathsWordTrack,
  acupuncturistsWordTrack,
  massageTherapistsWordTrack,
  functionalMedicineWordTrack,
  integrativeMedicineWordTrack,
};

// Combined B2B word tracks by practitioner type
export const b2bWordTracks: Record<string, WordTrack> = {
  chiropractors: chiropractorsWordTrack,
  naturopaths: naturopathsWordTrack,
  acupuncturists: acupuncturistsWordTrack,
  "massage-therapists": massageTherapistsWordTrack,
  "functional-medicine": functionalMedicineWordTrack,
  "integrative-medicine": integrativeMedicineWordTrack,
};

// Helper to get all B2B practitioner types
export const b2bPractitionerTypes = [
  { id: "chiropractors", name: "Chiropractors", shortName: "DC" },
  { id: "naturopaths", name: "Naturopathic Doctors", shortName: "ND" },
  { id: "acupuncturists", name: "Acupuncturists", shortName: "L.Ac" },
  { id: "massage-therapists", name: "Massage Therapists", shortName: "LMT" },
  { id: "functional-medicine", name: "Functional Medicine", shortName: "FM" },
  { id: "integrative-medicine", name: "Integrative Medicine", shortName: "IM" },
] as const;

// Get word track by practitioner type
export function getB2BWordTrackByPractitioner(practitionerType: string): WordTrack | null {
  return b2bWordTracks[practitionerType] || null;
}





