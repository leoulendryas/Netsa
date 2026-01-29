"use client";
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import ProductCard from "@/components/common/smaller-product-card/page";
import FilterSection from "@/components/common/filter/page";
import Button5 from "@/components/common/button/button-five/page";
import Breadcrumb from "@/components/common/breadCrumb/page";
import Notification from "@/components/common/notification/page";
import React from "react";

// Map category_id to name
const categoryMap: Record<number, string> = {
  1: "Clothing",
  2: "Accessories",
  3: "Footwear",
  4: "Short",
  5: "Leggings",
  6: "New & Featured",
  7: "Men",
  8: "Women",
  9: "Kids",
  10: "Sale",
  12: "Shirts",
  13: "T-Shirts",
  14: "Pants",
  15: "Jeans",
  16: "Shorts",
  17: "Jackets",
  18: "Coats",
  19: "Sweaters",
  20: "Hoodies",
  21: "Dresses",
  22: "Skirts",
  23: "Socks",
};

const applyFilters = (products: any[], filters: Record<string, string[]>) => {
  return products.filter((product) => {
    // Category
    if (filters.Category?.length) {
          const productCategory = categoryMap[product.category_id] || "";
          const hasCategory = filters.Category.some(
            (cat) => productCategory.toLowerCase() === cat.toLowerCase() // exact match, ignore case
          );
          if (!hasCategory) return false;
    }

    // Color
    if (filters.Color?.length) {
      if (!filters.Color.includes(product.color)) return false;
    }

    // Fit
    if (filters.Fit?.length) {
      const productFits = product.Fits.map((f: any) => f.fit.toLowerCase());
      const hasFit = filters.Fit.some(f => productFits.includes(f.toLowerCase()));
      if (!hasFit) return false;
    }

    // Size
    if (filters.Size?.length) {
      const productSizes = product.Sizes.map((s: any) => s.size);
      const hasSize = filters.Size.some(s => productSizes.includes(s));
      if (!hasSize) return false;
    }

    // Price
    if (filters.Price?.length) {
      const [min, max] = filters.Price[0].split('-').map(Number);
      if (product.price < min || product.price > max) return false;
    }

    return true;
  });
};

interface ProductsPageProps {
  products: any[];
  title?: string;
  breadCrumbs: string;
  gender?: string;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ products = [], breadCrumbs, gender }) => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const params = useParams();

  // Update filteredProducts whenever filters change
  const handleFilterChange = (newFilters: Record<string, string[]>) => {
    setFilters(newFilters);
    const filtered = applyFilters(products, newFilters);
    setFilteredProducts(filtered);
  };

  const breadcrumbItems = [
    { label: `${breadCrumbs}`, href: '/products/men' },
  ];

  const handleProductClick = (productId: number) => {
    window.location.href = `/product/${productId}`;
  };

  const handleLoadMore = () => {
    // placeholder for future load more
  };

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <div className="p-4 mb-8">
        <div className="flex flex-col md:flex-row">
          {/* Filter Sidebar */}
          <div className="md:w-2/6 lg:w-1/6 w-full mb-4 md:mb-0">
            <button
              className="md:hidden bg-gray-200 p-2 w-full text-left mb-4"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              {isFilterOpen ? "Hide Filters" : "Show Filters"}
            </button>
            <div className={`${isFilterOpen ? "block" : "hidden"} md:block`}>
              <FilterSection onFilterChange={handleFilterChange} />
            </div>
          </div>

          {/* Products */}
          <div className="w-full md:w-full overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">{filteredProducts.length} Items</h2>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  imageUrl={product.ProductImages[0]?.image_url || ""}
                  name={product.name}
                  size={product.size || "N/A"}
                  color={product.color || "N/A"}
                  price={product.price}
                  liked={false}
                  onToggleLike={() => {}}
                  onImageClick={() => handleProductClick(product.id)}
                />
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <div className="py-2 px-8">
                <Button5 text="Load More" onClick={handleLoadMore} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </>
  );
};

export default ProductsPage;
