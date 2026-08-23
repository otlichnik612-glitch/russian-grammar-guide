import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppHeader, SkipLink } from "@/components/AppHeader";
import Index from "@/pages/Index";
import Train from "@/pages/Train";

const App = () => (
  <BrowserRouter>
    <SkipLink />
    <AppHeader />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/train/:pos" element={<Train />} />
      <Route path="*" element={<Index />} />
    </Routes>
  </BrowserRouter>
);

export default App;
