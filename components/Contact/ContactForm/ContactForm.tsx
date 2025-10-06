"use client";
import React from "react";
import { ContactInfoProps } from "@/types/index";
import {
  GithubIcon,
  LinkedinIcon,
  GmailIcon,
} from "@/components/Icons/SkillIcons";
import { sendEmail } from "@/components/Sendmail/Sendmail";
import {
  trackCVDownload,
  trackGitHubClick,
  trackEmailClick,
  trackContactFormSubmit,
  trackLinkedinClick,
} from "@/app/analytics/analytics";
const ContactForm: React.FC<ContactInfoProps> = ({ contactInfo }) => {
  const sendingEmail = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const message = formData.get("message") as string;

    sendEmail(e);
    trackContactFormSubmit({ message });
    e.currentTarget.reset();
  };

  const handleLinkClick = (platform: string) => {
    if (platform === "Github") {
      trackGitHubClick();
    } else if (platform === "Linkedin") {
      trackLinkedinClick();
    } else if (platform === "Gmail") {
      trackEmailClick();
    }
  };

  return (
    <div className="px-4 mx-auto max-w-screen-md mb-4">
      <div className="flex flex-col justify-center lg:mb-8">
        <div className="flex flex-row items-center justify-center gap-4 dark:text-white ">
          {contactInfo &&
            Object.entries(contactInfo).map(([platform, value], index) => {
              const href = platform === "Gmail" ? `mailto:${value}` : value;
              return (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleLinkClick(platform)}
                >
                  {platform === "Github" && <GithubIcon size={29} />}
                  {platform === "Linkedin" && <LinkedinIcon size={29} />}
                  {platform === "Gmail" && <GmailIcon size={29} />}
                </a>
              );
            })}
        </div>
      </div>
      <form className="space-y-4" onSubmit={sendingEmail}>
        <div className="flex flex-row gap-10 items-center w-full">
          <div className="w-full">
            <label className="block mb-2 text-sm font-medium  border-amber-200 dark:text-gray-300">
              Your email
            </label>
            <input
              type="email"
              name="name"
              id="email"
              className="shadow-sm border border-amber-200 text-sm rounded-lg block w-full p-2.5 dark:bg-[#3D2548] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
              placeholder="example@gmail.com"
              required
            />
          </div>
          <div className="w-full">
            <label className="block mb-2 text-sm font-medium  dark:text-gray-300">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="email"
              className="block p-3 w-full text-sm  border-amber-200 rounded-lg border shadow-sm  dark:bg-[#3D2548] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
              placeholder="Consultation for services"
              required
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <textarea
            id="message"
            name="message"
            rows={4}
            className="block p-2.5 w-full text-sm  rounded-lg shadow-sm border dark:border-gray-600 border-amber-200  dark:bg-[#3D2548]  dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Let us know how we can help you..."
          />
        </div>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button
            type="submit"
            className="py-3 px-5 text-sm font-normal text-center  text-gray-700
            bg-amber-100 ring ring-amber-100 rounded-md
            sm:w-fit transition duration-300 ease-in-out
            hover:bg-white focus:ring-4 focus:outline-white focus:ring-amber-100
            dark:bg-[#3D2548] dark:text-gray-300 dark:ring-[#777272] dark:hover:ring-[#777272] dark:hover:bg-[#777272]"
          >
            Send message
          </button>
          <button
            type="button"
            className="py-3 px-5 text-sm font-normal text-center text-gray-700
            bg-amber-100 ring ring-amber-100 rounded-md
            sm:w-fit transition duration-300 ease-in-out
            hover:bg-white focus:ring-4 focus:outline-white focus:ring-amber-100
            dark:bg-[#3D2548] dark:text-gray-300 dark:ring-[#777272] dark:hover:ring-[#777272] dark:hover:bg-[#777272]"
          >
            <a
              href="/pdf/TOMAS GENEROSO CV EN.pdf"
              onClick={trackCVDownload}
              download
              className="flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download CV
            </a>
          </button>
        </div>
      </form>
    </div>
  );
};
export default ContactForm;
