import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";
import {
  BrowserRouter,
  Route,
  useLocation,
  useSearchParams,
} from "react-router";
import { Routes } from "react-router";
import Dashboard from "./pages/Dashboard";
import SearchPapers from "./pages/SearchPaper";
import KnowledgeBase from "./pages/KnowledgeBase";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "./components/Header";

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
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className={`flex h-screen ${isDarkMode ? "dark" : ""}`}>
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-auto bg-zinc-900">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/search" element={<SearchPapers />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/knowledge-base" element={<KnowledgeBase />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
        </div>
        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
