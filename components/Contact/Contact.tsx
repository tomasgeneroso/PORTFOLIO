"use client";
import ContactForm from "@/components/Contact/ContactForm/ContactForm";
import { TitleSeparator } from "@/components/TitleSeparator/TitleSeparator";
import { UserProps } from "@/types";
import { ContactInfo } from "@/types";
import { useI18n } from "@/lib/i18n/context";

const ContactSection: React.FC<UserProps> = ({ userData }) => {
  const { t } = useI18n();
  const { Github, Linkedin, Gmail, ...otherLinks } = userData.links;
  const contactInfo: ContactInfo = {
    Github: Github,
    Linkedin: Linkedin,
    Gmail: Gmail,
  };
  return (
    <section className="flex flex-col w-full h-screen" id="contactSection">
      <TitleSeparator titleText={t.contact.title} />
      <div className="flex flex-wrap w-full flex-col ">
        <ContactForm contactInfo={contactInfo} />
      </div>
    </section>
  );
};
export default ContactSection;
