import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const cookies = req.headers.cookie || '';
    const parsedCookies = cookie.parse(cookies);
    const userId = parsedCookies.userId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID not found in cookies' });
    }

    const { total_amount, payment_method, order_status, items, cart_id } = req.body;

    try {
      // Make the request to your backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          total_amount,
          payment_method,
          order_status,
          items,
          cart_id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create order: ${response.statusText}`);
      }

      const data = await response.json();
      res.status(200).json(data); 
    } catch (error) {
      res.status(500).json({ error: `500 error` });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
