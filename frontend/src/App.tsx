import { BrowserRouter, Navigate, Route } from "react-router";
import { Routes } from "react-router";
import Dashboard from "./pages/Dashboard";
import KnowledgeBase from "./pages/KnowledgeBase";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ThemeProvider from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import GeneralChatLayout from "./components/layouts/GeneralChatLayout";
import PDFChatLayout from "./components/layouts/PDFChatLayout";
import PDFChat from "./components/pdf-chat/PDFChat";
import AppLayout from "./components/layouts/AppLayout";
import GeneralChat from "./components/general-chat/GeneralChat";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - Data is considered fresh for 5 min
      gcTime: 1000 * 60 * 10, // 10 minutes - Cache is kept for 10 min (garbage collection)
      retry: 1, // Retry failed requests once
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
    },
    mutations: {
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/chat" element={<GeneralChatLayout />}>
                <Route index element={<Navigate to="/chat/new" replace />} />
                <Route index path=":sessionId" element={<GeneralChat />} />
              </Route>
              <Route path="/chat-pdf" element={<PDFChatLayout />}>
                <Route
                  index
                  element={<Navigate to="/chat-pdf/new" replace />}
                />
                <Route index path=":id" element={<PDFChat />} />
              </Route>
              <Route path="/knowledge-base" element={<KnowledgeBase />} />
            </Route>
          </Routes>
          <Toaster position="top-right" />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
