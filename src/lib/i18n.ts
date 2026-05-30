import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ptBR from '../locales/pt-BR.json';
import en from '../locales/en.json';
import es from '../locales/es.json';

const resources = {
  'pt-BR': ptBR,
  'en': en,
  'en-US': en,
  'es': es,
  'es-ES': es
};

// Detecção simples inicial
const savedLanguage = localStorage.getItem('i18nextLng') || navigator.language;
const defaultLanguage = ['pt-BR', 'en', 'en-US', 'es', 'es-ES'].includes(savedLanguage) ? savedLanguage : 'pt-BR';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLanguage, // usa o idioma salvo ou do navegador
    fallbackLng: 'pt-BR',
    interpolation: {
      escapeValue: false 
    }
  });

// Escuta mudanças automáticas
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
});

export default i18n;
