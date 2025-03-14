"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaHeart, FaRegHeart, FaShoppingBag } from "react-icons/fa";
import Notification from '@/components/common/notification/page';  // Import the notification component

interface Size {
  id: number;
  size: string;
}

interface Fit {
  id: number;
  fit: string;
}

interface ProductCardProps {
    imageUrl: string;
    name: string;
    Sizes: Size[];
    color: string;
    price: number;
    liked: boolean;
    onToggleLike: () => void;
    onClick: () => void;
    onAddToBag: (selectedSize: string) => Promise<{ success: boolean, message: string }>;
    className?: string;
    onSizeChange: (selectedSize: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
    imageUrl, 
    name, 
    Sizes,
    color, 
    price, 
    liked: initialLiked, 
    onToggleLike,
    onClick,
    onAddToBag,
    onSizeChange,
    className
}) => {
    const [liked, setLiked] = useState(initialLiked);
    const [selectedSize, setSelectedSize] = useState(Sizes[0]?.size || '');
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const handleToggleLike = () => {
        setLiked(!liked);
        onToggleLike();
    };

    const handleAddToBag = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click event
        if (selectedSize) {
            try {
                const result = await onAddToBag(selectedSize);
                setNotification({
                    type: result.success ? 'success' : 'error',
                    message: result.message
                });
            } catch (error) {
                console.error('Failed to add item to cart:', error);
                setNotification({
                    type: 'error',
                    message: 'Failed to add item to cart. Please try again.'
                });
            }
        } else {
            setNotification({ type: 'error', message: 'Please select a size.' });
        }
    };

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000); // Auto-hide after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [notification]);

    return (
        <div className={`overflow-hidden relative bg-white`} onClick={onClick}>
            <div className="relative w-full pb-[100%]">
                <Image 
                    src={imageUrl} 
                    alt={name} 
                    fill
                    objectFit="cover" 
                    className="absolute inset-0"
                />
                <button
                    onClick={(e) => { 
                        e.stopPropagation();
                        handleToggleLike(); 
                    }}
                    className="absolute top-4 left-4 text-black text-lg bg-lightGray bg-opacity-50 rounded-full p-1 z-10 focus:outline-none"
                >
                    {liked ? <FaHeart className="text-black" /> : <FaRegHeart />}
                </button>
            </div>
            <div className="p-2">
                <h2 className="text-base font-normal flex items-center justify-between">
                    {name}
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleAddToBag} // Call handleAddToBag when clicked
                            className="text-black text-lg bg-lightGray bg-opacity-50 rounded-full p-1 focus:outline-none"
                        >
                            <FaShoppingBag />
                        </button>
                    </div>
                </h2>
                <p className="text-base font-normal text-gray">{color}</p>
                <p className="text-base font-semibold mt-2">{price.toFixed(2)} Birr</p>

                {/* Size selection dropdown */}
                {Sizes.length > 0 ? (
                    <div className="mt-2">
                        <label htmlFor={`size-select-${name}`} className="block text-sm font-medium text-gray-700">
                            Select Size
                        </label>
                        <select
                            id={`size-select-${name}`}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            value={selectedSize}
                            onClick={(e) => e.stopPropagation()} // Prevent triggering onClick of the card
                            onChange={(e) => {
                                setSelectedSize(e.target.value);
                                onSizeChange(e.target.value);  // Call the onSizeChange prop with the selected size
                            }}
                        >
                            <option value="">Select a size</option>
                            {Sizes.map((size) => (
                                <option key={size.id} value={size.size}>
                                    {size.size}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <p className="text-sm text-red-500 mt-2">No sizes available</p>
                )}
            </div>

            {/* Notification */}
            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>
    );
};

export default ProductCard;
