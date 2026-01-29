import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`);
    const product = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Error fetching product details' });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
}
