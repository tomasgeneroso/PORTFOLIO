"use client";
import ContactForm from "@/components/Contact/ContactForm/ContactForm";
import { TitleSeparator } from "@/components/TitleSeparator/TitleSeparator";
import { UserProps } from "@/types"; // Importa el tipo UserData
import { ContactInfo } from "@/types";
const ContactSection: React.FC<UserProps> = ({ userData }) => {
  const { Github, Linkedin, Gmail, ...otherLinks } = userData.links;
  const contactInfo: ContactInfo = {
    Github: Github,
    Linkedin: Linkedin,
    Gmail: Gmail,
  };
  return (
    <section
      className="flex flex-col w-full mx-0  h-screen"
      id="contactSection"
    >
      <TitleSeparator titleText="Contact" />
      <div className="flex flex-wrap w-full flex-col">
        <ContactForm contactInfo={contactInfo} />
      </div>
    </section>
  );
};
export default ContactSection;
