import { SnackbarProvider } from 'notistack';
import { useEffect } from 'react';
import Script from 'next/script'
import FacebookPixel from '../components/FacebookPixel';
import '../styles/globals.css';
import { StoreProvider } from '../utils/Store';
import { GTMPageView } from '../utils/gtm';
import Router from 'next/router';

function MyApp({ Component, pageProps }) {
   useEffect(() => {
    router.events.on('routeChangeComplete', GTMPageview)
    return () => {
      Router.events.off('routeChangeComplete', GTMPageview)
    }
  }, [Router.events])

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  return (
 <>
     <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer', 'GTM-K3HRQQV');
          `,
        }}
      />
    <SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <StoreProvider>
        <FacebookPixel>
          <Component {...pageProps} />
        </FacebookPixel>
      </StoreProvider>
    </SnackbarProvider>

</>

  );
}

export default MyApp;
