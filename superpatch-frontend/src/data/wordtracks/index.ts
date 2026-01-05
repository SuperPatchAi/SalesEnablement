// Word Track Data Index
// This file exports all word track data for use in the application

import { WordTrack, WordTrackCollection } from "@/types/wordtrack";

// D2C Word Tracks
import { freedomD2CWordTrack } from "./d2c/freedom";
import { remD2CWordTrack } from "./d2c/rem";
import { libertyD2CWordTrack } from "./d2c/liberty";

// B2B Practitioner Word Tracks
import { chiropractorB2BWordTrack } from "./b2b/chiropractor";

// D2C Word Tracks by product ID
export const d2cWordTracks: { [productId: string]: WordTrack } = {
  freedom: freedomD2CWordTrack,
  rem: remD2CWordTrack,
  liberty: libertyD2CWordTrack,
  // Add more D2C word tracks here as they are created
  // boost: boostD2CWordTrack,
  // victory: victoryD2CWordTrack,
  // focus: focusD2CWordTrack,
  // defend: defendD2CWordTrack,
  // ignite: igniteD2CWordTrack,
  // "kick-it": kickItD2CWordTrack,
  // peace: peaceD2CWordTrack,
  // joy: joyD2CWordTrack,
  // lumi: lumiD2CWordTrack,
  // rocket: rocketD2CWordTrack,
};

// B2B Word Tracks by practitioner type
export const b2bWordTracks: { [practitionerType: string]: WordTrack } = {
  chiropractor: chiropractorB2BWordTrack,
  // Add more B2B practitioner word tracks here as they are created
  // naturopath: naturopathWordTrack,
  // acupuncturist: acupuncturistWordTrack,
  // massage_therapist: massageTherapistWordTrack,
  // functional_medicine: functionalMedicineWordTrack,
  // integrative_medicine: integrativeMedicineWordTrack,
};

// Canadian market word track
export const canadianWordTrack: WordTrack | null = null;
// Will be populated when canadian word track is created

// Complete collection
export const wordTrackCollection: WordTrackCollection = {
  d2c: d2cWordTracks,
  b2b: b2bWordTracks,
  canadian: canadianWordTrack,
};

// Helper functions
export function getWordTrackByProductAndMarket(
  productId: string,
  market: "d2c" | "b2b" | "canadian"
): WordTrack | null {
  if (market === "d2c") {
    return d2cWordTracks[productId] || null;
  }
  if (market === "b2b") {
    // For B2B, the structure is by practitioner type, not product
    // This function returns null for B2B - use getPractitionerWordTrack instead
    return null;
  }
  if (market === "canadian") {
    return canadianWordTrack;
  }
  return null;
}

export function getPractitionerWordTrack(
  practitionerType: string
): WordTrack | null {
  return b2bWordTracks[practitionerType] || null;
}

export function getAvailableD2CProducts(): string[] {
  return Object.keys(d2cWordTracks);
}

export function getAvailablePractitioners(): string[] {
  return Object.keys(b2bWordTracks);
}

export function hasWordTrack(
  productId: string,
  market: "d2c" | "b2b" | "canadian"
): boolean {
  if (market === "d2c") {
    return productId in d2cWordTracks;
  }
  if (market === "b2b") {
    return productId in b2bWordTracks;
  }
  if (market === "canadian") {
    return canadianWordTrack !== null;
  }
  return false;
}

// Get all loaded word track counts
export function getWordTrackStats(): {
  d2cCount: number;
  b2bCount: number;
  hasCanadian: boolean;
  totalProducts: number;
} {
  return {
    d2cCount: Object.keys(d2cWordTracks).length,
    b2bCount: Object.keys(b2bWordTracks).length,
    hasCanadian: canadianWordTrack !== null,
    totalProducts: 13, // Total SuperPatch products
  };
}
