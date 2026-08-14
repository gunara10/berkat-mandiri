import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'newest'
    const featured = searchParams.get('featured')
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)))
    const viewId = searchParams.get('view')

    // Increment view count if view=id is provided
    if (viewId) {
      await db.product.update({
        where: { id: viewId },
        data: { viewCount: { increment: 1 } },
      }).catch(() => {
        // Silently ignore if product not found
      })
    }

    // Build where clause
    const where: Prisma.ProductWhereInput = {
      inStock: true,
    }

    if (category) {
      where.category = { slug: category }
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { shortDesc: { contains: search } },
        { description: { contains: search } },
        { brand: { contains: search } },
        { model: { contains: search } },
      ]
    }

    if (featured === 'true') {
      where.isFeatured = true
    }

    // Build order clause
    let orderBy: Prisma.ProductOrderByWithRelationInput
    switch (sort) {
      case 'price-asc':
        orderBy = { price: 'asc' }
        break
      case 'price-desc':
        orderBy = { price: 'desc' }
        break
      case 'name':
        orderBy = { name: 'asc' }
        break
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' }
        break
    }

    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: {
            select: { id: true, name: true, slug: true, image: true },
          },
        },
      }),
      db.product.count({ where }),
    ])

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error('[API /products] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
