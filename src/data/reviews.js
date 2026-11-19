const reviewTemplates = [
  {
    rating: 5,
    title: 'Even better in person',
    body: (product) =>
      `The finish is so much more considered in person. I wore ${product.name} for a long weekend and the colour still looked fresh when I got home.`,
    name: 'Salma B.',
    initials: 'SB',
    date: '14 November 2026',
  },
  {
    rating: 5,
    title: 'The sizing makes it',
    body: () =>
      'Ten sizes means every nail gets a close fit — no lifting at the edges and nothing feels tight. I have already ordered a second set.',
    name: 'Yasmine K.',
    initials: 'YK',
    date: '2 November 2026',
  },
  {
    rating: 4,
    title: 'Beautiful, with one small note',
    body: (product) =>
      `The colour and packaging are beautiful. I would love an extra tip in the middle sizes, but the set still lasted a full week and I am reusing it this weekend.`,
    name: 'Lina R.',
    initials: 'LR',
    date: '28 October 2026',
  },
  {
    rating: 5,
    title: 'A new weekly ritual',
    body: () =>
      'Application took ten minutes and felt like a proper ritual. The prep pad and instructions were thoughtful, and there was no damage when I removed them.',
    name: 'Nour A.',
    initials: 'NA',
    date: '19 October 2026',
  },
  {
    rating: 5,
    title: 'The packaging is a gift in itself',
    body: (product) =>
      `I bought ${product.name} as a gift and ended up keeping it. The linen pouch, the little sun seal, the handwritten note — it all feels considered.`,
    name: 'Maya T.',
    initials: 'MT',
    date: '8 October 2026',
  },
  {
    rating: 4,
    title: 'Wear time surprised me',
    body: () =>
      'I am hard on my hands and expected a few days at most. With the prep steps, my set made it through eight days before I decided to change the colour.',
    name: 'Inès H.',
    initials: 'IH',
    date: '29 September 2026',
  },
]

export function getProductReviews(product) {
  return reviewTemplates.map((review, index) => ({
    id: `${product.id}-review-${index + 1}`,
    ...review,
    body: review.body(product),
    verified: true,
    shade: product.shade,
  }))
}

export function getRatingBreakdown(rating) {
  const five = Math.round(((rating - 3) / 2) * 100)
  const remaining = 100 - five
  const four = Math.round(remaining * 0.58)
  const three = Math.round((remaining - four) * 0.55)
  const two = Math.round((remaining - four - three) * 0.55)
  const one = Math.max(0, remaining - four - three - two)

  return [
    { stars: 5, percent: five },
    { stars: 4, percent: four },
    { stars: 3, percent: three },
    { stars: 2, percent: two },
    { stars: 1, percent: one },
  ]
}
