
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import Analytics from "./pages/Analytics";
import NewProject from "./pages/NewProject";
import CreateProjectAHP from "./pages/CreateProjectAHP";
import ProjectDetail from "./pages/ProjectDetail";
import NotFound from "./pages/NotFound";
import LearnAHP from "./pages/LearnAHP";
import DemoAHP from "./pages/DemoAHP";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/learn-ahp" element={<LearnAHP />} />
              <Route path="/new-project" element={<NewProject />} />
              <Route path="/create-project/ahp" element={<CreateProjectAHP />} />
              <Route path="/project/:id" element={<ProjectDetail />} />
              <Route path="/demo-ahp" element={<DemoAHP />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
