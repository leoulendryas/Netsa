"use client";

import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import Header from "@/components/common/header/page";
import Footer from "@/components/common/footer/page";
import CartDrawer from "@/components/common/product-cart/page";

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

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Establish WebSocket connection and handle events
  useEffect(() => {
    const socketInstance = io("https://netsa-backend.onrender.com");  // Replace with your server address
    setSocket(socketInstance);

    // Listen for cart updates from the server
    socketInstance.on("cartUpdate", (updatedCartItems: CartItem[]) => {
      console.log("Cart items updated:", updatedCartItems);
      setCartItems(updatedCartItems);
    });

    // Clean up the connection when the component unmounts
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Fetch initial cart items on component mount
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch("/api/getCartItem");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setCartItems(data.CartItems);  // Populate the cart with the initial data
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header onCartToggle={handleCartToggle} />
      <main className="flex-grow mt-14">
        {children}
      </main>
      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={handleCartToggle} cartItems={cartItems} />
    </div>
  );
}
