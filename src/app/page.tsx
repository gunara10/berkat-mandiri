import { db } from '@/lib/db';
import { PageClient } from '@/components/berkat/PageClient';

export const revalidate = 60;

export default async function HomePage() {
  // Fetch categories with product count
  const categories = await db.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { products: true } } },
  });

  // Fetch featured products (limited to 8)
  const featuredProducts = await db.product.findMany({
    where: { isFeatured: true, inStock: true },
    include: { category: { select: { name: true, slug: true } } },
    orderBy: { createdAt: 'desc' },
    take: 8,
  });

  // Fetch initial products for catalog (first page)
  const totalProducts = await db.product.count({ where: { inStock: true } });
  const allProducts = await db.product.findMany({
    where: { inStock: true },
    include: { category: { select: { name: true, slug: true } } },
    orderBy: { createdAt: 'desc' },
    take: 12,
  });

  // Fetch approved testimonials
  const testimonials = await db.testimonial.findMany({
    where: { isApproved: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <PageClient
      categories={JSON.parse(JSON.stringify(categories))}
      featuredProducts={JSON.parse(JSON.stringify(featuredProducts))}
      allProducts={JSON.parse(JSON.stringify(allProducts))}
      totalProducts={totalProducts}
      testimonials={JSON.parse(JSON.stringify(testimonials))}
    />
  );
}
