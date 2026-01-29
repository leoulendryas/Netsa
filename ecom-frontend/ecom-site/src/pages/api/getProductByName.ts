import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { name } = req.query; // Use req.query to get the name from query parameters

        if (!name) {
            return res.status(400).json({ message: 'Product name is required.' });
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/by-name?name=${name}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                return res.status(response.status).json({ message: data.message || 'Error fetching product.' });
            }

            res.status(200).json(data);
        } catch (error) {
            console.error('Error fetching product:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
}
