import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useParams } from "next/navigation";
import ProductCard from '@/components/common/wishlist-product-card/page';
import FilterSection from '@/components/common/filter/page';
import Button5 from '@/components/common/button/button-five/page';
import Notification from '@/components/common/notification/page'; // Import Notification


interface Size {
    id: number;
    size: string;
  }
  
  interface Fit {
    id: number;
    fit: string;
  }

interface WishlistProduct {
    id: number;
    product_id: number;
    user_id: number;
    Product: {
        id: number;
        name: string;
        description: string;
        Sizes: Size[];
        color: string;
        Fits: Fit[];
        price: string;
        ProductImages: {
            id: number;
            image_url: string;
            position: string;
            position_sequence: number;
        }[];
    };
}

const ProductsPage: React.FC = () => {
    const params = useParams();
    const id = params?.id as string | undefined;
    const [likedProducts, setLikedProducts] = useState<boolean[]>([]);
    const [wishlist, setWishlist] = useState<WishlistProduct[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({}); // State to store selected size for each product
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState<Record<string, any>>({});

    const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

    useEffect(() => {
        const fetchWishlist = async () => {
            const token = Cookies.get('token'); 
            const response = await fetch('/api/wishlist', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setWishlist(data);
                setLikedProducts(data.map(() => true)); 
            } else {
                setNotification({ type: 'error', message: 'Failed to fetch wishlist' });
            }
        };

        fetchWishlist();
    }, []);

    const toggleLike = async (index: number, wishlistId: number): Promise<{ success: boolean; message: string }> => {
        const updatedLikes = [...likedProducts];
        const isLiked = updatedLikes[index];
    
        const token = Cookies.get('token');
    
        if (isLiked) {
            const response = await fetch(`/api/wishlistRemove/${wishlistId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.ok) {
                setNotification({ type: 'success', message: 'Removed from wishlist' });
                return { success: true, message: 'Removed from wishlist' }; 
            } else {
                setNotification({ type: 'error', message: 'Failed to remove from wishlist' });
                return { success: false, message: 'Failed to remove from wishlist' }; 
            }
        } else {
            const response = await fetch('/api/wishlistAdd', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ product_id: wishlist[wishlistId].product_id })
            });
    
            if (response.ok) {
                setNotification({ type: 'success', message: 'Added to wishlist' });
                return { success: true, message: 'Added to wishlist' }; 
            } else {
                setNotification({ type: 'error', message: 'Failed to add to wishlist' });
                return { success: false, message: 'Failed to add to wishlist' }; 
            }
        }
    };
    

    const handleSizeChange = (productId: number, selectedSize: string) => {
        setSelectedSizes({
            ...selectedSizes,
            [productId]: selectedSize, // Update selected size for the specific product
        });
    };

    const handleAddToBag = async (productId: number): Promise<{ success: boolean; message: string }> => {
        const selectedSize = selectedSizes[productId];
        if (!selectedSize) {
            return { success: false, message: 'Please select a size.' };
        }
    
        const userId = Cookies.get('userId');
        if (!userId) {
            return { success: false, message: 'User ID is not found. Please log in.' };
        }

        const product = wishlist.find(item => item.product_id === productId);
        if (!product) {
            return { success: false, message: 'Product not found in wishlist.' };
        }
    
        const price = parseFloat(product.Product.price);
    
        try {
            const response = await fetch('/api/addCartItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cart_id: userId,
                    product_id: productId,
                    quantity: 1,
                    size: selectedSize,
                    price_at_time_of_addition: price,
                }),
            });
    
            if (response.ok) {
                setNotification({ type: 'success', message: 'Item added to cart' });
                return { success: true, message: 'Item added to cart' };  // Return success
            } else {
                const errorData = await response.json();
                setNotification({ type: 'error', message: `Error: ${errorData.message}` });
                return { success: false, message: `Error: ${errorData.message}` };  // Return error
            }
        } catch (error) {
            setNotification({ type: 'error', message: 'Failed to add item to cart. Please try again.' });
            return { success: false, message: 'Failed to add item to cart. Please try again.' };  // Return error
        }
    };    

    const handleProductClick = (productId: number) => {
        window.location.href = `/product/${productId}`;
    };

    const handleRemoveAll = async () => {
        const token = Cookies.get('token'); 
        const confirmed = window.confirm('Are you sure you want to remove all items from your wishlist?');
        
        if (confirmed) {
            try {
                const promises = wishlist.map(item => 
                    fetch(`/api/wishlistRemove/${item.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                );

                await Promise.all(promises);
                setWishlist([]); 
                setLikedProducts([]);
                setNotification({ type: 'success', message: 'All items removed from wishlist' });
            } catch (error) {
                setNotification({ type: 'error', message: 'Error removing all items from wishlist' });
            }
        }
    };

    const handleFilterChange = (newFilters: Record<string, any>) => {
        setFilters(newFilters);
    };

    return (
        <div className="p-4 mb-8">
            {/* Display notification */}
            {notification && (
              <Notification
                type={notification.type}
                message={notification.message}
                onClose={() => setNotification(null)}
              />
            )}

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
                        <h2 className="text-lg font-semibold">{wishlist.length} Items</h2>
                    </div>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {wishlist.map((item, index) => (
                            <ProductCard
                                key={item.id}
                                className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1rem)]"
                                imageUrl={item.Product.ProductImages[0]?.image_url || ""}
                                name={item.Product.name}
                                Sizes={item.Product.Sizes} // Pass the sizes array
                                color={item.Product.color}
                                price={parseFloat(item.Product.price)}
                                liked={likedProducts[index]}
                                onToggleLike={() => toggleLike(index, item.id)}
                                onClick={() => handleProductClick(item.Product.id)}
                                onAddToBag={() => handleAddToBag(item.Product.id)}
                                onSizeChange={(selectedSize: string) => handleSizeChange(item.Product.id, selectedSize)} // Handle size change
                            />
                        ))}
                    </div>
                    <div className="flex justify-center mt-6">
                        <div className="py-2 px-8">
                            <Button5 text="Remove All" onClick={handleRemoveAll} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
