import type { Restaurant } from '../types';

const CUISINE_EMOJI: Record<string, string> = {
  indian: '🫓',
  northindian: '🫓',
  southindian: '🥞',
  chinese: '🥡',
  italian: '🍝',
  continental: '🍽️',
  mexican: '🌮',
  thai: '🍜',
  japanese: '🍣',
  korean: '🥘',
  seafood: '🦐',
  barbecue: '🍢',
  bakery: '🥐',
  dessert: '🍰',
  cafe: '☕',
  fastfood: '🍔',
  pizza: '🍕',
  street: '🍢',
  vegan: '🥗',
};

const CUISINE_IMAGE: Record<string, string> = {
  indian: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe',
  northindian: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe',
  southindian: 'https://images.unsplash.com/photo-1630383249896-424e482df921',
  chinese: 'https://images.unsplash.com/photo-1525755662778-989d0524087e',
  italian: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
  continental: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
  mexican: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47',
  thai: 'https://images.unsplash.com/photo-1559314809-0d155014e29e',
  japanese: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
  korean: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9',
  seafood: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47',
  barbecue: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd',
  bakery: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
  dessert: 'https://images.unsplash.com/photo-1551024506-0bccd828d307',
  cafe: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb',
  fastfood: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
  pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
  street: 'https://images.unsplash.com/photo-1601050690597-df0568f70950',
  vegan: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
};

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
  'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d',
];

export function cuisineEmoji(cuisine: string): string {
  const key = cuisine.toLowerCase().replace(/[^a-z]/g, '');
  return CUISINE_EMOJI[key] ?? '🍽️';
}

export function restaurantImage(restaurant: Pick<Restaurant, 'imageUrl' | 'cuisine' | 'id' | 'name'>): string | undefined {
  if (restaurant.imageUrl) return restaurant.imageUrl;
  const key = restaurant.cuisine?.toLowerCase().replace(/[^a-z]/g, '');
  const match = CUISINE_IMAGE[key ?? ''];
  if (match) return `${match}?auto=format&fit=crop&w=900&q=80`;
  return `${FALLBACK_IMAGES[(restaurant.id ?? 0) % FALLBACK_IMAGES.length]}?auto=format&fit=crop&w=900&q=80`;
}

export const IMAGE_SIZES = 'auto=format&fit=crop&q=80';
