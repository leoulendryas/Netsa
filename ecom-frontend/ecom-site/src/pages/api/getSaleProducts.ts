import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sale-products`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sale products. Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching sale products:', error);
    res.status(500).json({ error: 'Failed to fetch sale products' });
  }
}
