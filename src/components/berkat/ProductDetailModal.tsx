'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ShoppingCart,
  Minus,
  Plus,
  Share2,
  Check,
  Truck,
  Shield,
  RotateCcw,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { toast } from 'sonner';
import { formatRupiah } from '@/lib/format';

const guarantees = [
  { icon: Shield, label: 'Garansi Resmi' },
  { icon: Truck, label: 'Pengiriman Aman' },
  { icon: RotateCcw, label: 'Bisa Tukar' },
];

type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  shortDesc?: string | null;
  description?: string | null;
  brand?: string | null;
  model?: string | null;
  specifications?: string | null;
  isNew: boolean;
  isFeatured: boolean;
  minOrder: number;
  unit: string;
  category: { name: string; slug: string } | null;
};

interface Props {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export function ProductDetailModal({ product, open, onClose }: Props) {
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  if (!product) return null;

  const specs: Record<string, string> = product.specifications
    ? JSON.parse(product.specifications)
    : {};

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : 0;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: qty,
      category: product.category?.name,
    });
    toast.success(`${qty} produk ditambahkan ke keranjang`, {
      description: product.name,
    });
    onClose();
  };

  const handleWhatsApp = () => {
    const msg = `Halo, saya tertarik dengan produk:\n\n*${product.name}*\nHarga: ${formatRupiah(product.price)}\nJumlah: ${qty} ${product.unit}\n\nMohon info ketersediaan dan cara pemesanan. Terima kasih!`;
    window.open(
      `https://wa.me/6281234567890?text=${encodeURIComponent(msg)}`,
      '_blank'
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 scrollbar-thin">
        <div className="grid md:grid-cols-2">
          {/* Image area */}
          <div className="relative aspect-square bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
            <span className="text-8xl opacity-20">❄️</span>
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {product.isNew && (
                <Badge className="bg-emerald-500 text-white">BARU</Badge>
              )}
              {product.isFeatured && (
                <Badge className="bg-amber-500 text-white flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> UNGGULAN
                </Badge>
              )}
              {discount > 0 && (
                <Badge className="bg-red-500 text-white">HEMAT {discount}%</Badge>
              )}
            </div>
          </div>

          {/* Info area */}
          <div className="p-6 flex flex-col">
            <DialogHeader className="mb-4">
              {product.brand && (
                <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">
                  {product.brand}
                  {product.model && ` · ${product.model}`}
                </span>
              )}
              <DialogTitle className="text-xl leading-snug">
                {product.name}
              </DialogTitle>
              {product.category && (
                <Badge variant="outline" className="w-fit text-xs">
                  {product.category.name}
                </Badge>
              )}
            </DialogHeader>

            {/* Price */}
            <div className="mb-4">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-extrabold text-teal-700">
                  {formatRupiah(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatRupiah(product.originalPrice)}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Minimal order: {product.minOrder} {product.unit}
              </p>
            </div>

            {/* Description */}
            {(product.shortDesc || product.description) && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Deskripsi
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.description || product.shortDesc}
                </p>
              </div>
            )}

            {/* Specs */}
            {Object.keys(specs).length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Spesifikasi
                </h4>
                <div className="rounded-lg border overflow-hidden">
                  {Object.entries(specs).map(([key, val], i) => (
                    <div
                      key={key}
                      className={`flex justify-between text-xs px-3 py-2 ${
                        i % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <span className="text-gray-500 font-medium">{key}</span>
                      <span className="text-gray-700">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator className="my-4" />

            {/* Guarantees */}
            <div className="flex items-center gap-4 mb-4">
              {guarantees.map((g) => (
                <div key={g.label} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <g.icon className="h-3.5 w-3.5 text-teal-600" />
                  {g.label}
                </div>
              ))}
            </div>

            {/* Quantity + Actions */}
            <div className="mt-auto space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Jumlah:</span>
                <div className="flex items-center border rounded-lg">
                  <button
                    className="h-9 w-9 flex items-center justify-center hover:bg-gray-100 rounded-l-lg transition-colors"
                    onClick={() => setQty(Math.max(product.minOrder, qty - 1))}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-12 text-center text-sm font-semibold">
                    {qty}
                  </span>
                  <button
                    className="h-9 w-9 flex items-center justify-center hover:bg-gray-100 rounded-r-lg transition-colors"
                    onClick={() => setQty(qty + 1)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <span className="text-xs text-gray-400">{product.unit}</span>
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-teal-600 hover:bg-teal-700 h-11"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Tambah ke Keranjang
                </Button>
                <Button
                  variant="outline"
                  className="h-11 px-4 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  onClick={handleWhatsApp}
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="w-full text-gray-400 hover:text-gray-600"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Link produk disalin!');
                }}
              >
                <Share2 className="h-3.5 w-3.5 mr-1.5" />
                Bagikan Produk
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};