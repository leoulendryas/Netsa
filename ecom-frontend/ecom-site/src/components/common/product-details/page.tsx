import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Button5 from '@/components/common/button/button-five/page';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Breadcrumb from "@/components/common/breadCrumb/page";
import Notification from '@/components/common/notification/page';
import { io, Socket } from "socket.io-client";

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

const ProductDetails: React.FC<{ product: Product }> = ({ product }) => {
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]); 
  const [selectedSize, setSelectedSize] = useState<string | null>(null); 
  const userId = Cookies.get('userId');
  const [selectedColor, setSelectedColor] = useState<string>('Brown');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const router = useRouter();

  const imageSources = {
    front: product.ProductImages.find((img) => img.position === 'front')?.image_url || '',
    back: product.ProductImages.find((img) => img.position === 'back')?.image_url || '',
    left: product.ProductImages.find((img) => img.position === 'left')?.image_url || '',
    right: product.ProductImages.find((img) => img.position === 'right')?.image_url || '',
    other: product.ProductImages.find((img) => img.position === 'other')?.image_url || '',
  };

  const [socket, setSocket] = useState<Socket | null>(null); 
  const [realTimeProduct, setRealTimeProduct] = useState<Product>(product);

  useEffect(() => {
    const socketInstance = io("http://localhost:5000");
    setSocket(socketInstance);

    socketInstance.on("productUpdate", (updatedProduct: Product) => {
      console.log("Product updated:", updatedProduct);
      setRealTimeProduct(updatedProduct); 
    });

    socketInstance.emit("subscribeProduct", { productId: product.id });

    return () => {
      socketInstance.disconnect();
    };
  }, [product.id]);

  useEffect(() => {
    const fetchProductsByName = async () => {
      try {
        const response = await fetch(`/api/getProductByName?name=${product.name}`);
        if (response.ok) {
          const data: Product[] = await response.json();
          setFetchedProducts(data);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProductsByName();
  }, [product.name]);

  const addToCart = useCallback(async () => {
    if (!userId) {
      router.push('/auth');
      return;
    }
    
    if (!selectedSize) {
      setNotification({ message: 'Please select a size.', type: 'error' });
      return;
    }

    const price = parseFloat(product.price);

    if (isNaN(price)) {
      setNotification({ message: 'Invalid price format.', type: 'error' });
      return;
    }

    try {
      const response = await fetch('/api/addCartItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart_id: userId,
          product_id: product.id,
          size: selectedSize,
          quantity: 1,
          price_at_time_of_addition: price,
        }),
      });

      if (response.ok) {
        setNotification({ message: 'Item added to cart!', type: 'success' });
      } else {
        const errorData = await response.json();
        setNotification({ message: `Error: ${errorData.message}`, type: 'error' });
      }
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      setNotification({ message: 'Failed to add item to cart. Please try again.', type: 'error' });
    }
  }, [product.id, product.price, router, userId, selectedSize]);

  const addToWishlist = useCallback(async () => {
    const token = Cookies.get('token');
    if (!token) {
      localStorage.setItem('pendingLike', product.id.toString());
      router.push('/auth');
      return;
    }

    try {
      const response = await fetch('/api/wishlistAdd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: product.id }),
      });

      if (response.ok) {
        setNotification({ message: 'Product added to wishlist!', type: 'success' });
      } else {
        setNotification({ message: 'Could not add product to wishlist. Please try again.', type: 'error' });
      }
    } catch (error) {
      console.error('Error adding product to wishlist:', error);
      setNotification({ message: 'Error adding product to wishlist.', type: 'error' });
    }
  }, [product.id, router]);

  useEffect(() => {
    const token = Cookies.get('token');
    const pendingLike = localStorage.getItem('pendingLike');

    if (token && pendingLike) {
      const productId = parseInt(pendingLike, 10);
      if (productId === product.id) {
        addToWishlist();
        localStorage.removeItem('pendingLike');
      }
    }
  }, [product.id, addToWishlist]);

  const breadcrumbItems = [
    {
      label: `${product.gender || 'Unknown'}`, 
      href: `/products/${(product.gender?.toLowerCase() || 'all')}`
    },
    { label: `${product.name}` },
  ];  

  const handleProductClick = (productId: number) => {
    window.location.href = `/product/${productId}`;
  };

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <div className="flex flex-col md:flex-row px-4 md:px-20">
        <div className="flex flex-col w-full md:w-3/5">
          <div className="grid grid-cols-2 gap-1">
            <div className="relative bg-gray-300 overflow-hidden w-full">
              {imageSources.front ? (
                <Image
                  src={imageSources.front}
                  alt="Front View"
                  layout="intrinsic"
                  objectFit="contain"
                  width={577.4}
                  height={500}
                />
              ) : null}
            </div>
            <div className="relative bg-gray-300 overflow-hidden w-full">
              {imageSources.back ? (
                <Image
                  src={imageSources.back}
                  alt="Back View"
                  layout="intrinsic"
                  objectFit="contain"
                  width={577.4}
                  height={500}
                />
              ) : null}
            </div>
          </div>
          <div className="col-span-2 relative bg-gray-300 overflow-hidden w-full mt-1 mb-1">
            {imageSources.other ? (
              <Image
                src={imageSources.other}
                alt="Other View"
                layout="intrinsic"
                objectFit="contain"
                width={1154.81}
                height={500}
              />
            ) : null}
          </div>
          <div className="grid grid-cols-2 gap-1">
            <div className="relative bg-gray-300 overflow-hidden w-full">
              {imageSources.left ? (
                <Image
                  src={imageSources.left}
                  alt="Left View"
                  layout="intrinsic"
                  objectFit="contain"
                  width={577.4}
                  height={500}
                />
              ) : null}
            </div>
            <div className="relative bg-gray-300 overflow-hidden w-full">
              {imageSources.right ? (
                <Image
                  src={imageSources.right}
                  alt="Right View"
                  layout="intrinsic"
                  objectFit="contain"
                  width={577.4}
                  height={500}
                />
              ) : null}
            </div>
          </div>
        </div>

        <div className="w-full md:w-2/5 my-10 md:my-0 md:ml-8 flex flex-col items-center sticky top-[160px] self-start">
          <h1 className="text-2xl lg:text-3xl font-semibold">{product.name}</h1>
          <p className="text-xl md:text-2xl mt-2 text-gray font-medium">{product.color}</p>
          <p className="text-xl md:text-2xl mt-2 font-medium">{product.price} Birr</p>

          <div className="flex flex-col w-full md:w-3/5 items-center mt-12">
            <div className="flex flex-wrap gap-2">
              {fetchedProducts.map((fetchedProduct, index) =>
                fetchedProduct.ProductImages
                  .filter((image) => image.position === 'front' && image.image_url !== imageSources.front)
                  .map((image, imgIndex) => (
                    <div
                      key={`${index}-${imgIndex}`}
                      className="h-14 w-14 rounded-full relative bg-gray-300 overflow-hidden cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-110"
                      onClick={() => handleProductClick(fetchedProduct.id)}
                    >
                      <Image
                        src={image.image_url}
                        alt={`${fetchedProduct.name} - ${image.position}`}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  ))
              )}
            </div>
          </div>

          <div className="mt-12">
            <div className="flex">
              {product.Sizes.map((size) => (
                <button
                  key={size.id}
                  className={`border border-gray-300 rounded px-3 py-1 mx-1 lg:px-4 lg:py-2 hover:bg-gray hover:text-white ${
                    selectedSize === size.size ? 'bg-gray' : ''
                  }`}
                  onClick={() => setSelectedSize(size.size)}
                >
                  {size.size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex mt-12">
            <div className="px-4 py-2 mr-2"><Button5 text="ADD TO BAG" onClick={addToCart} /></div>
            <div className="px-4 py-2">
              <Button5 text="FAVORITE" onClick={addToWishlist} />
            </div>
          </div>

          <div className="text-sm lg:text-base text-center text-gray-600 mt-8">
            {product.description}
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

export default ProductDetails;
