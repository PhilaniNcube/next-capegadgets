import { SnackbarProvider } from 'notistack';
import { useEffect } from 'react';
import FacebookPixel from '../components/FacebookPixel';
import '../styles/globals.css';
import { StoreProvider } from '../utils/Store';
import { GTMPageView } from '../utils/gtm';
import {useRouter} from 'next/router';
import Script from 'next/script'

function MyApp({ Component, pageProps }) {
   const router = useRouter();
   
   useEffect(() => {
    router.events.on('routeChangeComplete', GTMPageView)
    return () => {
      router.events.off('routeChangeComplete', GTMPageView)
    }
  }, [router.events])

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  return (
 <>
     
    <SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <StoreProvider>
          {/* Google Tag Manager - Global base code */}
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
        <FacebookPixel>
          <Component {...pageProps} />
        </FacebookPixel>
      </StoreProvider>
    </SnackbarProvider>

</>

  );
}

export default MyApp;
