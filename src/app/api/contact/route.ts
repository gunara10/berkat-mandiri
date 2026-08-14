import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface ContactBody {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

function validateBody(body: unknown): { valid: boolean; errors: string[]; data?: ContactBody } {
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

  if (!data.message || typeof data.message !== 'string' || !data.message.trim()) {
    errors.push('Message is required')
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
      phone: typeof data.phone === 'string' ? data.phone.trim() : undefined,
      subject: typeof data.subject === 'string' ? data.subject.trim() : undefined,
      message: (data.message as string).trim(),
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

    const contactMessage = await db.contactMessage.create({
      data: validation.data,
    })

    return NextResponse.json(
      { success: true, message: 'Message sent successfully', contactMessage },
      { status: 201 }
    )
  } catch (error) {
    console.error('[API /contact] Error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
