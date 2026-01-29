import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { product_id, quantity, price_at_time_of_addition , cart_id, size} = req.body;

    if (!product_id || !quantity || !price_at_time_of_addition) {
      return res.status(400).json({ message: 'Product ID, quantity, and price are required' });
    }

    const addCartItemResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cart_id,
        product_id,
        quantity,
        price_at_time_of_addition,
        size,
      }),
    });

    if (!addCartItemResponse.ok) {
      throw new Error('Failed to add item to cart');
    }

    const cartData = await addCartItemResponse.json();

    return res.status(200).json(cartData);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return res.status(500).json({ message: 'Error adding item to cart' });
  }
}
