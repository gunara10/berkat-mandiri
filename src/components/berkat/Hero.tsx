'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Truck, Clock, Headphones } from 'lucide-react';
import Image from 'next/image';

const trustBadges = [
  { icon: Shield, label: 'Garansi Resmi' },
  { icon: Truck, label: 'Pengiriman Se-Indonesia' },
  { icon: Clock, label: 'Respon Cepat 24 Jam' },
  { icon: Headphones, label: 'Konsultasi Gratis' },
];

export function Hero() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="beranda" className="relative overflow-hidden bg-gradient-hero min-h-[600px] lg:min-h-[700px] flex items-center">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-teal-400/15 border border-teal-400/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
              <span className="text-teal-200 text-sm font-medium">
                Distributor Resmi HVAC Terpercaya Sejak 2010
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight mb-6">
              Solusi{' '}
              <span className="text-gradient-teal">Pendingin</span>{' '}
              Terlengkap untuk{' '}
              <span className="text-teal-300">Setiap Kebutuhan</span>
            </h1>

            <p className="text-teal-100/80 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
              Pusat penjualan AC, kompresor, refrigerant, spare part, dan
              sistem pendingin gedung dari brand-brand terkemuka dunia.
              Harga bersaing, garansi resmi, dan layanan purna jual terbaik.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Button
                size="lg"
                className="bg-gradient-teal hover:opacity-90 text-white shadow-xl shadow-teal-900/30 text-base px-8 h-12"
                onClick={() => scrollTo('#produk')}
              >
                Lihat Katalog Produk
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-teal-400/30 text-teal-100 hover:bg-teal-400/10 hover:text-white text-base px-8 h-12"
                onClick={() => scrollTo('#kontak')}
              >
                Konsultasi Gratis
              </Button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {trustBadges.map((badge, i) => (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                  className="flex items-center gap-2 text-teal-200/70"
                >
                  <badge.icon className="h-4 w-4 text-teal-400 shrink-0" />
                  <span className="text-xs font-medium">{badge.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border border-teal-400/10">
              <Image
                src="/images/hero/hero-1.png"
                alt="Sistem pendingin HVAC modern Berkat Mandiri Pendingin"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-950/40 to-transparent" />
            </div>
            {/* Floating stats card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                  <span className="text-lg">🏢</span>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">5,000+</div>
                  <div className="text-xs text-gray-500">Proyek Selesai</div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <span className="text-lg">⭐</span>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">4.9/5</div>
                  <div className="text-xs text-gray-500">Rating Kepuasan</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
