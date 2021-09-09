import { SnackbarProvider } from 'notistack';
import { useEffect } from 'react';
import TagManager from 'react-gtm-module';
import FacebookPixel from '../components/FacebookPixel';
import '../styles/globals.css';
import { StoreProvider } from '../utils/Store';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    TagManager.initialize({ gtmId: 'GTM-K3HRQQV' });
  }, []);

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  return (
    <SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <StoreProvider>
        <FacebookPixel>
          <Component {...pageProps} />
        </FacebookPixel>
      </StoreProvider>
    </SnackbarProvider>
  );
}

export default MyApp;
