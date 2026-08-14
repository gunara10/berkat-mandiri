'use client';

import { Snowflake, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const quickLinks = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Kategori Produk', href: '#kategori' },
  { label: 'Katalog Produk', href: '#produk' },
  { label: 'Keunggulan', href: '#keunggulan' },
  { label: 'Testimoni', href: '#testimoni' },
  { label: 'Hubungi Kami', href: '#kontak' },
];

const categories = [
  'AC Split',
  'Kompresor',
  'Refrigerant',
  'Spare Part AC',
  'Chiller & VRV/VRF',
  'Mesin Pendingin',
];

const brands = [
  'Daikin', 'Panasonic', 'Samsung', 'LG', 'Gree',
  'Mitsubishi', 'Toshiba', 'Fujitsu', 'Copeland', 'Danfoss',
];

export function Footer() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* CTA Banner */}
      <div className="bg-gradient-teal">
        <div className="container mx-auto px-4 py-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Butuh Solusi Pendingin untuk Proyek Anda?
          </h2>
          <p className="text-teal-100 max-w-2xl mx-auto mb-5">
            Tim ahli kami siap membantu Anda memilih produk yang tepat dengan
            penawaran harga terbaik. Konsultasi gratis!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              className="bg-white text-teal-700 hover:bg-gray-100 shadow-lg h-12 px-8"
              onClick={() => scrollTo('#kontak')}
            >
              Hubungi Kami Sekarang
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 h-12 px-8"
              onClick={() => {
                window.open('https://wa.me/6281234567890', '_blank');
              }}
            >
              <Phone className="h-4 w-4 mr-2" />
              0812-3456-7890
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-teal flex items-center justify-center">
                <Snowflake className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-sm text-white leading-tight">
                  BERKAT MANDIRI
                </div>
                <div className="text-[9px] text-teal-400 tracking-wider uppercase">
                  Pendingin
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Pusat penjualan AC, kompresor, refrigerant, spare part, dan
              sistem pendingin gedung terlengkap di Indonesia.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 mt-0.5 text-teal-400 shrink-0" />
                <span>Jl. Raya Industri No. 88, Kawasan Industri MM2100, Bekasi 17520</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                <span>021-8899-7766</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                <span>info@berkatmandiripendingin.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Navigasi</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-sm text-gray-400 hover:text-teal-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Kategori</h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => scrollTo('#produk')}
                    className="text-sm text-gray-400 hover:text-teal-400 transition-colors"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Brand Tersedia</h4>
            <div className="flex flex-wrap gap-1.5">
              {brands.map((b) => (
                <span
                  key={b}
                  className="text-[11px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-800" />

      {/* Bottom Bar */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Berkat Mandiri Pendingin. Hak Cipta Dilindungi.</p>
          <p>Member resmi distributor HVAC di Indonesia</p>
        </div>
      </div>
    </footer>
  );
}
