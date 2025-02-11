import NavBar from "@/components/NavBar";
import "@/styles/globals.css";
import { Saira, Noto_Sans_Multani } from "next/font/google"; // Import Noto Sans Multani
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { log } from "@/util/logger";
import "web-streams-polyfill";
import { config, library } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import {
  faSquareXTwitter,
  faFacebookSquare,
  faLinkedin,
  faInstagramSquare,
  faLinkedinIn,
  faXTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faEnvelopeCircleCheck } from "@fortawesome/free-solid-svg-icons";
import "leaflet/dist/leaflet.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// Prevent Font Awesome from automatically adding CSS globally
config.autoAddCss = false;

// Add icons to the library
library.add(
  faSquareXTwitter,
  faFacebookSquare,
  faLinkedin,
  faInstagramSquare,
  faLinkedinIn,
  faXTwitter,
  faInstagram,
  faEnvelope,
  faEnvelopeCircleCheck
);

const notoSansMultani = Noto_Sans_Multani({
  subsets: ["latin"],
  weight: ["400"],
});

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [footerLinks, setFooterLinks] = useState([]);

  useEffect(() => {
    // Check sessionStorage for cached footer links
    const cachedFooterLinks = sessionStorage.getItem("footerLinks");

    if (cachedFooterLinks) {
      setFooterLinks(JSON.parse(cachedFooterLinks));
    } else {
      // If no cache, fetch footer links
      async function getData() {
        try {
          const footerRes = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/footer`
          );
          const footerResObj = await footerRes.json();

          if (footerRes.ok) {
            const links = [
              footerResObj.data.InstagramLink,
              footerResObj.data.LinkedinLink,
              footerResObj.data.FacebookLink,
            ];
            // Store in sessionStorage and update state
            sessionStorage.setItem("footerLinks", JSON.stringify(links));
            setFooterLinks(links);
          } else {
            setFooterLinks([]);
          }
        } catch {
          setFooterLinks([]);
        }
      }
      getData();
    }
  }, [router.isReady]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${notoSansMultani.style.fontFamily}, sans-serif;
        }
      `}</style>
      <main>
        {/* Always render NavBar */}
        <NavBar />
        {isMounted && (
          <Toaster
            position="bottom-left"
            toastOptions={{
              duration: 5000,
              loading: {
                duration: Infinity,
                theme: {
                  primary: "green",
                  secondary: "black",
                },
              },
            }}
          />
        )}
        <Component {...pageProps} />
        <Chatbot />
        <Footer footerLinks={footerLinks} />
      </main>
    </>
  );
}
