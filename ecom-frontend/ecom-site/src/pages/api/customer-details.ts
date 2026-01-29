import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { user_id, address, phone_number } = req.body;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customer-details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id,
          address,
          phone_number,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit customer details: ${response.statusText}`);
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
