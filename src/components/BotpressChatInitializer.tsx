import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    botpress?: {
      init: (config: any) => void;
      on: (event: string, callback: () => void) => void;
      open: () => void;
      close: () => void;
    };
  }
}

export const BotpressChatInitializer: React.FC = () => {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!document.getElementById('bp-webchat-script')) {
      const script = document.createElement('script');
      script.id = 'bp-webchat-script';
      script.src = 'https://cdn.botpress.cloud/webchat/v3.0/inject.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (window.botpress && !initializedRef.current) {
          window.botpress.init({
            botId: '4df75848-3458-45cf-b9f2-d779db7907f5',
            clientId: '3f041ee9-b452-46dc-94c1-07013f57ca60',
            configuration: {
              website: {},
              email: {},
              phone: {},
              termsOfService: {},
              privacyPolicy: {}
            }
          });
          initializedRef.current = true;
        }
      };
    } else if (window.botpress && !initializedRef.current) {
      window.botpress.init({
        botId: '4df75848-3458-45cf-b9f2-d779db7907f5',
        clientId: '3f041ee9-b452-46dc-94c1-07013f57ca60',
        configuration: {
          website: {},
          email: {},
          phone: {},
          termsOfService: {},
          privacyPolicy: {}
        }
      });
      initializedRef.current = true;
    }
  }, []);

  return null;
};