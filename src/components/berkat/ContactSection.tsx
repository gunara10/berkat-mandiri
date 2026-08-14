'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Globe,
} from 'lucide-react';
import { toast } from 'sonner';

const contactInfo = [
  {
    icon: Phone,
    label: 'Telepon',
    value: '081220030092',
    desc: 'Senin - Sabtu, 08:00 - 17:00',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '+62 813-5000-3423',
    desc: 'Respon cepat 24 jam',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'info@berkatmandiripendingin.com',
    desc: 'Respon dalam 1x24 jam',
  },
  {
    icon: MapPin,
    label: 'Alamat',
    value: 'Jl. Raya Industri No. 88',
    desc: 'Kawasan Industri MM2100, Bekasi 17520',
  },
  {
    icon: Clock,
    label: 'Jam Operasional',
    value: 'Senin - Sabtu',
    desc: '08:00 - 17:00 WIB',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 200, damping: 20 },
  },
};

const formVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 150, damping: 20, delay: 0.2 },
  },
};

export function ContactSection() {
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Mohon isi nama, email, dan pesan');
      return;
    }
    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Pesan berhasil dikirim!', {
          description: 'Tim kami akan segera menghubungi Anda.',
        });
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        toast.error(data.error || 'Gagal mengirim pesan');
      }
    } catch {
      toast.error('Terjadi kesalahan saat mengirim pesan');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="kontak" className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-teal-50 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 bg-teal-600 rounded-full" />
            <span className="text-teal-800 text-sm font-medium">Hubungi Kami</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Siap <span className="text-teal-800">Membantu Anda</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hubungi tim kami untuk konsultasi gratis, penawaran harga, atau
            informasi lebih lanjut mengenai produk dan layanan kami.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact Info Cards */}
          <motion.div
            className="lg:col-span-2 space-y-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {contactInfo.map((info) => (
              <motion.div key={info.label} variants={cardVariants}>
                <Card className="border-gray-200 hover:border-teal-300 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
                      <info.icon className="h-5 w-5 text-teal-700" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium uppercase tracking-wider">
                        {info.label}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">
                        {info.value}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{info.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            variants={formVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Kirim Pesan
                </h3>
                <p className="text-sm text-gray-500 mb-5">
                  Isi formulir di bawah dan tim kami akan merespon dalam waktu 1x24 jam.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-700">Nama *</label>
                      <Input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Nama Anda"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">Email *</label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="email@contoh.com"
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-700">No. Telepon</label>
                      <Input
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="08xx-xxxx-xxxx"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">Subjek</label>
                      <Input
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        placeholder="Subjek pesan"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">Pesan *</label>
                    <Textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tulis pesan Anda di sini..."
                      className="mt-1"
                      rows={5}
                      required
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                      <Button
                        type="submit"
                        className="w-full bg-teal-600 hover:bg-teal-700 h-11"
                        disabled={sending}
                      >
                        {sending ? 'Mengirim...' : 'Kirim Pesan'}
                        <Send className="h-4 w-4 ml-1.5" />
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="button"
                        variant="outline"
                        className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 h-11"
                        onClick={() => {
                          const msg = `Halo, saya ingin bertanya tentang produk di Berkat Mandiri Pendingin.`;
                          window.open(
                            `https://wa.me/6281350003423?text=${encodeURIComponent(msg)}`,
                            '_blank'
                          );
                        }}
                      >
                        <MessageCircle className="h-4 w-4 mr-1.5" />
                        Chat WhatsApp
                      </Button>
                    </motion.div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}