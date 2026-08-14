'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Snowflake, Wind, Droplets, Wrench, Building2, Factory } from 'lucide-react';
import Image from 'next/image';
import type { Category } from '@prisma/client';

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'ac-split': Wind,
  'kompresor': Snowflake,
  'refrigerant': Droplets,
  'spare-part-ac': Wrench,
  'chiller-vrv-vrf': Building2,
  'mesin-pendingin': Factory,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface Props {
  categories: (Category & { _count?: { products: number } })[];
}

export function CategoryGrid({ categories }: Props) {
  const scrollToProducts = (slug?: string) => {
    const el = document.querySelector('#produk');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      // Dispatch custom event for category filter
      if (slug) {
        window.dispatchEvent(new CustomEvent('filter-category', { detail: slug }));
      }
    }
  };

  return (
    <section id="kategori" className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="bg-teal-50 text-teal-700 mb-3">
            Kategori Produk
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Solusi Pendingin <span className="text-teal-700">Lengkap</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Temukan berbagai macam produk pendingin berkualitas tinggi dari brand-brand
            terkemuka dunia untuk kebutuhan residensial, komersial, dan industri.
          </p>
        </div>

        {/* Category cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.slug] || Snowflake;
            const count = (cat as any)._count?.products || 0;
            return (
              <motion.div key={cat.id} variants={itemVariants}>
                <Card
                  className="group cursor-pointer border-2 border-transparent hover:border-teal-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                  onClick={() => scrollToProducts(cat.slug)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="relative w-full aspect-square mb-3 rounded-xl overflow-hidden bg-gray-100">
                      {cat.image ? (
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-teal-50">
                          <Icon className="h-10 w-10 text-teal-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="font-semibold text-sm text-gray-900 group-hover:text-teal-700 transition-colors line-clamp-2">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">{count} produk</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
