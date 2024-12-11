import Head from "next/head";
import { Slide, StyledEngineProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";
import { store } from "../redux/Store";

import "../styles/globals.css";
import "../CSS/login.css";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Bean There, Done That</title>
        <meta name="description" content="Your go-to coffee shop for the best brews." />
        <meta name="keywords" content="coffee, shop, brews, drinks" />
        <meta name="author" content="Your Name" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <StyledEngineProvider injectFirst>
        <Provider store={store}>
          <SnackbarProvider
            TransitionComponent={Slide}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          >
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SnackbarProvider>
        </Provider>
      </StyledEngineProvider>
    </>
  );
}

export default MyApp;