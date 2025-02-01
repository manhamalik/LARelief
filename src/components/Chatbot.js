import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Static FAQ data based on your provided FAQ dropdowns
const staticFaqs = [
  {
    Question: "How can I volunteer or contribute?",
    Answer:
      "You can explore volunteer opportunities and donation needs by navigating through the interactive map or selecting the 'Volunteer Opportunities' or 'Donations Needed' buttons on the website. Additionally, you can click the 'Volunteer' or 'Donate' buttons in the navigation bar to visit dedicated pages and explore available opportunities or postings.",
  },
  {
    Question: "What types of donations are accepted?",
    Answer:
      "We accept various types of donations, such as food, hygiene supplies, medical items, and pet supplies. Specific donation needs can be found under the 'Donations Needed' tab on the map and on the Donations page.",
  },
  {
    Question: "How do I find resources or assistance near me?",
    Answer:
      "You can enter your address in the map's search bar to view nearby resources, shelters, and services. From there, you can explore by categories such as Essentials, Shelter & Support Services, Medical & Health, or Animal Support.",
  },
  {
    Question: "What should I do in case of a wildfire evacuation?",
    Answer:
      "Follow designated evacuation routes and instructions from authorities. Bring essential documents, medications, and emergency supplies. Secure your home by locking doors and turning off utilities if time permits. Check on neighbors and assist those in need. Stay informed through updates from local emergency services.",
  },
  {
    Question: "How do I contact you to add information or organizations to the website?",
    Answer:
      "If you would like to contribute information, suggest an organization, or report updates, please use the contact form on the 'Contact Us' page or email us directly.",
  },
  {
    Question: "How often is the map and resource list updated?",
    Answer:
      "The map and resource list are updated daily to reflect the latest information about resources, donations, and volunteer needs.",
  },
  {
    Question: "Can I collaborate with LARelief to list my organization’s opportunities?",
    Answer:
      "Absolutely! Use the Google Form on the Contact page to share your organization’s details, volunteer opportunities, or donation requests. Our team will review and add it to the platform.",
  },
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [chatHeight, setChatHeight] = useState(350);
  const [chatWidth, setChatWidth] = useState(320);
  const [isButtonOpen, setButtonOpen] = useState(true);

  // Initial chat message contains the welcome text and FAQ buttons.
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      buttons: true,
      text: (
        <p>
          Welcome! Click any FAQ for answers, or visit our Contact page and email us if you need more help!
        </p>
      ),
    },
  ]);

  const [typing, setTyping] = useState(false);
  const [dots, setDots] = useState("");

  // Use static FAQ data
  const [faqs] = useState(staticFaqs);

  const messagesEndRef = useRef(null);

  // Adjust chat window size on mount and window resize.
  useEffect(() => {
    function resizeWidth() {
      if (window.innerWidth <= 1024) {
        setChatWidth(320);
        setChatHeight(window.innerHeight * 0.8);
      } else {
        setChatWidth(400);
        setChatHeight(window.innerHeight * 0.8);
      }
    }
    resizeWidth();
    window.addEventListener("resize", resizeWidth);
    return () => {
      window.removeEventListener("resize", resizeWidth);
    };
  }, []);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Open the chatbot window
  const handleChatbotOpen = () => {
    setButtonOpen(false);
    if (!hasOpened) {
      setHasOpened(true);
    } else {
      setTimeout(() => {
        setHasOpened(false);
      }, 2500);
    }
    setIsOpen(true);
  };

  // When a FAQ button is clicked, display the question and answer
  const handleButtonClick = (faq) => {
    // Append the user's question
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: faq.Question,
      },
    ]);

    // Simulate the bot "typing" and then respond with the answer
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: faq.Answer,
        },
      ]);
    }, 700);
  };

  // Animate dots for the typing effect
  useEffect(() => {
    let interval;
    if (typing) {
      interval = setInterval(() => {
        setDots((prev) => (prev.length < 3 ? prev + "." : ""));
      }, 200);
    } else {
      setDots("");
    }
    return () => clearInterval(interval);
  }, [typing]);

  return (
    <div className="fixed bottom-2 right-0 z-[9999]">
      {/* Chatbot Icon */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: isButtonOpen ? 1 : 0 }}
            animate={{ scale: isButtonOpen ? 1 : [0, 1.2, 1] }}
            whileHover={{ scale: 1.2 }}
            exit={{
              scale: [1, 1.5, 0],
              transition: { scale: { duration: 0.2 }, ease: "easeInOut" },
            }}
            transition={{
              scale: { duration: 0.3, delay: isButtonOpen ? 0 : 1 },
              ease: "easeInOut",
            }}
            className="absolute bottom-0 right-2 w-20 h-20 cursor-pointer"
            onClick={handleChatbotOpen}
          >
            <Image
              src="/images/ChatbotIMG.png"
              alt="Chatbot"
              width={80}
              height={80}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window with Pop Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            // Pop-in animation using scale
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative px-4 flex flex-col border border-charcoalLight bg-charcoal text-white p-3 rounded-lg shadow-lg"
            style={{ width: chatWidth, height: chatHeight }}
          >
            {/* Header (click to close) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-between items-center mb-3 cursor-pointer"
              onClick={() => {
                setIsOpen(false);
                setTimeout(() => {
                  setButtonOpen(true);
                }, 1300);
              }}
            >
              <h2 className="font-bold text-md">FAQ Chat</h2>
              <span className="text-sm w-3 h-3 hover:text-ruby">
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </span>
            </motion.div>

            {/* Chat Messages */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="chat-messages bg-Charcoal pt-2 pr-3 pb-3 pl-1 rounded mb-3 overflow-y-auto border border-charcoalLight"
              style={{ flex: 1 }}
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-2 flex items-start ${
                    message.sender === "bot"
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  {message.sender === "bot" && (
                    <Image
                      src="/images/ChatbotIMG.png"
                      alt="Bot Avatar"
                      className="rounded-full"
                      width={56}
                      height={40}
                    />
                  )}
                  <div
                    className={`inline-block p-2 rounded max-w-xs text-sm ${
                      message.sender === "bot"
                        ? "bg-Charcoal text-white"
                        : "bg-charcoalLight text-white"
                    }`}
                  >
                    {message.text}
                    {message.buttons &&
                      faqs.length > 0 &&
                      faqs.map((faq, i) => (
                        <button
                          key={i}
                          className="bg-[#267738] my-1 py-2 px-3 text-left rounded hover:opacity-70 transition-opacity w-full"
                          onClick={() => handleButtonClick(faq)}
                        >
                          {faq.Question}
                        </button>
                      ))}
                  </div>
                </div>
              ))}

              {/* Typing animation */}
              {typing && (
                <div className="mb-2 flex items-start justify-start">
                  <Image
                    src="/images/ChatbotIMG.png"
                    alt="Bot Avatar"
                    className="w-13 h-10 rounded-full"
                    width={56}
                    height={40}
                  />
                  <div className="inline-block animate-pulse p-2 rounded max-w-xs text-sm bg-Charcoal text-white">
                    <span className="text-2xl">{dots}</span>
                  </div>
                </div>
              )}
              {/* Dummy element to force scroll to bottom */}
              <div ref={messagesEndRef} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
