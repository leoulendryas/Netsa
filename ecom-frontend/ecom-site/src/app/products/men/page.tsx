"use client";
import { useEffect, useState } from "react";
import ProductsPage from "@/components/products/page";
import ClientLayout from '../../ClientLayout';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  const gender = "Men"; 
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/filteredProducts?gender=${gender}`);
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [gender]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <ClientLayout>
      <ProductsPage products={products} breadCrumbs={`Mens`} gender={gender} />
    </ClientLayout>
  );
}
