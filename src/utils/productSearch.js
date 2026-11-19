export function matchesProductQuery(product, query) {
  const term = query.trim().toLowerCase()
  if (!term) return true

  return [
    product.name,
    product.subtitle,
    product.shade,
    product.categoryLabel,
    product.description,
    ...(product.highlights || []),
  ]
    .join(' ')
    .toLowerCase()
    .includes(term)
}
