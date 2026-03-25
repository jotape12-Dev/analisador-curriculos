"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useAnalysisStore } from "@/store/analysisStore";
import { Button } from "@/components/ui/button";
import { PremiumModal } from "@/components/PremiumModal";
import { Moon, Sun, FileText, LogOut, User } from "lucide-react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { isPremium, user, setUser, setProfile } = useAnalysisStore();
  const [isPremiumModalOpen, setPremiumModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch user on mount
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        setUser(data.user);
        setProfile(data.profile);
      } catch {
        setUser(null);
        setProfile(null);
      }
    }
    fetchUser();
  }, [setUser, setProfile]);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setProfile(null);
    setMenuOpen(false);
    router.push('/login');
  };

  return (
    <>
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setPremiumModalOpen(false)}
      />

      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between mx-auto px-4 sm:px-8 max-w-6xl">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <FileText className="h-6 w-6 text-primary" />
            <span>Lapida<span className="text-primary">AI</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-4 text-sm font-semibold">
              <Link href="/sobre" className="text-muted-foreground hover:text-foreground transition-colors">
                Sobre
              </Link>
            </nav>

            {!isPremium ? (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-500/10 transition-all text-xs font-bold"
                onClick={() => setPremiumModalOpen(true)}
              >
                <span className="text-sm">⭐</span>
                Premium
              </Button>
            ) : (
              <div className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-bold rounded-md text-xs flex items-center gap-1.5">
                <span className="text-sm">⭐</span> Premium
              </div>
            )}

            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="rounded-full"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Alternar tema</span>
              </Button>
            )}

            {/* Auth section */}
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 rounded-full border border-border/50 p-1 pr-3 hover:bg-muted/50 transition-colors"
                >
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.name || "avatar"}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <span className="text-xs font-medium max-w-[100px] truncate hidden sm:block">
                    {user.name || user.email}
                  </span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-zinc-950 border border-border rounded-xl shadow-xl p-2 animate-in fade-in zoom-in-95 duration-150 z-[100]">
                    <div className="px-3 py-2 border-b border-border/50 mb-1">
                      <p className="text-sm font-semibold truncate">{user.name || "Usuário"}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm" className="text-xs font-bold">
                  Entrar
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
