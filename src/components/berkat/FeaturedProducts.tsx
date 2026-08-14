'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingCart, Star, Eye } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { toast } from 'sonner';
import { formatRupiah } from '@/lib/format';

type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  shortDesc?: string | null;
  brand?: string | null;
  isNew: boolean;
  images?: string | null;
  category?: { name: string } | null;
};

interface Props {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export function FeaturedProducts({ products, onProductClick }: Props) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      category: product.category?.name,
    });
    toast.success('Ditambahkan ke keranjang', {
      description: product.name,
    });
  };

  const scrollToProducts = () => {
    document.querySelector('#produk')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-16 lg:py-24 bg-gray-50/80">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
          <div>
            <Badge variant="secondary" className="bg-teal-50 text-teal-700 mb-3">
              Pilihan Terbaik
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Produk <span className="text-teal-700">Unggulan</span>
            </h2>
          </div>
          <Button
            variant="outline"
            className="border-teal-200 text-teal-700 hover:bg-teal-50 self-start sm:self-auto"
            onClick={scrollToProducts}
          >
            Lihat Semua Produk
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Card
                className="group cursor-pointer border border-gray-200 hover:border-teal-300 hover:shadow-xl transition-all duration-300 overflow-hidden h-full"
                onClick={() => onProductClick(product)}
              >
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
                    <span className="text-5xl opacity-30">❄️</span>
                  </div>
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {product.isNew && (
                      <Badge className="bg-emerald-500 text-white text-[10px] px-2">
                        BARU
                      </Badge>
                    )}
                    {product.originalPrice && product.originalPrice > product.price && (
                      <Badge className="bg-amber-500 text-white text-[10px] px-2">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </Badge>
                    )}
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-9 w-9 rounded-full shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        onProductClick(product);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      className="h-9 w-9 rounded-full bg-teal-600 hover:bg-teal-700 shadow-md"
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  {product.brand && (
                    <p className="text-xs font-medium text-teal-600 mb-1 uppercase tracking-wider">
                      {product.brand}
                    </p>
                  )}
                  <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-2 group-hover:text-teal-700 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold text-teal-700">
                      {formatRupiah(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatRupiah(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};