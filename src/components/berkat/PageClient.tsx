'use client';

import { useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
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

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-600 z-[100] origin-left"
      style={{ scaleX }}
    />
  );
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
      <ScrollProgress />
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
      <Footer />\n      <WhatsAppButton />
      <CartDrawer />\n      <ProductDetailModal
        product={selectedProduct}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  );
}