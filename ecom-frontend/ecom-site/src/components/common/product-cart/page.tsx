import React, { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import ProductCard from '@/components/common/cart-product-card/page';
import Button5 from '../button/button-five/page';
import { FaTimes } from 'react-icons/fa';
import Checkout from '@/components/checkout/page';

interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  price_at_time_of_addition: string;
  imageUrl?: string;
  name?: string;
  size?: string;
  color?: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, cartItems }) => {
  const [detailedCartItems, setDetailedCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  useEffect(() => {
    const bodyOverflow = document.body.style.overflow;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = bodyOverflow;
    };
  }, [isOpen]);

  // Fetch product details based on cart items
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const updatedItems = await Promise.all(cartItems.map(async (item) => {
          const response = await fetch(`/api/getSingleProduct/${item.product_id}`);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const product = await response.json();
          return {
            ...item,
            imageUrl: product.ProductImages[0]?.image_url || '/default-image.jpg',
            name: product.name || 'Unnamed Product',
            color: product.color || 'Unknown Color',
          };
        }));
        setDetailedCartItems(updatedItems);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [cartItems]);

  // Recalculate subtotal when cart items are updated
  useEffect(() => {
    const newSubtotal = detailedCartItems.reduce((acc, item) => acc + parseFloat(item.price_at_time_of_addition) * item.quantity, 0);
    setSubtotal(newSubtotal);
  }, [detailedCartItems]);

  const handleRemoveItem = (id: number) => {
    setDetailedCartItems(prevItems => prevItems.filter(item => item.product_id !== id));
  };

  const deliveryFee = 0;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const transformedItems = detailedCartItems.map(item => ({
    product_id: item.product_id,
    quantity: item.quantity,
    size: item.size,
    price: parseFloat(item.price_at_time_of_addition),
  }));

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-75 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>

      {/* Cart Drawer */}
      <div
        className={`fixed top-0 right-0 h-full px-6 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } w-full lg:w-2/5 xl:w-1/3 2xl:w-1/4 overflow-y-auto`}
        id="cart-drawer"
        tabIndex={-1}
      >
        <div className="p-4 max-h-full">
          <button onClick={onClose} className="text-black text-2xl"><FaTimes size={24} /></button>
          <h2 className="text-3xl font-medium my-4 text-center">Your Bag</h2>

          {/* Promo Code Section */}
          <div className="mt-6 mb-10 flex justify-between items-center">
            <p className="text-lg">Do you have a promo code?</p>
            <button className="text-black border rounded-full flex items-center justify-center">
              <FiPlus size={18} />
            </button>
          </div>

          {/* Cart Items */}
          <div>
            {detailedCartItems.map((item, index) => (
              <ProductCard
                key={index}
                imageUrl={item.imageUrl || '/default-image.jpg'}
                name={item.name || 'Unnamed Product'}
                size={item.size || 'Unknown Size'}
                color={item.color || 'Unknown Color'}
                price={parseFloat(item.price_at_time_of_addition)}
                quantity={item.quantity}
                id={item.id}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>

          {/* Line break above subtotal */}
          <hr className="border-gray my-4" />

          {/* Subtotal, Delivery, and Total */}
          <div className="space-y-2">
            <div className="flex justify-between text-gray">
              <span>Sub Total:</span>
              <span>{subtotal.toFixed(2)} Birr</span>
            </div>
            <div className="flex justify-between text-gray">
              <span>Delivery:</span>
              <span>{deliveryFee.toFixed(2)} Birr</span>
            </div>
            <div className="flex justify-between font-medium text-xl">
              <span>Total:</span>
              <span>{total.toFixed(2)} Birr</span>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="w-full flex justify-center mt-6">
            <Button5 text="Proceed to Checkout" onClick={handleCheckout} />
          </div>
        </div>
      </div>

      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Checkout subtotal={total} 
            deliveryFee={deliveryFee} 
            items={transformedItems} />
        </div>
      )}
    </>
  );
};

export default CartDrawer;
