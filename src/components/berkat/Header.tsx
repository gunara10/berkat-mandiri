'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import {
  Menu,
  ShoppingCart,
  Phone,
  Snowflake,
  X,
  ChevronDown,
} from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';

const navItems = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Kategori', href: '#kategori' },
  { label: 'Produk', href: '#produk' },
  { label: 'Keunggulan', href: '#keunggulan' },
  { label: 'Testimoni', href: '#testimoni' },
  { label: 'Kontak', href: '#kontak' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalItems = useCartStore((s) => s.getTotalItems());
  const openCart = useCartStore((s) => s.openCart);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Top bar */}
      <div className="bg-teal-900 text-white text-xs py-1.5">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              021-8899-7766
            </span>
            <span className="hidden sm:flex items-center gap-1">
              WhatsApp: 0812-3456-7890
            </span>
          </div>
          <span className="hidden sm:block">Pengiriman Seluruh Indonesia</span>
        </div>
      </div>
      {/* Main header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-white shadow-sm'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => scrollToSection('#beranda')}
              className="flex items-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-teal flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <Snowflake className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-sm leading-tight text-teal-800">
                  BERKAT MANDIRI
                </div>
                <div className="text-[10px] font-medium text-teal-600 tracking-wider uppercase">
                  Pendingin
                </div>
              </div>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-teal-700 rounded-lg hover:bg-teal-50 transition-all duration-200"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                size="sm"
                className="hidden sm:flex bg-gradient-teal hover:opacity-90 shadow-md"
                onClick={() => scrollToSection('#kontak')}
              >
                <Phone className="h-4 w-4 mr-1.5" />
                Hubungi Kami
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="relative"
                onClick={openCart}
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-teal-600 text-white text-[10px] border-2 border-white">
                    {totalItems}
                  </Badge>
                )}
              </Button>

              {/* Mobile menu */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72 p-0">
                  <div className="p-4 border-b bg-teal-900 text-white">
                    <div className="flex items-center gap-2">
                      <Snowflake className="h-6 w-6" />
                      <div>
                        <div className="font-bold text-sm">BERKAT MANDIRI</div>
                        <div className="text-[10px] text-teal-200 tracking-wider">
                          PENDINGIN
                        </div>
                      </div>
                    </div>
                  </div>
                  <nav className="p-2">
                    {navItems.map((item) => (
                      <button
                        key={item.href}
                        onClick={() => scrollToSection(item.href)}
                        className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                      >
                        {item.label}
                      </button>
                    ))}
                    <div className="mt-3 px-4">
                      <Button
                        className="w-full bg-gradient-teal hover:opacity-90"
                        onClick={() => {
                          setMobileOpen(false);
                          scrollToSection('#kontak');
                        }}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Hubungi Kami
                      </Button>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
