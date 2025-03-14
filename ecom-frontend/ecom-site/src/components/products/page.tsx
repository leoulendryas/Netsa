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

const useWishlist = () => {
  const [wishlist, setWishlist] = useState<
    { productId: number; wishlistId: number }[]
  >([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = Cookies.get("token");
      if (!token) return;

      try {
        const response = await fetch("/api/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const wishlist = await response.json();
          const wishlistItems = wishlist.map(
            (item: { product_id: number; id: number }) => ({
              productId: item.product_id,
              wishlistId: item.id,
            })
          );
          setWishlist(wishlistItems);
        } else {
          console.error("Failed to fetch wishlist");
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlist();
  }, []);

  return { wishlist, setWishlist };
};

interface ProductImage {
  id: number;
  image_url: string;
  position: string;
  position_sequence: number;
}

interface Product {
  id: number;
  name: string;
  size: string;
  color: string;
  price: string;
  liked: boolean;
  ProductImages: ProductImage[];
}

interface ProductsPageProps {
  products: Product[];
  title?: string;
  breadCrumbs: string;
  gender?: string;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ products = [], breadCrumbs, gender }) => {
  // Ensure filteredProducts is always initialized as an array
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const params = useParams();
  const id = params?.id as string | undefined;

  // Safely map over products, ensuring it's an array
  const [likedProducts, setLikedProducts] = useState<boolean[]>(
    Array.isArray(products) ? products.map((product) => product.liked) : []
  );
  const { wishlist, setWishlist } = useWishlist();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const updatedLikes = filteredProducts.map((product) =>
      wishlist.some((item) => item.productId === product.id)
    );
    setLikedProducts(updatedLikes);
  }, [filteredProducts, wishlist]);

  const toggleLike = useCallback(
    async (productId: number, index: number) => {
      const token = Cookies.get("token");
      const userId = Cookies.get("userId");

      if (!token || !userId) {
        localStorage.setItem("pendingLike", JSON.stringify(productId));
        window.location.href = "/auth";
        return;
      }

      const previousLiked = likedProducts[index];
      setLikedProducts((prev) =>
        prev.map((liked, idx) => (idx === index ? !liked : liked))
      );

      const wishlistItem = wishlist.find((item) => item.productId === productId);
      const wishlistId = wishlistItem ? wishlistItem.wishlistId : null;
      const url = previousLiked
        ? `/api/wishlistRemove/${wishlistId}`
        : "/api/wishlistAdd";
      const method = previousLiked ? "DELETE" : "POST";
      const body = !previousLiked
        ? JSON.stringify({
            user_id: parseInt(userId, 10),
            product_id: productId,
          })
        : null;

      try {
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body,
        });

        if (response.status === 401) {
          window.location.href = "/auth";
        }

        if (previousLiked) {
          const updatedWishlist = wishlist.filter(
            (item) => item.productId !== productId
          );
          setWishlist(updatedWishlist);
          setNotification({ type: "success", message: "Removed from wishlist" });
        } else {
          const responseData = await response.json();
          const newWishlistItem = { productId, wishlistId: responseData.id };
          setWishlist([...wishlist, newWishlistItem]);
          setNotification({ type: "success", message: "Added to wishlist" });
        }
      } catch (error) {
        console.error("Error adding/removing from wishlist:", error);
        setLikedProducts((prev) =>
          prev.map((liked, idx) => (idx === index ? previousLiked : liked))
        );
        setNotification({ type: "error", message: "Action failed" });
      }
    },
    [likedProducts, wishlist, setWishlist]
  );

  useEffect(() => {
    const token = Cookies.get("token");
    const userId = Cookies.get("userId");
    const productIdToLike = localStorage.getItem("pendingLike");

    if (productIdToLike && token && userId) {
      toggleLike(
        parseInt(productIdToLike, 10),
        filteredProducts.findIndex((p) => p.id === parseInt(productIdToLike, 10))
      );
      localStorage.removeItem("pendingLike");
    }
  }, [filteredProducts, toggleLike]);

  const handleLoadMore = async () => {
    setLoading(true);
    setLoading(false);
  };

  const handleProductClick = (productId: number) => {
    window.location.href = `/product/${productId}`;
  };

  const breadcrumbItems = [
    { label: `${breadCrumbs}`, href: '/products/men' },
  ];

  const handleFilterChange = async (newFilters: Record<string, any>, gender?: string) => {
    setFilters(newFilters);
    setLoading(true);
  
    try {
      const filterParams = new URLSearchParams();
  
      // Iterate over the filter values and append them as query params
      Object.keys(newFilters).forEach((key) => {
        const value = newFilters[key];
  
        if (Array.isArray(value)) {
          filterParams.append(key, value.join(','));
        } else if (typeof value === 'string') {
          filterParams.append(key, value);
        }
      });
  
      // Handle gender filter
      if (gender) {
        filterParams.append('gender', gender);
      } else if (!filterParams.has('gender') && params?.id) {
        const genderParam = Array.isArray(params.id) ? params.id.join(',') : params.id;
        filterParams.append('gender', genderParam);
      }
  
      const queryString = filterParams.toString();
      const response = await fetch(`/api/filteredProducts?${queryString}`);
  
      if (response.ok) {
        const filteredData = await response.json();
        setFilteredProducts(filteredData);
      } else {
        console.error("Failed to fetch filtered products");
      }
    } catch (error) {
      console.error("Error fetching filtered products:", error);
    } finally {
      setLoading(false);
    }
  };  
  
  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <div className="p-4 mb-8">
        <div className="flex flex-col md:flex-row">
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
                  size={product.size}
                  color={product.color}
                  price={product.price}
                  liked={likedProducts[index]}
                  onToggleLike={() => toggleLike(product.id, index)}
                  onImageClick={() => handleProductClick(product.id)}
                />
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <div className="py-2 px-8">
                <Button5
                  text={loading ? "Loading..." : "Load More"}
                  onClick={handleLoadMore}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Display notification */}
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
