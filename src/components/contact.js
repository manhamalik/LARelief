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
  faStar,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import emailjs from "emailjs-com";
import ReCAPTCHA from "react-google-recaptcha";

export default function Contact() {
  const formRef = useRef();
  const recaptchaRef = useRef();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const router = useRouter();

  const handleRecaptchaChange = (token) => {
    setCaptchaVerified(token);
  };

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
        setCaptchaToken(null);
        recaptchaRef.current?.reset();
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
        className="relative flex flex-col items-center min-h-screen bg-[#183917] text-white p-6"
        style={{ fontfamily: "noto sans sans-serif", fontweight: "700" }}
      >
        {/* Black background */}
        <div className="absolute bottom-[px] top-[230px] h-full w-full bg-[#000000] rounded-[160px] rounded-b-none z-index-2"></div>

        <div
          className="absolute top-[0px] bg-[#227541] rounded-[128px]  rounded-t-none"
          style={{
            zIndex: 0,
            width: "498px",
            height: "210px",
            boxShadow: "-25px 1px 2px 0 rgb(7, 32, 14)",
          }}
        ></div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative text-5xl font-bold text-center border-4 border-white p-6 pl-10 pr-10 mt-5 rounded-[180px]"
          style={{
            fontFamily: "'noto sans', sans-serif",
            fontWeight: "900",
            textShadow: "0 4px 3px rgba(0, 0, 0, 0.4)",
            fontSize: "4rem",
          }}
        >
          CONTACT
        </motion.h1>

        {/* Thank You Screen After Submission */}
        {formSubmitted ? (
          <div className="relative mt-16 flex flex-row items-start space-x-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-10 text-center p-10 rounded-lg shadow-lg max-w-[800px] w-full items-center"
              style={{
                fontFamily: "'noto sans', sans-serif",
                fontweight: "700",
              }}
            >
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-[#227541] text-[280px] mb-4 "
              />

              <h2 className="text-6xl font-bold">THANK YOU</h2>
              <p className="text-white text-2xl font-bold mt-2">
                We will get back to you as soon as possible!
              </p>
              <button
                onClick={() => setFormSubmitted(false)}
                className="mt-14 bg-[#227541] text-2xl font-bold text-white p-3 rounded-lg hover:bg-white hover:text-[#227541] transition duration-600"
              >
                Send Another Message
              </button>
            </motion.div>
          </div>
        ) : (
          <>
            {/* Info Section */}
            <div className="relative">
              <motion.div
                className="flex items-center justify-between gap-[20px] mt-[-150px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <img
                  src="/images/image-removebg-preview_73.png"
                  className="sm:w-[15rem] md:w-[15rem] lg:w-[27rem] h-auto mr-6"
                />
                <img
                  src="/images/image-removebg-preview_73_5.png"
                  className="sm:w-[15rem] md:w-[15rem] lg:w-[27rem] h-auto pl-6"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="max-w-8xl p-12 rounded-[50px] shadow-lg mt-3 border-4 border-white m-6"
                style={{
                  fontFamily: "'noto sans', sans-serif",
                  fontSize: "1.4rem",
                }}
              >
                <p>
                  <strong>Welcome to LARelief!</strong> <br /> Whether you're
                  here to share ideas, offer support, or ask for help, we're
                  ready to connect and support you every step of the way. <br />
                  Use the fields below to send us a message directly, or feel
                  free to email us at{" "}
                  <a
                    href="mailto:contact.larelief@gmail.com"
                    className="text-blue-400 underline"
                  >
                    contact.larelief@gmail.com
                  </a>
                  . You can also follow and message us on instagram at{" "}
                  <a
                    href="https://www.instagram.com/la_relief/"
                    className="text-blue-400 underline"
                  >
                    @larelief
                  </a>
                  <br />
                  <br />
                  <strong>A Little About Us</strong> <br /> LARelief was founded
                  in response to the devastating fires that impacted Los Angeles
                  on January 17, 2025. Our mission is to provide essential
                  resources and support, helping the community recover and
                  thrive.
                  <br />
                  <br />
                  Looking ahead, we are committed to expanding our impact,
                  ensuring that no one is left behind during tough times. Fueled
                  by compassion and the collective spirit of people like you, we
                  aim to build a stronger, more resilient community together.
                </p>
              </motion.div>
            </div>

            {/* Contact Form */}
            <div className="relative mt-16 flex flex-row items-start space-x-10 m-5">
              {/* Google Form Section (1/3 width) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative bg-black border-4 border-white text-white p-10 rounded-2xl shadow-xl w-1/3 max-w-md text-center mr-20 mt-60"
              >
                {/* Star Icon - Positioned Above */}
                <div className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-white w-16 h-16 flex items-center justify-center rounded-full border-4 border-black">
                  <FontAwesomeIcon
                    icon={faStar}
                    className="text-black text-3xl"
                  />
                </div>

                {/* Assistance Text */}
                <p
                  className="text-2xl font-bold leading-relaxed"
                  style={{ fontFamily: "'Noto Sans', sans-serif" }}
                >
                  Need help with volunteering, donations, or updating resources?
                  Fill out our Google form.
                </p>

                {/* Google Form Button */}
                <a
                  href="#link-to-google-form"
                  className="mt-6 bg-white text-black font-bold text-[26px] py-4 px-8 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-200 transition duration-300"
                >
                  GOOGLE FORM
                  <FontAwesomeIcon icon={faArrowRight} />
                </a>
              </motion.div>

              {/* Contact Form (2/3 width) */}
              <div className="flex flex-col items-end w-2/3 pl-5">
                <motion.form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="relative mt-0 w-full max-w-4xl min-h-[550px] p-12 rounded-2xl shadow-xl border border-white"
                >
                  <input
                    type="text"
                    name="name"
                    placeholder="Name*"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-5 mb-6 text-xl rounded-xl bg-black text-white border border-gray-700"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address*"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-5 mb-6 text-xl rounded-xl bg-black text-white border border-gray-700"
                  />
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject*"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-5 mb-6 text-xl rounded-xl bg-black text-white border border-gray-700"
                  />
                  <textarea
                    name="message"
                    placeholder="Message*"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-5 min-h-[250px] mb-6 text-xl rounded-xl bg-black text-white border border-gray-700"
                  ></textarea>

                  {/* reCAPTCHA */}
                  <div className="flex justify-center mb-6">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey="6Leq-8gqAAAAACQaMzJwa7ucBiT_Z-YEKw3piAyq"
                      onChange={handleRecaptchaChange}
                    />
                  </div>
                </motion.form>

                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-[120px] h-[60px] bg-[#267738] text-white text-xl font-bold p-4 rounded-xl hover:bg-green-600 flex items-center justify-center mt-6"
                  disabled={isSubmitting}
                >
                  <FontAwesomeIcon
                    icon={faPaperPlane}
                    className="mr-3 text-2xl"
                  />{" "}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
