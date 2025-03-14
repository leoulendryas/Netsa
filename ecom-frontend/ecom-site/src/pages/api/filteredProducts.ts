import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const queryString = req.url?.split('?')[1] || '';

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?${queryString}`, {
      method: 'GET',
    });

    if (!response.ok) {
      return res.status(response.status).json({ message: `Error fetching products: ${response.statusText}` });
    }

    const products = await response.json();
    return res.status(200).json(products);

  } catch (error) {
    console.error('Internal Server Error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
}
