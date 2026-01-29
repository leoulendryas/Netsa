import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const userId = cookies.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID not found in cookies' });
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to create cart');
    }

    const data = await response.json();

    return res.status(200).json({ message: 'Cart created successfully', data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating cart' });
  }
}
