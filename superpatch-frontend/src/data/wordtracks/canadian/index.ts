import { WordTrack } from "@/types/wordtrack";
import { canadianBusinessWellnessWordTrack } from "./canadian-business-wellness";

// Export individual word tracks
export { canadianBusinessWellnessWordTrack };

// Canadian word track (currently single market program)
export const canadianWordTrack: WordTrack = canadianBusinessWellnessWordTrack;

// Helper to get Canadian word track
export function getCanadianWordTrack(): WordTrack {
  return canadianWordTrack;
}





