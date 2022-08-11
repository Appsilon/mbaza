import i18next from 'i18next';
import { createRoot } from 'react-dom/client';
import { initReactI18next } from 'react-i18next';

import translations from '../../assets/translations.json';
import Root from './Root';
import './styles/app.global.scss';

i18next
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: translations,
    lng: 'fr',
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    react: {
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: [
        // eslint-disable-next-line
        'br', 'strong', 'i', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
      ]
    }
  });

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<Root />);
