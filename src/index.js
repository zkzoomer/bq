import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { Web3ReactProvider } from "@web3-react/core";
import { Provider } from 'react-redux'
import { ethers } from "ethers";

import './styles/index.css';
import store from './state';
import App from "./pages/App";

const getLibrary = (provider) => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 8000; // frequency provider is polling
  return library;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <StrictMode>
      <ChakraProvider>
        <Provider store={store}>
          <Web3ReactProvider getLibrary={getLibrary}>
            <App />
          </Web3ReactProvider>
        </Provider>
      </ChakraProvider>
    </StrictMode>
);
