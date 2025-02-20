// translationContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { translateText } from "@/util/translate";

const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");
  const router = useRouter();

  // Recursive function to translate text nodes in the DOM
  const translateNode = async (node, targetLang) => {
    // If it's a text node, translate its content
    if (node.nodeType === Node.TEXT_NODE) {
      const originalText = node.textContent.trim();
      if (!originalText) return;
      try {
        const translatedText = await translateText(originalText, targetLang);
        node.textContent = translatedText;
      } catch (error) {
        console.error("Translation error:", error);
      }
    }
    // If it's an element node and doesn't have the no-translate attribute, recurse its children
    else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.hasAttribute("data-no-translate")) return;
      for (let i = 0; i < node.childNodes.length; i++) {
        await translateNode(node.childNodes[i], targetLang);
      }
    }
  };

  // Function to translate all text nodes starting from the document body
  const translateAllTextNodes = async (targetLang) => {
    setLanguage(targetLang);
    await translateNode(document.body, targetLang);
  };

  // Load stored language and translate on mount if needed
  useEffect(() => {
    const targetLang = localStorage.getItem("language") || "en";
    setLanguage(targetLang);
    if (targetLang !== "en") {
      translateAllTextNodes(targetLang);
    }
  }, []);

  // Re-run translation when language changes or when the route changes
  useEffect(() => {
    if (language !== "en") {
      translateAllTextNodes(language);
    }
  }, [language, router.pathname]);

  return (
    <TranslationContext.Provider
      value={{ language, setLanguage, translateAllTextNodes }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => useContext(TranslationContext);

export default TranslationContext;
