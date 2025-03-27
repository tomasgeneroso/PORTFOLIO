import React, { useState, useEffect } from "react";
import { ContactInfoProps } from "@/types/index";
import {
  GithubIcon,
  LinkedinIcon,
  GmailIcon,
} from "@/components/Icons/SkillIcons";

const ContactForm: React.FC<ContactInfoProps> = ({ contactInfo }) => {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="px-4 mx-auto max-w-screen-md">
        <div className="flex flex-col  justify-center lg:mb-8">
          <div className="flex flex-row items-center justify-center">
            {Object.entries(contactInfo).map(([platform, value], index) => {
              return (
                <div key={index}>
                  {platform == "Github" && <GithubIcon size={29} />}
                  {platform == "Linkedin" && <LinkedinIcon />}
                  {platform == "Gmail" && <GmailIcon size={29} />}
                </div>
              );
            })}
          </div>
        </div>
        <form action="#" className="space-y-4">
          <div className="flex flex-row gap-10 items-center w-full">
            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Your email
              </label>
              <input
                type="email"
                id="email"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
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
                className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
                placeholder="Consultation for services"
                required
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <textarea
              id="message"
              rows={4}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Let us know how we can help you..."
            />
          </div>
          <button
            type="submit"
            className="py-3 px-5 text-sm font-normal text-center text-black  bg-amber-100 ring  ring-amber-100 sm:w-fit transition duration-300 ease-in-out hover:bg-white focus:ring-4 focus:outline-none focus:ring-amber-100 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            Send message
          </button>
        </form>
      </div>
    </section>
  );
};
export default ContactForm;
