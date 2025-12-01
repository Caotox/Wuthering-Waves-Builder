import React, { Component, ErrorInfo, ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary component to catch and handle React errors gracefully
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error("Error caught by boundary:", error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Alert variant="destructive" className="max-w-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Une erreur est survenue</AlertTitle>
            <AlertDescription className="mt-2">
              {import.meta.env.DEV && this.state.error ? (
                <div className="space-y-2">
                  <p className="font-mono text-sm">{this.state.error.message}</p>
                  <p className="text-xs opacity-70">
                    {this.state.error.stack?.split('\n').slice(0, 3).join('\n')}
                  </p>
                </div>
              ) : (
                <p>
                  Nous sommes désolés, une erreur inattendue s'est produite.
                  Veuillez rafraîchir la page ou réessayer plus tard.
                </p>
              )}
              <Button
                onClick={this.handleReset}
                variant="outline"
                size="sm"
                className="mt-4"
              >
                Réessayer
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}
