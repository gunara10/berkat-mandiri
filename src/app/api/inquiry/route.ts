import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface InquiryItemInput {
  productId: string
  quantity: number
  notes?: string
}

interface InquiryBody {
  name: string
  email: string
  phone: string
  company?: string
  address?: string
  message?: string
  items: InquiryItemInput[]
}

function validateBody(body: unknown): { valid: boolean; errors: string[]; data?: InquiryBody } {
  const errors: string[] = []

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Request body is required'] }
  }

  const data = body as Record<string, unknown>

  if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
    errors.push('Name is required')
  }

  if (!data.email || typeof data.email !== 'string' || !data.email.trim()) {
    errors.push('Email is required')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.push('Email format is invalid')
  }

  if (!data.phone || typeof data.phone !== 'string' || !data.phone.trim()) {
    errors.push('Phone is required')
  }

  if (!Array.isArray(data.items) || data.items.length === 0) {
    errors.push('At least one inquiry item is required')
  } else {
    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i] as Record<string, unknown>
      if (!item.productId || typeof item.productId !== 'string') {
        errors.push(`Item ${i + 1}: productId is required`)
      }
      if (typeof item.quantity !== 'number' || item.quantity < 1) {
        errors.push(`Item ${i + 1}: quantity must be at least 1`)
      }
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  return {
    valid: true,
    errors: [],
    data: {
      name: (data.name as string).trim(),
      email: (data.email as string).trim(),
      phone: (data.phone as string).trim(),
      company: typeof data.company === 'string' ? data.company.trim() : undefined,
      address: typeof data.address === 'string' ? data.address.trim() : undefined,
      message: typeof data.message === 'string' ? data.message.trim() : undefined,
      items: (data.items as InquiryItemInput[]).map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        notes: item.notes,
      })),
    },
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = validateBody(body)

    if (!validation.valid || !validation.data) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      )
    }

    const { items, ...inquiryData } = validation.data

    // Verify all products exist
    const productIds = items.map((item) => item.productId)
    const existingProducts = await db.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true },
    })

    const existingIds = new Set(existingProducts.map((p) => p.id))
    const missingIds = productIds.filter((id) => !existingIds.has(id))
    if (missingIds.length > 0) {
      return NextResponse.json(
        { error: 'Some products not found', details: { missingIds } },
        { status: 400 }
      )
    }

    const inquiry = await db.inquiry.create({
      data: {
        ...inquiryData,
        items: {
          create: items,
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, price: true, unit: true },
            },
          },
        },
      },
    })

    return NextResponse.json(
      { success: true, message: 'Inquiry submitted successfully', inquiry },
      { status: 201 }
    )
  } catch (error) {
    console.error('[API /inquiry] Error:', error)
    return NextResponse.json(
      { error: 'Failed to submit inquiry' },
      { status: 500 }
    )
  }
}
