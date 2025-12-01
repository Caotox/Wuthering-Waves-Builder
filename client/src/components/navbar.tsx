import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Menu, X, Heart, Shield, User, LogOut, Waves } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <span className="flex items-center gap-2 hover-elevate rounded-lg px-3 py-2 transition-colors cursor-pointer" data-testid="link-home">
              <Waves className="h-6 w-6 text-primary" />
              <span className="text-2xl font-serif font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                WW Database
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated && (
              <>
                <Link href="/">
                  <span className="text-sm font-medium hover:text-primary transition-colors cursor-pointer" data-testid="link-characters">
                    Personnages
                  </span>
                </Link>
                <Link href="/favorites">
                  <span className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2 cursor-pointer" data-testid="link-favorites">
                    <Heart className="h-4 w-4" />
                    Favoris
                  </span>
                </Link>
                {user?.role === "ADMIN" && (
                  <Link href="/admin">
                    <span className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2 cursor-pointer" data-testid="link-admin">
                      <Shield className="h-4 w-4" />
                      Admin
                      <Badge variant="default" className="ml-1">ADMIN</Badge>
                    </span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full" data-testid="button-user-menu">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} />
                      <AvatarFallback>
                        {user.firstName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} />
                      <AvatarFallback>
                        {user.firstName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/favorites">
                      <span className="flex items-center cursor-pointer w-full">
                        <Heart className="h-4 w-4 mr-2" />
                        Mes favoris
                      </span>
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "ADMIN" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <span className="flex items-center cursor-pointer w-full">
                          <Shield className="h-4 w-4 mr-2" />
                          Administration
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => {
                      try {
                        await fetch("/api/logout", { method: "POST", credentials: "include" });
                        window.location.href = "/";
                      } catch (error) {
                        // En cas d'erreur, rediriger quand même vers la page d'accueil
                        window.location.href = "/";
                      }
                    }}
                    className="text-destructive focus:text-destructive cursor-pointer"
                    data-testid="button-logout"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && isAuthenticated && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link href="/">
                <span
                  className="text-sm font-medium px-3 py-2 rounded-lg hover-elevate transition-colors cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Personnages
                </span>
              </Link>
              <Link href="/favorites">
                <span
                  className="text-sm font-medium px-3 py-2 rounded-lg hover-elevate transition-colors flex items-center gap-2 cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart className="h-4 w-4" />
                  Favoris
                </span>
              </Link>
              {user?.role === "ADMIN" && (
                <Link href="/admin">
                  <span
                    className="text-sm font-medium px-3 py-2 rounded-lg hover-elevate transition-colors flex items-center gap-2 cursor-pointer"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Shield className="h-4 w-4" />
                    Admin
                  </span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
