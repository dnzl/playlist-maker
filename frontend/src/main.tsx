import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { store } from "./app/store";
import { Provider } from "react-redux";
import App from "./App.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme appearance="dark" accentColor="crimson" radius="full">
      <Provider store={store}>
        <App />
      </Provider>
    </Theme>
  </StrictMode>
)
