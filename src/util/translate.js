import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://uacgvrrhrcwizvjvlmfy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhY2d2cnJocmN3aXp2anZsbWZ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTY4MjIwNCwiZXhwIjoyMDYxMjU4MjA0fQ.31tNkSHQxDX37F-CbPGYMl5u42qcXUVvpQTDTxC-Wh0"
);

const LANG_COLUMN_MAP = {
  es: "to_es",
  zh: "to_zh",
  ko: "to_ko",
};

const API_URL = "https://languagedocker-1.onrender.com/translate";

export const translateText = async (text, targetLang) => {
  if (!text.trim()) return text;

  const langCol = LANG_COLUMN_MAP[targetLang];
  if (!langCol) throw new Error("Unsupported target language");

  // 1. Check cache (Supabase)
  const { data: cached, error } = await supabase
    .from("translations")
    .select(`text, ${langCol}`)
    .eq("text", text.trim())
    .maybeSingle();

  if (cached && cached[langCol]) {
    console.log("✅ Supabase cache hit");
    return cached[langCol];
  }

  // 2. Translate from LibreTranslate
  let translatedText = text;
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: "en",
        target: targetLang,
        format: "text",
      }),
    });

    const json = await res.json();
    translatedText = json.translatedText || text;
  } catch (e) {
    console.error("Translation failed:", e);
    return text;
  }

  // 3. Insert or update in Supabase
  if (cached) {
    await supabase
      .from("translations")
      .update({ [langCol]: translatedText })
      .eq("text", text.trim());
  } else {
    await supabase.from("translations").insert({
      text: text.trim(),
      [langCol]: translatedText,
    });
  }

  return translatedText;
};
