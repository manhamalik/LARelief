import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import Image from "next/image";
import toast from "react-hot-toast";

export default function Footer({ }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false); // Loading state to prevent double-clicks

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return; // Prevents double-clicks
    setSubmitting(true);

    try {
      const subscriptionId = uuidv4();

      const checkEmailRes = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/blog-email-sign-ups?filters[Email][$eq]=${email}`
      );
      const checkEmailObj = await checkEmailRes.json();

      if (checkEmailRes.ok) {
        if (checkEmailObj.data.length > 0) {
          //check if the data object is empty, if it is empty the email is new
          toast.error("This email is already signed up.");
          throw new Error("Duplicate Email");
        } else {
          const emailsendingRes = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/blog-email-sign-ups`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                data: {
                  Email: email,
                  subscriptionId: subscriptionId,
                },
              }),
            }
          );

          if (emailsendingRes.ok) {
            toast.success("Successfully signed up!");
          } else {
            toast.error("Failed to sign up. Please try again.");
          }
        }
      } else {
        toast.error("Failed to check email. Please try again.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="logo">
          <div className={`hidden select-none w-56 sm:block`}>
            <Image
              src="/images/larelieflogo.png"
              alt="LARelief"
              width={261}
              height={80}
            />
          </div>
          <div className={`block select-none w-36 h-6 sm:hidden`}>
            <Image
              src="/images/larelieflogo.png"
              alt="LARelief"
              width={261}
              height={80}
            />
          </div>
        </div>
        <div className="social-media-icons">
          <div className="social-icon">
            <Link href="https://twitter.com/" passHref legacyBehavior>
              <a aria-label="x link" target="_blank">
              <FontAwesomeIcon
              icon={faXTwitter}
              style={{ fontSize: "1.75rem", margin: "0px" }}
            />

              </a>
            </Link>
          </div>
          <div className="social-icon">
            <Link
              href="mailto:contact.larelief@gmail.com"
              passHref
              legacyBehavior
            >
              <a aria-label="Email link" target="_blank">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  style={{ fontSize: "1.75rem", margin: "0px" }}
                />
              </a>
            </Link>
          </div>
          <div className="social-icon">
            <Link
              href="https://www.instagram.com/la_relief/?utm_source=ig_web_button_share_sheet"
              passHref
              legacyBehavior
            >
              <a aria-label="instagram link" target="_blank">
                <FontAwesomeIcon
                  icon={faInstagram}
                  style={{ fontSize: "1.75rem", margin: "0px" }}
                />
              </a>
            </Link>
          </div>
        </div>

        <span className="footer-text select-none">
          2025 © LA Relief.
          <br /> All rights reserved
        </span>
      </div>
      <style jsx>{`
        .footer {
          background-color: rgb(0, 0, 0);
          padding: 28px;
          text-align: center;
        }
        .footer-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }
        .social-media-icons {
          display: flex;
          justify-content: center;
          gap: 13px;
        }
        .social-icon {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 55px;
          height: 55px;
          background-color: white;
          border-radius: 50%;
          transition: transform 0.2s ease-out;
        }
        .social-icon:hover {
          transform: scale(1.1);
        }
        .footer-text {
          font-family: "Noto Sans", sans-serif;
          font-weight: 700;
          font-size: 22px;
          color: white;
          line-height: 1.2;
        }
        @media (min-width: 769px) {
          .footer-content {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
          .contact-info {
            flex-direction: row;
            gap: 20px;
          }
        }
        @media (max-width: 768px) {
          .footer-content {
            flex-direction: column;
            align-items: center;
          }
          .footer-text {
            font-size: 10px;
          }
        }
      `}</style>
    </footer>
  );
}