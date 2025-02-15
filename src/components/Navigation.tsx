import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Stethoscope,
  MapPin,
  History,
  Bot,
  Heart,
  Menu,
  X,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignInModal } from "@/components/SignInModal";
import { SignUpModal } from "@/components/SignUpModal";
import { UserProfileModal } from "@/components/UserProfileModal";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    name: "Symptom Checker",
    href: "/symptoms",
    icon: Stethoscope,
  },
  {
    name: "Health History",
    href: "/history",
    icon: History,
  },
  {
    name: "AI Assistant",
    href: "/assistant",
    icon: Bot,
  },
];

export const Navigation: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleSignOut = () => {
    logout();
  };

  const NavItems = ({
    isMobile = false,
    onItemClick,
  }: {
    isMobile?: boolean;
    onItemClick?: () => void;
  }) => (
    <nav
      className={cn("flex gap-1", isMobile ? "flex-col space-y-2" : "flex-row")}
    >
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;

        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={onItemClick}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground",
              isMobile && "justify-start w-full",
            )}
          >
            <Icon className="h-4 w-4" />
            {isMobile && <span>{item.name}</span>}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2 mr-6">
          <Heart className="h-6 w-6 text-primary" />
          <Link to="/" className="font-bold text-xl">
            Your Care
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 items-center justify-between">
          <NavItems />
          <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-xs">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowProfile(true)}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSignIn(true)}
                >
                  Sign In
                </Button>
                <Button size="sm" onClick={() => setShowSignUp(true)}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden ml-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Heart className="h-6 w-6 text-primary" />
                  <span className="font-bold text-xl">HealthCare</span>
                </div>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                </SheetClose>
              </div>

              <SheetClose asChild>
                <div>
                  <NavItems isMobile onItemClick={() => {}} />

                  <div className="mt-6 space-y-2">
                    {isAuthenticated && user ? (
                      <>
                        <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="text-sm">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setShowProfile(true)}
                        >
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={handleSignOut}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setShowSignIn(true)}
                        >
                          Sign In
                        </Button>
                        <Button
                          className="w-full"
                          onClick={() => setShowSignUp(true)}
                        >
                          Get Started
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetClose>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Authentication Modals */}
      <SignInModal
        isOpen={showSignIn}
        onClose={() => setShowSignIn(false)}
        onSwitchToSignUp={() => {
          setShowSignIn(false);
          setShowSignUp(true);
        }}
      />
      <SignUpModal
        isOpen={showSignUp}
        onClose={() => setShowSignUp(false)}
        onSwitchToSignIn={() => {
          setShowSignUp(false);
          setShowSignIn(true);
        }}
      />
      <UserProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </header>
  );
};
