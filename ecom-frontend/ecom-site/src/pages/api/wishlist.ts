import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`, {
            method: 'GET',
            headers: {
                'Authorization': req.headers.authorization || ''
            }
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } else {
        res.status(405).end();
    }
}
