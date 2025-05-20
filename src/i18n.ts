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
        contact: "Contact Us",
        name: "Your Name",
        email: "Your Email",
        message: "Your Message",
        send: "Send Message",
        yourWebsite: "AI Learning",
        Motto: "Bridging Technology & Humanity",
        MottoDescription: "Experience the fusion of AI innovation and creative human insight.",
        CuttingEdge: "Cutting Edge Tools",
        CuttingEdgeDescription: "Explore the cutting-edge tools that shape the future of AI.",
        ExpertTutorials: "Expert Tutorials",
        ExpertTutorialsDescription: "Step-by-step guidance crafted by industry veterans.",
        CommunitySupport:"Community & Support",
        CommunitySupportDescription:"Connect with a vibrant network of fellow innovators.",
        exploreResources: "Explore Resources",
       
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
        contact: "Kontakt Oss",
        name: "Ditt Namn",
        email: "Din E-post",
        message: "Ditt Meddelande",
        send: "Skicka Meddelande",
        yourWebsite: "AI Learning",
        Motto:"Att överbrygga teknologi och mänsklighet",
        MottoDescription: "Experimentera fusionsen mellan AI-nyttjö och kreativ mänsklig insats.",
        CuttingEdge: "Banbrytande verktyg",
        CuttingEdgeDescription: "Upptäck de banbrytande verktyg som formar framtiden för AI.",
        ExpertTutorials: "Experttutorials",
        ExpertTutorialsDescription: "Steg-för-steg vägledning skapad av branschexperter.",
        CommunitySupport:"Gemenskap och stöd",
        CommunitySupportDescription:"Anslut dig till ett livligt nätverk av medskapare.",
        exploreResources: "Utforska resurser",

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