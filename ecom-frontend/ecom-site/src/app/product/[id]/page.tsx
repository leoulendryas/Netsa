"use client";
import { useState, useEffect } from 'react';
import ProductDetails from '@/components/common/product-details/page';
import Header from '@/components/common/header/page';
import Footer from '@/components/common/footer/page';
import ClientLayout from '../../ClientLayout';

// types.ts

interface ProductImage {
  id: number;
  image_url: string;
  position: string;
  position_sequence: number;
}

interface Size {
  id: number;
  size: string;
}

interface Fit {
  id: number;
  fit: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  color: string;
  price: string;
  is_featured: boolean;
  is_new: boolean;
  gender: string | null;
  ProductImages: ProductImage[];
  category_id: number;
  Sizes: Size[];
  Fits: Fit[];
}

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const { id } = params;
        if (id) {
          const response = await fetch(`/api/getSingleProduct/${id}`);
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          const data = await response.json();
          setProduct(data);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProductDetails();
  }, [params]);

  if (!product) return <div>Loading...</div>;

  return (
    <ClientLayout>
      <div className="mb-2">
        <ProductDetails product={product} />
      </div>
    </ClientLayout>
  );
}
