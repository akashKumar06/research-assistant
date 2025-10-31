import { BrowserRouter, Route, Routes } from "react-router";
import LibraryPage from "./pages/LibraryPage";
import ScholarsPage from "./pages/ScholarsPage";
import HomePage from "./pages/HomePage";
import NewChat from "./pages/NewChat";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}>
          <Route index element={<NewChat />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="scholars" element={<ScholarsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
