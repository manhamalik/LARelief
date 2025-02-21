const API_URL = "https://languagedocker-1.onrender.com/translate"; // Change if needed

export const translateText = async (text, targetLang) => {
  if (!text.trim()) return text; // Ignore empty strings

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: "en", // Change based on the source language
        target: targetLang,
        format: "text",
      }),
    });

    const data = await response.json();
    return data.translatedText || text;
  } catch (error) {
    console.error("Translation failed:", error);
    return text; // Return original text on failure
  }
};
