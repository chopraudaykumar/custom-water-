import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  ShoppingBag, 
  MapPin, 
  User, 
  Plus, 
  Minus, 
  Search, 
  Truck, 
  Clock, 
  MessageCircle,
  X,
  Send,
  ChevronRight,
  ChevronLeft,
  CreditCard,
  HelpCircle,
  Trash2,
  Check
} from 'lucide-react';
import { backend } from '../services/mockBackend';
import { Product, CartItem, Order, OrderStatus, Address, PaymentMethod } from '../types';
import { getSmartSupportResponse } from '../services/geminiService';

export const UserApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'track' | 'profile'>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [products] = useState<Product[]>(backend.getProducts());
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [showChat, setShowChat] = useState(false);

  // Profile Sub-view State
  const [profileView, setProfileView] = useState<'menu' | 'addresses' | 'payments' | 'support'>('menu');
  
  // Local Data State for Demo Features
  const [addresses, setAddresses] = useState<Address[]>([
    { id: 'addr1', label: 'Home', value: '123, Palm Grove Heights, Mumbai, 400001', isDefault: true },
    { id: 'addr2', label: 'Work', value: 'Unit 405, Tech Park, Andheri East, Mumbai, 400069', isDefault: false }
  ]);
  const [payments, setPayments] = useState<PaymentMethod[]>([
    { id: 'pay1', type: 'card', label: 'HDFC Visa ending 4242', isDefault: true },
    { id: 'pay2', type: 'upi', label: 'john@okhdfcbank', isDefault: false }
  ]);
  
  // Temporary Form State
  const [newAddress, setNewAddress] = useState('');
  const [showAddAddress, setShowAddAddress] = useState(false);

  // Cart Logic
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    // Use default address
    const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];

    backend.placeOrder({
      customerId: 'user1',
      customerName: 'Current User',
      items: cart.map(c => ({ productId: c.id, productName: c.name, quantity: c.quantity, price: c.price })),
      totalAmount: cartTotal,
      address: defaultAddr ? defaultAddr.value : 'Current Location'
    });
    
    setCart([]);
    setShowCart(false);
    setActiveTab('track');
    // Refresh orders
    setMyOrders(backend.getUserOrders('user1'));
  };

  const handleAddAddress = () => {
    if(!newAddress.trim()) return;
    const newAddrObj: Address = {
      id: `addr${Date.now()}`,
      label: 'New Address',
      value: newAddress,
      isDefault: false
    };
    setAddresses([...addresses, newAddrObj]);
    setNewAddress('');
    setShowAddAddress(false);
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(addresses.map(a => ({...a, isDefault: a.id === id})));
  };

  const deleteAddress = (id: string) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  useEffect(() => {
    setMyOrders(backend.getUserOrders('user1'));
  }, [activeTab]);

  // Render Functions for Profile Sub-views
  const renderProfileContent = () => {
    if (profileView === 'addresses') {
      return (
        <div className="p-4 space-y-4 animate-in slide-in-from-right duration-200">
           <div className="flex items-center gap-2 mb-4">
             <button onClick={() => setProfileView('menu')} className="p-2 bg-white rounded-full shadow-sm text-slate-600"><ChevronLeft className="w-5 h-5"/></button>
             <h2 className="text-xl font-bold text-slate-800">My Addresses</h2>
           </div>
           
           <div className="space-y-3">
             {addresses.map(addr => (
               <div key={addr.id} className={`p-4 bg-white rounded-xl border ${addr.isDefault ? 'border-cyan-500 ring-1 ring-cyan-500' : 'border-slate-100'} shadow-sm relative`}>
                  <div className="flex justify-between items-start">
                    <div onClick={() => setDefaultAddress(addr.id)} className="cursor-pointer flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className={`w-4 h-4 ${addr.isDefault ? 'text-cyan-500' : 'text-slate-400'}`} />
                        <span className="font-bold text-slate-700">{addr.label}</span>
                        {addr.isDefault && <span className="text-[10px] bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full">Default</span>}
                      </div>
                      <p className="text-sm text-slate-500 pr-8">{addr.value}</p>
                    </div>
                    <button onClick={() => deleteAddress(addr.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
               </div>
             ))}
           </div>

           {!showAddAddress ? (
             <button 
               onClick={() => setShowAddAddress(true)}
               className="w-full py-3 border-2 border-dashed border-cyan-300 text-cyan-600 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-cyan-50 transition-colors"
             >
               <Plus className="w-5 h-5" /> Add New Address
             </button>
           ) : (
             <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
               <h3 className="text-sm font-bold text-slate-800 mb-2">New Address Details</h3>
               <textarea 
                 value={newAddress}
                 onChange={(e) => setNewAddress(e.target.value)}
                 placeholder="Enter full address here..."
                 className="w-full p-3 bg-slate-50 rounded-lg text-sm outline-none focus:ring-2 focus:ring-cyan-400 mb-3"
                 rows={3}
               />
               <div className="flex gap-2">
                 <button onClick={() => setShowAddAddress(false)} className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium">Cancel</button>
                 <button onClick={handleAddAddress} className="flex-1 py-2 bg-cyan-500 text-white rounded-lg text-sm font-medium">Save Address</button>
               </div>
             </div>
           )}
        </div>
      );
    }

    if (profileView === 'payments') {
      return (
        <div className="p-4 space-y-4 animate-in slide-in-from-right duration-200">
           <div className="flex items-center gap-2 mb-4">
             <button onClick={() => setProfileView('menu')} className="p-2 bg-white rounded-full shadow-sm text-slate-600"><ChevronLeft className="w-5 h-5"/></button>
             <h2 className="text-xl font-bold text-slate-800">Payment Methods</h2>
           </div>

           <div className="space-y-3">
             {payments.map(pay => (
               <div key={pay.id} className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center">
                     <CreditCard className="w-5 h-5 text-slate-500" />
                   </div>
                   <div>
                     <p className="font-semibold text-slate-700 text-sm">{pay.label}</p>
                     <p className="text-xs text-slate-400 capitalize">{pay.type}</p>
                   </div>
                 </div>
                 {pay.isDefault && <Check className="w-5 h-5 text-cyan-500" />}
               </div>
             ))}
           </div>
           
           <button className="w-full py-3 bg-slate-800 text-white rounded-xl font-medium shadow-lg shadow-slate-300">
             Add Payment Method
           </button>
        </div>
      );
    }

    if (profileView === 'support') {
      return (
        <div className="p-4 space-y-4 animate-in slide-in-from-right duration-200">
           <div className="flex items-center gap-2 mb-4">
             <button onClick={() => setProfileView('menu')} className="p-2 bg-white rounded-full shadow-sm text-slate-600"><ChevronLeft className="w-5 h-5"/></button>
             <h2 className="text-xl font-bold text-slate-800">Help & Support</h2>
           </div>

           <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
             <div className="flex items-start gap-3">
               <div className="bg-blue-500 p-2 rounded-full text-white"><MessageCircle className="w-5 h-5" /></div>
               <div>
                 <h3 className="font-bold text-blue-900">Need instant help?</h3>
                 <p className="text-sm text-blue-700 mb-3">Our AI assistant AquaBot is ready to help you with order status, products, and more.</p>
                 <button onClick={() => setShowChat(true)} className="px-4 py-2 bg-white text-blue-600 text-sm font-bold rounded-lg shadow-sm">Chat Now</button>
               </div>
             </div>
           </div>

           <h3 className="font-bold text-slate-800 mt-6">Frequently Asked Questions</h3>
           <div className="space-y-2">
             {['How do I track my order?', 'What is the refund policy?', 'Do you deliver on Sundays?', 'How to return empty cans?'].map((q, i) => (
               <div key={i} className="p-4 bg-white rounded-xl border border-slate-100 text-sm font-medium text-slate-700 flex justify-between items-center cursor-pointer hover:bg-slate-50">
                 {q}
                 <ChevronRight className="w-4 h-4 text-slate-400" />
               </div>
             ))}
           </div>
        </div>
      );
    }

    // Default Menu View
    return (
      <div className="p-4 flex flex-col items-center pt-10 animate-in fade-in">
        <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-4">
          JS
        </div>
        <h2 className="text-xl font-bold text-slate-800">John Smith</h2>
        <p className="text-slate-500 text-sm mb-8">+91 98765 43210</p>

        <div className="w-full space-y-3">
           <button onClick={() => setProfileView('addresses')} className="w-full p-4 bg-white rounded-xl border border-slate-100 text-left font-medium text-slate-700 flex justify-between hover:bg-slate-50 items-center transition-colors">
              <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-cyan-500"/> Addresses</div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
           </button>
           <button onClick={() => setProfileView('payments')} className="w-full p-4 bg-white rounded-xl border border-slate-100 text-left font-medium text-slate-700 flex justify-between hover:bg-slate-50 items-center transition-colors">
              <div className="flex items-center gap-3"><CreditCard className="w-5 h-5 text-purple-500"/> Payment Methods</div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
           </button>
           <button className="w-full p-4 bg-white rounded-xl border border-slate-100 text-left font-medium text-slate-700 flex justify-between hover:bg-slate-50 items-center transition-colors">
              <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-orange-500"/> Subscription</div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
           </button>
           <button onClick={() => setProfileView('support')} className="w-full p-4 bg-white rounded-xl border border-slate-100 text-left font-medium text-slate-700 flex justify-between hover:bg-slate-50 items-center transition-colors">
              <div className="flex items-center gap-3"><HelpCircle className="w-5 h-5 text-green-500"/> Help & Support</div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
           </button>
        </div>
        
        <button className="mt-8 text-red-500 text-sm font-medium px-6 py-2 rounded-lg hover:bg-red-50">Sign Out</button>
     </div>
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen flex justify-center">
      {/* Mobile Container Simulator */}
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-20 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Shuddhneer
            </h1>
            <p className="text-xs text-slate-500">Pure water, Delivered.</p>
          </div>
          <div className="relative cursor-pointer" onClick={() => setShowCart(true)}>
            <div className="p-2 bg-cyan-50 rounded-full hover:bg-cyan-100 transition-colors">
              <ShoppingBag className="w-5 h-5 text-cyan-600" />
            </div>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cart.length}
              </span>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
          
          {activeTab === 'home' && (
            <div className="p-4 space-y-6">
              {/* Banner */}
              <div className="relative rounded-2xl overflow-hidden h-40 shadow-lg">
                <img src="https://images.unsplash.com/photo-1555412654-72a95a495858?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover" alt="Banner" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent flex items-center p-6">
                  <div className="text-white">
                    <p className="text-sm font-medium opacity-90">Special Offer</p>
                    <h2 className="text-2xl font-bold mb-2">Summer Hydration</h2>
                    <p className="text-xs opacity-75">Get 20% off on 20L cans.</p>
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="w-full bg-slate-50 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-cyan-400 outline-none"
                />
              </div>

              {/* Categories/Products */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Popular Boxes</h3>
                <div className="grid grid-cols-2 gap-4">
                  {products.map(product => (
                    <div key={product.id} className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                      <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-slate-100">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        {product.popular && (
                          <span className="absolute top-2 left-2 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full z-10">
                            Best Seller
                          </span>
                        )}
                      </div>
                      <h4 className="font-semibold text-slate-800 text-sm truncate">{product.name}</h4>
                      <p className="text-xs text-slate-500 mb-2 truncate">{product.volume}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-cyan-600">₹{product.price}</span>
                        <button 
                          onClick={() => addToCart(product)}
                          className="p-1.5 bg-cyan-500 text-white rounded-lg active:scale-95 transition-transform"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'track' && (
            <div className="p-4 space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">My Orders</h2>
              {myOrders.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <Truck className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No active orders</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myOrders.map(order => (
                    <div key={order.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-xs text-slate-400">Order ID: {order.id}</p>
                          <p className="font-semibold text-slate-800">₹{order.totalAmount} • {order.items.length} Items</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium 
                          ${order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-700' : 
                            order.status === OrderStatus.CANCELLED ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'}`}>
                          {order.status}
                        </span>
                      </div>
                      
                      {/* Tracking Visual */}
                      <div className="relative pt-2 pb-4 px-2">
                        <div className="absolute left-2 top-2 bottom-4 w-0.5 bg-slate-100"></div>
                        <div className="space-y-6 relative">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full bg-green-500 ring-4 ring-green-100 z-10"></div>
                            <span className="text-xs font-medium text-slate-600">Order Placed</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full z-10 ${
                              [OrderStatus.DISPATCHED, OrderStatus.DELIVERED].includes(order.status) ? 'bg-green-500 ring-4 ring-green-100' : 'bg-slate-200'
                            }`}></div>
                            <span className={`text-xs font-medium ${
                              [OrderStatus.DISPATCHED, OrderStatus.DELIVERED].includes(order.status) ? 'text-slate-600' : 'text-slate-300'
                            }`}>Out for Delivery</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full z-10 ${
                              order.status === OrderStatus.DELIVERED ? 'bg-green-500 ring-4 ring-green-100' : 'bg-slate-200'
                            }`}></div>
                            <span className={`text-xs font-medium ${
                              order.status === OrderStatus.DELIVERED ? 'text-slate-600' : 'text-slate-300'
                            }`}>Delivered</span>
                          </div>
                        </div>
                      </div>

                      {/* Map Simulator */}
                      {order.status === OrderStatus.DISPATCHED && (
                        <div className="mt-4 h-24 bg-slate-100 rounded-xl overflow-hidden relative">
                           <div className="absolute inset-0 bg-cyan-50 flex items-center justify-center">
                              <MapPin className="text-cyan-500 animate-bounce" />
                              <span className="text-[10px] text-cyan-600 font-bold absolute bottom-2">Live Tracking</span>
                           </div>
                           <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover opacity-30" alt="map" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && renderProfileContent()}
        </main>

        {/* Bottom Navigation */}
        <nav className="bg-white border-t border-slate-100 absolute bottom-0 w-full px-6 py-3 flex justify-between items-center z-20 pb-safe">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-cyan-600' : 'text-slate-400'}`}
          >
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-medium">Home</span>
          </button>
          <button 
             onClick={() => setActiveTab('track')}
             className={`flex flex-col items-center gap-1 ${activeTab === 'track' ? 'text-cyan-600' : 'text-slate-400'}`}
          >
            <Clock className="w-6 h-6" />
            <span className="text-[10px] font-medium">Orders</span>
          </button>
          <button 
             onClick={() => setActiveTab('profile')}
             className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-cyan-600' : 'text-slate-400'}`}
          >
            <User className="w-6 h-6" />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </nav>

        {/* Cart Modal Overlay */}
        {showCart && (
          <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end">
            <div className="bg-white w-full rounded-t-3xl p-6 pb-8 animate-slide-up h-3/4 flex flex-col">
               <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold text-slate-800">Your Cart</h2>
                 <button onClick={() => setShowCart(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                   <X className="w-5 h-5 text-slate-600" />
                 </button>
               </div>
               
               <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
                 {cart.length === 0 ? (
                   <p className="text-center text-slate-400 mt-10">Cart is empty.</p>
                 ) : (
                   cart.map(item => (
                     <div key={item.id} className="flex gap-4 items-center">
                        <img src={item.image} className="w-16 h-16 rounded-lg object-cover bg-slate-100" alt={item.name} />
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-800 text-sm">{item.name}</h4>
                          <p className="text-cyan-600 font-bold">₹{item.price * item.quantity}</p>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1">
                           <button onClick={() => updateQuantity(item.id, -1)} className="p-1 rounded bg-white shadow-sm text-slate-600"><Minus className="w-4 h-4" /></button>
                           <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                           <button onClick={() => updateQuantity(item.id, 1)} className="p-1 rounded bg-white shadow-sm text-cyan-600"><Plus className="w-4 h-4" /></button>
                        </div>
                     </div>
                   ))
                 )}
               </div>

               <div className="mt-6 border-t border-slate-100 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-500">Total</span>
                    <span className="text-2xl font-bold text-slate-800">₹{cartTotal}</span>
                  </div>
                  
                  {/* Address Preview in Cart */}
                  <div className="mb-4 p-3 bg-slate-50 rounded-xl flex items-center gap-3 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-cyan-500" />
                    <span className="truncate flex-1">
                      {addresses.find(a => a.isDefault)?.value || 'No address selected'}
                    </span>
                    <button onClick={() => { setShowCart(false); setActiveTab('profile'); setProfileView('addresses'); }} className="text-cyan-600 font-bold text-xs">CHANGE</button>
                  </div>

                  <button 
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:shadow-none"
                  >
                    Place Order
                  </button>
               </div>
            </div>
          </div>
        )}

        {/* AI Support Chat Button */}
        {!showCart && profileView === 'menu' && (
          <div className="absolute bottom-20 right-4 z-10">
            <button 
              onClick={() => setShowChat(true)}
              className="bg-blue-600 text-white p-3 rounded-full shadow-lg shadow-blue-600/30 hover:scale-105 transition-transform"
            >
              <MessageCircle className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* AI Chat Interface */}
        {showChat && (
          <ChatInterface onClose={() => setShowChat(false)} />
        )}
      </div>
    </div>
  );
};

const ChatInterface: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: 'Hi! I am AquaBot. How can I help you hydrate today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    const response = await getSmartSupportResponse(userMsg, backend.getProducts());
    
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setLoading(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="absolute inset-0 z-50 bg-white flex flex-col animate-fade-in">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4 flex items-center justify-between text-white shadow-md">
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-2 rounded-full"><MessageCircle className="w-5 h-5" /></div>
          <span className="font-bold">Support Chat</span>
        </div>
        <button onClick={onClose}><X className="w-6 h-6" /></button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              m.role === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-slate-700 shadow-sm rounded-bl-none border border-slate-100'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about water, delivery..." 
          className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
        />
        <button 
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-blue-600 text-white p-2 rounded-full disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};