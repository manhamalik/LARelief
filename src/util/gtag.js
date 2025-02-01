import { GA4React } from "react-ga4";

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID; // Store ID in .env.local

export const initGA = async () => {
  try {
    if (GA_TRACKING_ID) {
      const ga4 = new GA4React(GA_TRACKING_ID);
      await ga4.initialize();
    }
  } catch (error) {
    console.error("Google Analytics initialization error:", error);
  }
};