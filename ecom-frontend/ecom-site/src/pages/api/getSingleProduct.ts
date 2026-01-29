import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`);
    
    if (!response.ok) {
      return res.status(response.status).json({ message: 'Error fetching product details' });
    }

    const product = await response.json();
    return res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product details:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
