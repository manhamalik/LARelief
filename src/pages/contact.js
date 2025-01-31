import React, { useRef, useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPaperPlane,
  faClipboard,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import emailjs from "emailjs-com";

export default function Contact() {
  const formRef = useRef();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const loadRecaptcha = () => {
      if (typeof window !== "undefined" && window.grecaptcha) {
        window.grecaptcha.ready(() => {
          window.grecaptcha.render("recaptcha-container", {
            sitekey: "YOUR_RECAPTCHA_SITE_KEY",
            callback: () => setCaptchaVerified(true),
          });
        });
      }
    };
    loadRecaptcha();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaVerified) {
      toast.error("Please complete the reCAPTCHA.");
      return;
    }
    if (!name || !email || !subject || !message) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    toast.loading("Sending message...");

    emailjs
      .sendForm(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        formRef.current,
        "YOUR_PUBLIC_KEY"
      )
      .then(
        () => {
          toast.dismiss();
          toast.success("Message sent successfully!");
          setFormSubmitted(true);
        },
        (error) => {
          toast.dismiss();
          toast.error("Failed to send message.");
          console.error("EmailJS error:", error);
        }
      )
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="relative">
      <Head>
        <title>LA Relief - Discover Aid Near You</title>
        <meta
          name="description"
          content="Find aid and resources near you for emergencies and support."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div
        className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6"
        style={{ fontfamily: "noto sans sans-serif", fontweight: "700" }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold text-center"
        >
          CONTACT
        </motion.h1>

        {/* Thank You Screen After Submission */}
        {formSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-10 text-center bg-gray-900 p-10 rounded-lg shadow-lg max-w-lg w-full"
          >
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="text-green-500 text-6xl mb-4"
            />
            <h2 className="text-3xl font-bold">THANK YOU</h2>
            <p className="text-white mt-2">
              We will get back to you as soon as possible!
            </p>
            <button
              onClick={() => setFormSubmitted(false)}
              className="mt-6 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"
            >
              Send Another Message
            </button>
          </motion.div>
        ) : (
          <>
            {/* Info Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="max-w-2xl text-center bg-gray-900 p-6 rounded-lg shadow-lg mt-6"
            >
              <p className="">
                <strong>Welcome to LARelief!</strong>Whether you're here to
                share ideas, offer support, or ask for help, we're ready to
                connect and support you every step of the way. Use the fields
                below to send us a message directly, or feel free to email us at{" "}
                <a
                  href="mailto:contact.larelief@gmail.com"
                  className="text-blue-400"
                >
                  contact.larelief@gmail.com
                </a>
                . You can also follow and message us on instagram at{" "}
                <a
                  href="mailto:contact.larelief@gmail.com"
                  className="text-blue-400"
                >
                  @larelief
                </a>
                . We look forward to hearing from you!
              </p>
            </motion.div>

            {/* Contact Form */}
            <motion.form
              ref={formRef}
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-10 bg-gray-900 p-6 rounded-lg shadow-lg max-w-lg w-full border border-green-500"
            >
              <input
                type="text"
                name="name"
                placeholder="Name*"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 mb-4 rounded bg-black text-white border border-gray-700"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address*"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 mb-4 rounded bg-black text-white border border-gray-700"
              />
              <input
                type="text"
                name="subject"
                placeholder="Subject*"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 mb-4 rounded bg-black text-white border border-gray-700"
              />
              <textarea
                name="message"
                placeholder="Message*"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 mb-4 rounded bg-black text-white border border-gray-700"
              ></textarea>

              {/* reCAPTCHA */}
              <div id="recaptcha-container" className="mb-4"></div>

              {/* Buttons Section */}
              <div className="flex flex-col md:flex-row justify-between gap-4">
                {/* Send Message Button */}
                <button
                  type="submit"
                  className="w-full md:w-1/2 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>

                {/* Google Form Button */}
                <a
                  href="YOUR_GOOGLE_FORM_LINK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-1/2 bg-white text-black font-bold p-3 rounded-lg hover:bg-gray-200 flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faClipboard} className="mr-2" />
                  Google Form
                </a>
              </div>
            </motion.form>
          </>
        )}
      </div>
    </div>
  );
}
