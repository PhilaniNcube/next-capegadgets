import { SnackbarProvider } from 'notistack';
import { useEffect } from 'react';
import FacebookPixel from '../components/FacebookPixel';
import '../styles/globals.css';
import { StoreProvider } from '../utils/Store';
import { GTMPageView } from '../utils/gtm';
import {useRouter} from 'next/router'

function MyApp({ Component, pageProps }) {
   const Router = useRouter();
   
   useEffect(() => {
    Router.events.on('routeChangeComplete', GTMPageView)
    return () => {
      Router.events.off('routeChangeComplete', GTMPageView)
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
