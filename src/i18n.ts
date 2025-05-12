// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
const resources = {
    en: {
      translation: {
        welcome: "Welcome to the Home Page!",
        home: "Home",
        about: "About",
        aboutDescription: "This page gives you information about our website.",
        resources: "Resources",
        resourcesDescription: "Here are some resources to help you.",
        contact: "Contact",
        name: "Your Name",
        email: "Your Email",
        message: "Your Message",
        send: "Send Message",
        yourWebsite: "AI Learning",
      },
    },
    sv: {
      translation: {
        welcome: "Välkommen till hemsidan!",
        home: "Hem",
        about: "Om oss",
        aboutDescription: "Denna sida ger dig information om vår webbplats.",
        resources: "Resurser",
        resourcesDescription: "Här är några resurser som kan hjälpa dig.",
        contact: "Kontakt",
        name: "Ditt Namn",
        email: "Din E-post",
        message: "Ditt Meddelande",
        send: "Skicka Meddelande",
        yourWebsite: "AI Learning",
      },
    },
  };
  i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
  
  export default i18n;