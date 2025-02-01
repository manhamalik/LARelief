import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="logo">
          <div className="hidden select-none w-56 sm:block">
            <Image
              src="/images/larelieflogo.png"
              alt="LARelief"
              width={261}
              height={80}
            />
          </div>
          <div className="block select-none w-36 h-6 sm:hidden">
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
              <a aria-label="Twitter link" target="_blank">
                <FontAwesomeIcon
                  icon={faXTwitter}
                  style={{ fontSize: "1.75rem", margin: "0px" }}
                />
              </a>
            </Link>
          </div>
          <div className="social-icon">
            <Link href="mailto:contact.larelief@gmail.com" passHref legacyBehavior>
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
              <a aria-label="Instagram link" target="_blank">
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
          background-color: #000;
          padding: 28px;
          text-align: center;
          font-family: "Noto Sans Multani", sans-serif;
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
