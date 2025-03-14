"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button1 from '../common/button/button-one/page';
import Button5 from '../common/button/button-five/page';
import Cookies from 'js-cookie';
import Notification from '@/components/common/notification/page';
import { io } from 'socket.io-client';

interface Order {
  id: number;
  total_amount: string;
  payment_method: string;
  order_status: string;
  createdAt: string;
  OrderItems: {
    id: number;
    quantity: number;
    price: string;
    product_id: number;
  }[];
}

const AccountPage: React.FC = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
  });

  const [order, setOrder] = useState<Order | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState(userInfo);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const orderId = Cookies.get('lastOrderId');

  useEffect(() => {
    const socket = io('http://localhost:5000'); // Connect to the WebSocket server

    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/getUser');
        const data = await response.json();
        setUserInfo(data);
        setEditedInfo(data);
      } catch (error) {
        setNotification({ message: 'Error fetching user info', type: 'error' });
        console.error('Error fetching user info:', error);
      }
    };

    const fetchOrder = async () => {
      if (orderId) {
        try {
          const response = await fetch(`/api/getOrders/${orderId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch order');
          }
          const data = await response.json();
          setOrder(data);
        } catch (error) {
          setNotification({ message: 'Error fetching order details', type: 'error' });
          console.error('Error fetching order:', error);
        }
      } else {
        setNotification({ message: 'No recent order found', type: 'info' });
      }
    };

    // Listening to WebSocket updates for the order
    socket.on('orderStatusUpdate', (updatedOrder: Order) => {
      if (updatedOrder.id === Number(orderId)) {
        setOrder(updatedOrder);
        setNotification({ message: 'Order status updated', type: 'info' });
      }
    });

    fetchUserInfo();
    fetchOrder();

    return () => {
      socket.disconnect(); // Clean up the WebSocket connection on component unmount
    };
  }, [orderId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedInfo(userInfo);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/updateUser', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedInfo),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUserInfo(updatedUser);
        setIsEditing(false);
        setNotification({ message: 'User information updated successfully!', type: 'success' });
      } else {
        setNotification({ message: 'Failed to update user info', type: 'error' });
        console.error('Failed to update user info');
      }
    } catch (error) {
      setNotification({ message: 'Error saving user info', type: 'error' });
      console.error('Error saving user info:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogout = async () => {
    Cookies.remove('userId');
    Cookies.remove('token');
    Cookies.remove('lastOrderId');
    setNotification({ message: 'Successfully logged out', type: 'info' });
    router.push('/');
  };

  return (
    <div className="container mx-auto p-4">
      {/* Display notification */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      
      <div className="bg-gray rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-white">{`${userInfo.first_name} ${userInfo.last_name}`}</h2>
            <p className="text-white">{userInfo.email}</p>
            <p className="text-white">{userInfo.phone_number}</p>
          </div>
          <div className="flex space-x-4">
            <div onClick={handleEdit}>
              <Button1 text="Edit" />
            </div>
            <div onClick={handleLogout}>
              <Button1 text="Log out" />
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto">
            <h2 className="text-lg font-semibold mb-4">Edit Your Information</h2>
            <div className="mb-4">
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                name="first_name"
                value={editedInfo.first_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg focus:outline-none bg-lightGray"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={editedInfo.last_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg focus:outline-none bg-lightGray"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={editedInfo.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg focus:outline-none bg-lightGray"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phone_number"
                value={editedInfo.phone_number}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg focus:outline-none bg-lightGray"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={editedInfo.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg focus:outline-none bg-lightGray"
              />
            </div>
            <div className="flex space-x-4">
              <div onClick={handleSave}>
                <Button5 text="Save" />
              </div>
              <div onClick={handleCancel}>
                <Button5 text="Cancel" />
              </div>
            </div>
          </div>
        </div>
      )}

      {order ? (
        <div className="bg-lightGray rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Order Details</h3>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                order.order_status === 'completed'
                  ? 'bg-green-100 text-green-600'
                  : order.order_status === 'pending'
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-red-100 text-red-600'
              }`}
            >
              {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
            </span>
          </div>
          <div className="space-y-3">
            <p className="font-bold text-gray-800">Order-Id #{order.id}</p>
            <p className="text-gray-800 font-semibold">
              Total: <span className="font-bold">${order.total_amount}</span>
            </p>
            <p className="text-gray-800">
              Payment Method: <span className="font-semibold">{order.payment_method}</span>
            </p>
            <div className="text-gray-800">
              {order.OrderItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="font-semibold">Product #{item.product_id}</span>
                  <span>
                    {item.quantity} x ${item.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-800">No order found</p>
      )}
    </div>
  );
};

export default AccountPage;
