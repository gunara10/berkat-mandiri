'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  ShoppingCart,
  Eye,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  PackageSearch,
  Grid3X3,
  List,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { toast } from 'sonner';
import { formatRupiah } from '@/lib/format';
import type { Category } from '@prisma/client';

type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  shortDesc?: string | null;
  brand?: string | null;
  isNew: boolean;
  isFeatured: boolean;
  images?: string | null;
  category: { name: string; slug: string } | null;
};

interface Props {
  categories: Category[];
  initialProducts: Product[];
  totalProducts: number;
  onProductClick: (product: Product) => void;
}

const PAGE_SIZE = 12;

export function ProductCatalog({ categories, initialProducts, totalProducts, onProductClick }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [total, setTotal] = useState(totalProducts);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const searchTimer = useRef<NodeJS.Timeout>();
  const addItem = useCartStore((s) => s.addItem);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: PAGE_SIZE.toString(),
        sort,
      });
      if (category !== 'all') params.set('category', category);
      if (search.trim()) params.set('search', search.trim());

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        setTotal(data.total);
      }
    } catch {
      toast.error('Gagal memuat produk');
    } finally {
      setLoading(false);
    }
  }, [page, sort, category, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Listen for category filter events from CategoryGrid
  useEffect(() => {
    const handler = (e: Event) => {
      const slug = (e as CustomEvent).detail;
      setCategory(slug);
      setPage(1);
    };
    window.addEventListener('filter-category', handler);
    return () => window.removeEventListener('filter-category', handler);
  }, []);

  const handleSearch = (val: string) => {
    setSearch(val);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setPage(1), 400);
  };

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    setPage(1);
  };

  const handleSortChange = (val: string) => {
    setSort(val);
    setPage(1);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      category: product.category?.name,
    });
    toast.success('Ditambahkan ke keranjang', { description: product.name });
  };

  return (
    <section id="produk" className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <Badge variant="secondary" className="bg-teal-50 text-teal-700 mb-3">
            Katalog Produk
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Semua <span className="text-teal-700">Produk</span> Kami
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Jelajahi koleksi lengkap produk pendingin berkualitas tinggi.
            Gunakan filter untuk menemukan produk yang Anda butuhkan.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari produk, brand, atau model..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 h-11"
              />
              {search && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => { setSearch(''); setPage(1); }}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="sm:hidden h-11"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full sm:w-48 h-11">
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.slug}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sort} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full sm:w-44 h-11">
                  <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Terbaru</SelectItem>
                  <SelectItem value="name">Nama A-Z</SelectItem>
                  <SelectItem value="price-asc">Harga Terendah</SelectItem>
                  <SelectItem value="price-desc">Harga Tertinggi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Active filters & info */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              {category !== 'all' && (
                <Badge variant="secondary" className="bg-teal-50 text-teal-700 gap-1">
                  {categories.find(c => c.slug === category)?.name}
                  <button onClick={() => setCategory('all')}><X className="h-3 w-3" /></button>
                </Badge>
              )}
              {search && (
                <Badge variant="secondary" className="gap-1">
                  &quot;{search}&quot;
                  <button onClick={() => { setSearch(''); setPage(1); }}><X className="h-3 w-3" /></button>
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">{total} produk</span>
              <div className="hidden sm:flex items-center gap-1 border rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-teal-100 text-teal-700' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-teal-100 text-teal-700' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            <p className="text-sm text-gray-500">Memuat produk...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <PackageSearch className="h-12 w-12 text-gray-300" />
            <p className="text-gray-500 font-medium">Produk tidak ditemukan</p>
            <p className="text-sm text-gray-400">Coba ubah filter atau kata kunci pencarian Anda.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5"
          >
            <AnimatePresence mode="popLayout">
              {products.map((product) => (
                <ProductCardGrid
                  key={product.id}
                  product={product}
                  onClick={() => onProductClick(product)}
                  onAddToCart={(e) => handleAddToCart(e, product)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div layout className="space-y-3">
            <AnimatePresence mode="popLayout">
              {products.map((product) => (
                <ProductCardList
                  key={product.id}
                  product={product}
                  onClick={() => onProductClick(product)}
                  onAddToCart={(e) => handleAddToCart(e, product)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .map((p, i, arr) => {
                const prev = arr[i - 1];
                const showEllipsis = prev !== undefined && p - prev > 1;
                return (
                  <span key={p} className="flex items-center gap-2">
                    {showEllipsis && <span className="text-gray-400">...</span>}
                    <Button
                      variant={page === p ? 'default' : 'outline'}
                      size="icon"
                      className={`h-9 w-9 ${page === p ? 'bg-teal-600 hover:bg-teal-700' : ''}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </Button>
                  </span>
                );
              })}
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

function ProductCardGrid({ product, onClick, onAddToCart }: {
  product: Product;
  onClick: () => void;
  onAddToCart: (e: React.MouseEvent) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="group cursor-pointer border border-gray-200 hover:border-teal-300 hover:shadow-xl transition-all duration-300 overflow-hidden h-full"
        onClick={onClick}
      >
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
            <span className="text-4xl opacity-30">❄️</span>
          </div>
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <Badge className="bg-emerald-500 text-white text-[10px] px-1.5 py-0">BARU</Badge>
            )}
            {product.isFeatured && (
              <Badge className="bg-amber-500 text-white text-[10px] px-1.5 py-0 flex items-center gap-0.5">
                <Sparkles className="h-2.5 w-2.5" />
                UNGGULAN
              </Badge>
            )}
            {product.originalPrice && product.originalPrice > product.price && (
              <Badge className="bg-red-500 text-white text-[10px] px-1.5 py-0">
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </Badge>
            )}
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <Button
              size="icon"
              variant="secondary"
              className="h-9 w-9 rounded-full shadow-md"
              onClick={(e) => { e.stopPropagation(); onClick(); }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              className="h-9 w-9 rounded-full bg-teal-600 hover:bg-teal-700 shadow-md"
              onClick={onAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardContent className="p-3">
          {product.brand && (
            <p className="text-[10px] font-semibold text-teal-600 mb-0.5 uppercase tracking-wider">
              {product.brand}
            </p>
          )}
          <h3 className="font-semibold text-xs text-gray-900 line-clamp-2 mb-1.5 group-hover:text-teal-700 transition-colors leading-snug min-h-[2.25rem]">
            {product.name}
          </h3>
          {product.category && (
            <p className="text-[10px] text-gray-400 mb-1.5">{product.category.name}</p>
          )}
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold text-teal-700">
              {formatRupiah(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] text-gray-400 line-through">
                {formatRupiah(product.originalPrice)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ProductCardList({ product, onClick, onAddToCart }: {
  product: Product;
  onClick: () => void;
  onAddToCart: (e: React.MouseEvent) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Card
        className="group cursor-pointer border border-gray-200 hover:border-teal-300 hover:shadow-lg transition-all duration-300"
        onClick={onClick}
      >
        <CardContent className="p-4 flex gap-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center shrink-0 relative overflow-hidden">
            <span className="text-3xl opacity-30">❄️</span>
            <div className="absolute top-1 left-1 flex flex-col gap-0.5">
              {product.isNew && <Badge className="bg-emerald-500 text-white text-[8px] px-1 py-0">BARU</Badge>}
              {product.originalPrice && product.originalPrice > product.price && (
                <Badge className="bg-red-500 text-white text-[8px] px-1 py-0">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </Badge>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {product.brand && (
                  <span className="text-[10px] font-semibold text-teal-600 uppercase tracking-wider">
                    {product.brand}
                  </span>
                )}
                {product.category && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    {product.category.name}
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-teal-700 transition-colors">
                {product.name}
              </h3>
              {product.shortDesc && (
                <p className="text-xs text-gray-400 mt-1 line-clamp-2 hidden sm:block">
                  {product.shortDesc}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between mt-2">
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
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={(e) => { e.stopPropagation(); onClick(); }}
                >
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  Detail
                </Button>
                <Button
                  size="sm"
                  className="h-8 text-xs bg-teal-600 hover:bg-teal-700"
                  onClick={onAddToCart}
                >
                  <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                  Keranjang
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
