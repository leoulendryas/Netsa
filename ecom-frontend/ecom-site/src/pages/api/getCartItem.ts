import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const userId = cookies.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID not found in cookies' });
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cart data');
    }

    const cartData = await response.json();

    return res.status(200).json(cartData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching cart data' });
  }
}
