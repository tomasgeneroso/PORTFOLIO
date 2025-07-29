"use client";
import React from "react";
import { ContactInfoProps } from "@/types/index";
import {
  GithubIcon,
  LinkedinIcon,
  GmailIcon,
} from "@/components/Icons/SkillIcons";
import { sendEmail } from "@/components/Sendmail/Sendmail";

const ContactForm: React.FC<ContactInfoProps> = ({ contactInfo }) => {
  const sendingEmail = (e: React.FormEvent<HTMLFormElement>) => {
    sendEmail(e);
    e.currentTarget.reset();
  };
  return (
    <section className=" ">
      <div className="px-4 mx-auto max-w-screen-md">
        <div className="flex flex-col justify-center lg:mb-8">
          <div className="flex flex-row items-center justify-center gap-4">
            {contactInfo &&
              Object.entries(contactInfo).map(([platform, value], index) => {
                const href = platform === "Gmail" ? `mailto:${value}` : value;
                return (
                  <a
                    key={index}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
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
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Your email
              </label>
              <input
                type="email"
                name="name"
                id="email"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-[#3D2548] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
                placeholder="example@gmail.com"
                required
              />
            </div>
            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="email"
                className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-[#3D2548] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
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
              className="block p-2.5 w-full text-sm text-gray-900 rounded-lg shadow-sm border dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 dark:bg-[#3D2548]   dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Let us know how we can help you..."
            />
          </div>
          <div className="flex items-center justify-center">
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
          </div>
        </form>
      </div>
    </section>
  );
};
export default ContactForm;
