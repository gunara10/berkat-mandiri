'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

type Testimonial = {
  id: string;
  name: string;
  company?: string | null;
  position?: string | null;
  content: string;
  rating: number;
};

interface Props {
  testimonials: Testimonial[];
}

export function Testimonials({ testimonials }: Props) {
  return (
    <section id="testimoni" className="py-16 lg:py-24 bg-gray-50/80">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-teal-50 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 bg-teal-500 rounded-full" />
            <span className="text-teal-700 text-sm font-medium">Testimoni Pelanggan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Dipercaya <span className="text-teal-700">Ribuan Klien</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Kepuasan pelanggan adalah prioritas utama kami. Berikut beberapa
            testimoni dari klien yang telah bekerja sama dengan kami.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="h-full border-gray-200 hover:border-teal-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-teal-200 mb-4" />
                  <p className="text-sm text-gray-600 leading-relaxed mb-5 line-clamp-4">
                    &ldquo;{t.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`h-4 w-4 ${
                          j < t.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-teal flex items-center justify-center text-white font-bold text-sm">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-gray-900">{t.name}</div>
                      {(t.position || t.company) && (
                        <div className="text-xs text-gray-400">
                          {t.position}{t.position && t.company && ' · '}{t.company}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
