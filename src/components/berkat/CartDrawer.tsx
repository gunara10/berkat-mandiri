'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  MessageCircle,
  Send,
  Package,
  ArrowRight,
  X,
} from 'lucide-react';
import { useCartStore, type CartItem } from '@/stores/cart-store';
import { toast } from 'sonner';
import { formatRupiah } from '@/lib/format';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart, getTotal, getTotalItems } =
    useCartStore();
  const [showInquiry, setShowInquiry] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' });

  const total = getTotal();
  const count = getTotalItems();

  const handleWhatsAppOrder = () => {
    if (items.length === 0) return;
    const lines = items.map(
      (item) => `• ${item.name} x${item.quantity} = ${formatRupiah(item.price * item.quantity)}`
    );
    const msg = `Halo, saya ingin memesan:\n\n${lines.join('\n')}\n\nTotal: ${formatRupiah(total)}\n\nMohon info ketersediaan dan ongkos kirim. Terima kasih!`;
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleSubmitInquiry = async () => {
    if (!form.name || !form.email || !form.phone) {
      toast.error('Mohon isi nama, email, dan nomor telepon');
      return;
    }
    setSending(true);
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            notes: '',
          })),
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Permintaan penawaran berhasil dikirim!', {
          description: 'Tim kami akan menghubungi Anda dalam 1x24 jam.',
        });
        clearCart();
        setShowInquiry(false);
        closeCart();
      } else {
        toast.error(data.error || 'Gagal mengirim permintaan');
      }
    } catch {
      toast.error('Terjadi kesalahan saat mengirim permintaan');
    } finally {
      setSending(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        {showInquiry ? (
          // Inquiry Form View
          <>
            <SheetHeader className="p-4 pb-2 border-b">
              <SheetTitle className="text-base">Permintaan Penawaran</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
              <p className="text-sm text-gray-500">
                Lengkapi data berikut untuk mendapatkan penawaran harga terbaik dari tim kami.
              </p>
              <div>
                <label className="text-xs font-medium text-gray-700">Nama Lengkap *</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nama Anda"
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-700">Email *</label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="email@contoh.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700">No. Telepon *</label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="08xx-xxxx-xxxx"
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Perusahaan</label>
                <Input
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Nama perusahaan (opsional)"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Catatan</label>
                <Textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Catatan tambahan..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              {/* Order summary in inquiry */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Ringkasan Pesanan</h4>
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs text-gray-600 py-1">
                    <span className="flex-1 truncate mr-2">{item.name} x{item.quantity}</span>
                    <span>{formatRupiah(item.price * item.quantity)}</span>
                  </div>
                ))}
                <Separator className="my-2" />
                <div className="flex justify-between text-sm font-bold">
                  <span>Total</span>
                  <span className="text-teal-700">{formatRupiah(total)}</span>
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowInquiry(false)}
              >
                Kembali
              </Button>
              <Button
                className="flex-1 bg-teal-600 hover:bg-teal-700"
                onClick={handleSubmitInquiry}
                disabled={sending}
              >
                {sending ? 'Mengirim...' : 'Kirim Penawaran'}
                <Send className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </>
        ) : (
          // Cart View
          <>
            <SheetHeader className="p-4 pb-2 border-b">
              <SheetTitle className="text-base flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Keranjang Belanja
                {count > 0 && (
                  <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-semibold">
                    {count} item
                  </span>
                )}
              </SheetTitle>
            </SheetHeader>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Package className="h-8 w-8 text-gray-300" />
                </div>
                <p className="font-medium text-gray-700">Keranjang kosong</p>
                <p className="text-sm text-gray-400 mt-1">
                  Tambahkan produk untuk memulai pemesanan.
                </p>
                <Button
                  variant="outline"
                  className="mt-4 border-teal-200 text-teal-700"
                  onClick={closeCart}
                >
                  Jelajahi Produk
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto scrollbar-thin">
                  <div className="p-4 space-y-3">
                    {items.map((item) => (
                      <CartItemRow
                        key={item.id}
                        item={item}
                        onRemove={() => removeItem(item.id)}
                        onUpdateQty={(q) => updateQuantity(item.id, q)}
                      />
                    ))}
                  </div>
                </div>

                <div className="border-t p-4 space-y-3">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal ({count} item)</span>
                    <span>{formatRupiah(total)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-teal-700">{formatRupiah(total)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700 h-10 text-sm"
                      onClick={handleWhatsAppOrder}
                    >
                      <MessageCircle className="h-4 w-4 mr-1.5" />
                      WhatsApp
                    </Button>
                    <Button
                      className="bg-teal-600 hover:bg-teal-700 h-10 text-sm"
                      onClick={() => setShowInquiry(true)}
                    >
                      <Send className="h-4 w-4 mr-1.5" />
                      Minta Penawaran
                    </Button>
                  </div>
                  <button
                    className="w-full text-center text-xs text-gray-400 hover:text-red-500 transition-colors"
                    onClick={clearCart}
                  >
                    Kosongkan Keranjang
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function CartItemRow({
  item,
  onRemove,
  onUpdateQty,
}: {
  item: CartItem;
  onRemove: () => void;
  onUpdateQty: (q: number) => void;
}) {
  return (
    <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center shrink-0">
        <span className="text-lg opacity-40">❄️</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-medium text-gray-900 line-clamp-2 pr-2">
            {item.name}
          </h4>
          <button
            onClick={onRemove}
            className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
        {item.category && (
          <p className="text-[10px] text-gray-400 mt-0.5">{item.category}</p>
        )}
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center border rounded-md">
            <button
              className="h-7 w-7 flex items-center justify-center hover:bg-gray-100 rounded-l-md text-gray-500"
              onClick={() => onUpdateQty(item.quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center text-xs font-semibold">{item.quantity}</span>
            <button
              className="h-7 w-7 flex items-center justify-center hover:bg-gray-100 rounded-r-md text-gray-500"
              onClick={() => onUpdateQty(item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <span className="text-sm font-bold text-teal-700">
            {formatRupiah(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
