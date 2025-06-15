import emailjs from "emailjs-com";
import { FormEvent } from "react";

export const sendEmail = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  let SENDMAIL_KEY = process.env.SENDMAIL_KEY || "";
  let SERVICE_MAIL = process.env.EMAIL_SERVICE || "";
  if (!SENDMAIL_KEY || !SERVICE_MAIL) {
    emailjs
      .sendForm(
        "sendmailservice_tomas",
        "template_ajm9bmm",
        e.currentTarget,
        "plgNbyye6G1kUYz93"
      )
      .then(
        () => {
          alert("Mensaje enviado con éxito ✅");
        },
        (error) => {
          alert("Error al enviar mensaje ❌: " + error.text);
        }
      );
  }
};
