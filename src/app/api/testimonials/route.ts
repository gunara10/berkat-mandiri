import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'

export async function GET() {
  try {
    const testimonials = await db.$queryRaw<Array<{
      id: string
      name: string
      company: string | null
      position: string | null
      content: string
      rating: number
      avatar: string | null
      isApproved: boolean
      createdAt: Date
    }>>`
      SELECT * FROM Testimonial WHERE isApproved = 1 ORDER BY RANDOM()
    `

    return NextResponse.json({ testimonials })
  } catch (error) {
    console.error('[API /testimonials] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}
