import { ChakraProvider } from "@chakra-ui/react";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { FirebaseAppProvider } from "reactfire";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorker from "./serviceWorker";
import { theme } from "./theme";

const container = document.getElementById("root");
if (!container) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(container);

const firebaseConfig = {
  apiKey: "AIzaSyCO8mgjRYQDY5d3-sFNQd593dDo8vhM4l4",
  authDomain: "malicious-mafia.firebaseapp.com",
  databaseURL: "https://malicious-mafia-default-rtdb.firebaseio.com",
  projectId: "malicious-mafia",
  storageBucket: "malicious-mafia.appspot.com",
  messagingSenderId: "902418757478",
  appId: "1:902418757478:web:f88b14c2a36966a29e7aa7"
};

root.render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </FirebaseAppProvider>
  </React.StrictMode>,
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

