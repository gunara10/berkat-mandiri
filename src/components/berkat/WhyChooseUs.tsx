'use client';

import { motion } from 'framer-motion';
import {
  Shield,
  Truck,
  Clock,
  Headphones,
  Award,
  ThumbsUp,
  Wrench,
  Users,
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Garansi Resmi',
    desc: 'Semua produk bergaransi resmi dari brand ternama dengan jaminan kualitas.',
    color: 'bg-teal-100 text-teal-700',
  },
  {
    icon: Truck,
    title: 'Pengiriman Se-Indonesia',
    desc: 'Jaringan logistik luas memastikan pesanan sampai aman dan tepat waktu.',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    icon: Clock,
    title: 'Respon 24 Jam',
    desc: 'Tim customer service siap membantu Anda kapan saja, termasuk hari libur.',
    color: 'bg-amber-100 text-amber-700',
  },
  {
    icon: Headphones,
    title: 'Konsultasi Gratis',
    desc: 'Tim ahli HVAC siap memberikan konsultasi teknis untuk proyek Anda.',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    icon: Award,
    title: 'Distributor Resmi',
    desc: 'Mitra resmi brand Daikin, Panasonic, Samsung, LG, Gree, dan lainnya.',
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    icon: ThumbsUp,
    title: 'Harga Kompetitif',
    desc: 'Harga langsung dari distributor dengan penawaran terbaik di kelasnya.',
    color: 'bg-rose-100 text-rose-700',
  },
  {
    icon: Wrench,
    title: 'Layanan Instalasi',
    desc: 'Tim teknisi berpengalaman siap membantu pemasangan dan instalasi.',
    color: 'bg-orange-100 text-orange-700',
  },
  {
    icon: Users,
    title: '5,000+ Klien Puas',
    desc: 'Dipercaya oleh ribuan perusahaan, hotel, rumah sakit, dan pabrik di Indonesia.',
    color: 'bg-cyan-100 text-cyan-700',
  },
];

const stats = [
  { value: '13+', label: 'Tahun Pengalaman' },
  { value: '5,000+', label: 'Proyek Selesai' },
  { value: '50+', label: 'Brand Ternama' },
  { value: '34', label: 'Provinsi Terjangkau' },
];

export function WhyChooseUs() {
  return (
    <section id="keunggulan" className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-teal-50 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 bg-teal-500 rounded-full" />
            <span className="text-teal-700 text-sm font-medium">Mengapa Berkat Mandiri?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Keunggulan Kami
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Komitmen kami menghadirkan produk pendingin berkualitas tinggi dengan
            layanan terbaik untuk memastikan kepuasan pelanggan.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center p-5 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100"
            >
              <div className="text-3xl lg:text-4xl font-extrabold text-teal-700">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group p-5 rounded-xl border border-gray-200 hover:border-teal-200 hover:shadow-lg transition-all duration-300"
            >
              <div
                className={`w-11 h-11 rounded-lg ${feat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
              >
                <feat.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1.5">{feat.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
