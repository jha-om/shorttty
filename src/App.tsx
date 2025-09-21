import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./layout/app-layout";
import Home from "./pages/home";
import Link from "./pages/link";
import Dashboard from "./pages/dashboard";
import Auth from "./pages/auth";
import RedirectLink from "./pages/redirect-link";


function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/link/:id" element={<Link />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/redirect/:id" element={<RedirectLink />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
} export default App