'use client';

import { useState } from 'react';
import { Header } from './Header';
import { Hero } from './Hero';
import { CategoryGrid } from './CategoryGrid';
import { FeaturedProducts } from './FeaturedProducts';
import { WhyChooseUs } from './WhyChooseUs';
import { Testimonials } from './Testimonials';
import { ProductCatalog } from './ProductCatalog';
import { ProductDetailModal } from './ProductDetailModal';
import { CartDrawer } from './CartDrawer';
import { ContactSection } from './ContactSection';
import { Footer } from './Footer';
import { WhatsAppButton } from './WhatsAppButton';
import type { Category, Testimonial as TestimonialType } from '@prisma/client';

interface Props {
  categories: (Category & { _count: { products: number } })[];
  featuredProducts: any[];
  allProducts: any[];
  totalProducts: number;
  testimonials: TestimonialType[];
}

export function PageClient({
  categories,
  featuredProducts,
  allProducts,
  totalProducts,
  testimonials,
}: Props) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setDetailOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <CategoryGrid categories={categories} />
        <FeaturedProducts
          products={featuredProducts}
          onProductClick={handleProductClick}
        />
        <WhyChooseUs />
        <ProductCatalog
          categories={categories}
          initialProducts={allProducts}
          totalProducts={totalProducts}
          onProductClick={handleProductClick}
        />
        <Testimonials testimonials={testimonials} />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
      <CartDrawer />
      <ProductDetailModal
        product={selectedProduct}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  );
};
