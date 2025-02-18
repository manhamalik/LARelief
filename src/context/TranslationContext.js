import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { translateText } from "@/util/translate";

const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");
  const router = useRouter();

  // Function to translate all text nodes in the DOM
  const translateAllTextNodes = async (targetLang) => {
    setLanguage(targetLang);

    const textNodes = document.body.querySelectorAll(
      "*:not(script):not(style)"
    );

    for (const node of textNodes) {
      if (node.hasAttribute("data-no-translate")) {
        continue;
      }
      if (
        node.childNodes.length === 1 &&
        node.childNodes[0].nodeType === Node.TEXT_NODE
      ) {
        const originalText = node.textContent.trim();
        if (!originalText) continue;

        const translatedText = await translateText(originalText, targetLang);
        node.textContent = translatedText;
      }
    }
  };

  useEffect(() => {
    if (language !== "en") {
      translateAllTextNodes(language);
    }
  }, [language, router.pathname]); // Runs whenever language or page changes

  return (
    <TranslationContext.Provider value={{ language, translateAllTextNodes }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => useContext(TranslationContext);

export default TranslationContext;
