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
};
