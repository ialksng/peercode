import { StrictMode } from "react";
import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axiosInstance from "./lib/axios";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const APP_BASE_PATH = "/work/projects/peercode/app";
const SIGNED_IN_PATH = `${APP_BASE_PATH}/dashboard`;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

const queryClient = new QueryClient();

function ClerkAxiosBridge({ children }) {
  const { getToken } = useAuth();

  useEffect(() => {
    const interceptorId = axiosInstance.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    return () => axiosInstance.interceptors.request.eject(interceptorId);
  }, [getToken]);

  return children;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={APP_BASE_PATH}>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider
          publishableKey={PUBLISHABLE_KEY}
          signInFallbackRedirectUrl={SIGNED_IN_PATH}
          signUpFallbackRedirectUrl={SIGNED_IN_PATH}
          afterSignOutUrl={APP_BASE_PATH}
        >
          <ClerkAxiosBridge>
            <App />
          </ClerkAxiosBridge>
        </ClerkProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
