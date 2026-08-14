# Task 5 - API Routes Builder

## Files Created
1. `src/app/api/products/route.ts` - GET endpoint
2. `src/app/api/categories/route.ts` - GET endpoint
3. `src/app/api/inquiry/route.ts` - POST endpoint
4. `src/app/api/contact/route.ts` - POST endpoint
5. `src/app/api/testimonials/route.ts` - GET endpoint

## Details

### /api/products
- Query params: `category` (slug), `search`, `sort` (price-asc|price-desc|newest|name), `featured` (boolean), `page`, `limit` (default 12, max 50)
- `?view=<id>` increments viewCount silently
- Returns products with category relation + pagination metadata
- Filters in-stock products only

### /api/categories
- Returns all categories ordered by `sortOrder`
- Includes `_count.products` (in-stock only) as `productCount`

### /api/inquiry
- Validates: name, email (regex), phone, items (min 1, each with productId + quantity)
- Verifies all productIds exist before creating
- Creates Inquiry + InquiryItem records in one transaction
- Returns created inquiry with items and product details

### /api/contact
- Validates: name, email (regex), message (required); phone, subject (optional)
- Creates ContactMessage record
- Returns 201 on success

### /api/testimonials
- Returns only `isApproved = true` testimonials
- Ordered randomly via raw SQL `ORDER BY RANDOM()`

## Status
All routes pass `bun run lint` with zero errors.