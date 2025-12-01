import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/navbar";
import { ErrorBoundary } from "@/components/error-boundary";
import Landing from "@/pages/landing";
import Register from "@/pages/register";
import Login from "@/pages/login";
import Home from "@/pages/home";
import CharacterDetail from "@/pages/character-detail";
import Favorites from "@/pages/favorites";
import Admin from "@/pages/admin";
import Legal from "@/pages/legal";
import Privacy from "@/pages/privacy";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/legal" component={Legal} />
          <Route path="/privacy" component={Privacy} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/character/:id" component={CharacterDetail} />
          <Route path="/favorites" component={Favorites} />
          <Route path="/admin" component={Admin} />
          <Route path="/legal" component={Legal} />
          <Route path="/privacy" component={Privacy} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <>
      {!isLoading && isAuthenticated && <Navbar />}
      <Router />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AppContent />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
