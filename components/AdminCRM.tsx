import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  Search, 
  Bell, 
  MoreVertical,
  CheckCircle,
  Truck,
  AlertCircle,
  TrendingUp,
  BrainCircuit,
  Edit,
  X,
  Save,
  Trash2
} from 'lucide-react';
import { backend } from '../services/mockBackend';
import { Order, OrderStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { generateCRMInsights } from '../services/geminiService';

export const AdminCRM: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, pendingOrders: 0 });
  const [aiInsight, setAiInsight] = useState<string>('<li>Generating smart insights...</li>');
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Initial load
    refreshData();
  }, []);

  const refreshData = () => {
    const _orders = backend.getOrders();
    setOrders(_orders);
    setStats(backend.getStats());
    
    // Trigger AI insight generation (Mocking async behavior)
    generateCRMInsights(_orders).then(setAiInsight);
  };

  const updateStatus = (id: string, newStatus: OrderStatus) => {
    backend.updateOrderStatus(id, newStatus);
    refreshData();
  };

  const handleSaveEdit = () => {
    if (editingOrder) {
      // Recalculate total amount based on items
      const newTotal = editingOrder.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const finalOrder = { ...editingOrder, totalAmount: newTotal };
      
      backend.updateOrder(finalOrder);
      setEditingOrder(null);
      refreshData();
    }
  };

  const updateEditItemQuantity = (index: number, newQuantity: number) => {
    if (!editingOrder) return;
    const newItems = [...editingOrder.items];
    if (newQuantity > 0) {
      newItems[index] = { ...newItems[index], quantity: newQuantity };
      setEditingOrder({ ...editingOrder, items: newItems });
    }
  };

  const removeEditItem = (index: number) => {
    if (!editingOrder) return;
    const newItems = editingOrder.items.filter((_, i) => i !== index);
    setEditingOrder({ ...editingOrder, items: newItems });
  };

  // Prepare chart data (Mock last 7 days)
  const chartData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
            Shuddhneer CRM
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <div className="flex items-center gap-3 bg-cyan-900/30 text-cyan-400 p-3 rounded-xl cursor-pointer">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Overview</span>
          </div>
          <div className="flex items-center gap-3 hover:bg-slate-800 hover:text-white p-3 rounded-xl cursor-pointer transition-colors">
            <Package className="w-5 h-5" />
            <span className="font-medium">Orders</span>
          </div>
          <div className="flex items-center gap-3 hover:bg-slate-800 hover:text-white p-3 rounded-xl cursor-pointer transition-colors">
            <Users className="w-5 h-5" />
            <span className="font-medium">Customers</span>
          </div>
          <div className="flex items-center gap-3 hover:bg-slate-800 hover:text-white p-3 rounded-xl cursor-pointer transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </div>
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white">A</div>
            <div>
              <p className="text-sm text-white">Admin User</p>
              <p className="text-xs text-slate-500">Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
            <p className="text-slate-500 text-sm">Welcome back, here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none" />
            </div>
            <button className="p-2 bg-white border border-slate-200 rounded-lg relative">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Revenue" value={`₹${stats.totalRevenue}`} icon={<TrendingUp className="text-green-600" />} color="bg-green-50" />
          <StatCard title="Total Orders" value={stats.totalOrders.toString()} icon={<Package className="text-blue-600" />} color="bg-blue-50" />
          <StatCard title="Pending" value={stats.pendingOrders.toString()} icon={<AlertCircle className="text-orange-600" />} color="bg-orange-50" />
          <StatCard title="Active Drivers" value="12" icon={<Truck className="text-purple-600" />} color="bg-purple-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
           {/* Chart */}
           <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
             <h3 className="font-bold text-slate-800 mb-6">Revenue Analytics</h3>
             <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} />
                   <YAxis axisLine={false} tickLine={false} />
                   <Tooltip cursor={{fill: '#f1f5f9'}} />
                   <Bar dataKey="sales" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
           </div>

           {/* AI Insights Panel */}
           <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
             <BrainCircuit className="absolute -right-4 -bottom-4 w-32 h-32 text-slate-700 opacity-50" />
             <div className="flex items-center gap-2 mb-4">
               <span className="bg-cyan-500/20 text-cyan-300 text-xs px-2 py-1 rounded border border-cyan-500/50">Gemini Powered</span>
               <h3 className="font-bold">Smart Insights</h3>
             </div>
             <ul className="space-y-3 text-sm text-slate-300 leading-relaxed list-disc list-inside" dangerouslySetInnerHTML={{ __html: aiInsight }}>
             </ul>
           </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Recent Orders</h3>
            <button className="text-sm text-cyan-600 font-medium hover:underline">View All</button>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{order.id}</td>
                  <td className="px-6 py-4 text-slate-600">{order.customerName}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                      ${order.status === OrderStatus.PENDING ? 'bg-orange-100 text-orange-700' : 
                        order.status === OrderStatus.DISPATCHED ? 'bg-blue-100 text-blue-700' :
                        order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">₹{order.totalAmount}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button 
                         onClick={() => setEditingOrder(order)} 
                         className="p-1 hover:bg-blue-100 hover:text-blue-600 rounded text-slate-400" 
                         title="Edit Order"
                       >
                         <Edit className="w-4 h-4" />
                       </button>
                       {order.status === OrderStatus.PENDING && (
                         <button onClick={() => updateStatus(order.id, OrderStatus.DISPATCHED)} className="p-1 hover:bg-green-100 hover:text-green-600 rounded text-slate-400" title="Dispatch">
                           <Truck className="w-4 h-4" />
                         </button>
                       )}
                       {order.status === OrderStatus.DISPATCHED && (
                         <button onClick={() => updateStatus(order.id, OrderStatus.DELIVERED)} className="p-1 hover:bg-green-100 hover:text-green-600 rounded text-slate-400" title="Mark Delivered">
                           <CheckCircle className="w-4 h-4" />
                         </button>
                       )}
                       <button className="p-1 hover:bg-slate-100 rounded text-slate-400">
                         <MoreVertical className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      
      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800">Edit Order <span className="text-slate-400 text-base font-normal">#{editingOrder.id}</span></h3>
              <button onClick={() => setEditingOrder(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Customer Details Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Customer Name</label>
                  <input 
                    type="text" 
                    value={editingOrder.customerName}
                    onChange={(e) => setEditingOrder({...editingOrder, customerName: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-700">Status</label>
                   <select 
                     value={editingOrder.status}
                     onChange={(e) => setEditingOrder({...editingOrder, status: e.target.value as OrderStatus})}
                     className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none bg-white"
                   >
                     {Object.values(OrderStatus).map(status => (
                       <option key={status} value={status}>{status}</option>
                     ))}
                   </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Delivery Address</label>
                  <textarea 
                    value={editingOrder.address}
                    onChange={(e) => setEditingOrder({...editingOrder, address: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none min-h-[80px]"
                  />
                </div>
              </div>

              {/* Order Items Section */}
              <div>
                <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4 text-cyan-600" />
                  Order Items
                </h4>
                <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-100 text-slate-500 font-medium border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Item</th>
                        <th className="px-4 py-3 w-24">Price</th>
                        <th className="px-4 py-3 w-32">Qty</th>
                        <th className="px-4 py-3 w-24">Total</th>
                        <th className="px-4 py-3 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {editingOrder.items.map((item, idx) => (
                        <tr key={idx} className="group hover:bg-white transition-colors">
                          <td className="px-4 py-3 font-medium text-slate-700">{item.productName}</td>
                          <td className="px-4 py-3 text-slate-500">₹{item.price}</td>
                          <td className="px-4 py-3">
                            <input 
                              type="number" 
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateEditItemQuantity(idx, parseInt(e.target.value) || 0)}
                              className="w-20 px-2 py-1 rounded border border-slate-200 focus:ring-1 focus:ring-cyan-500 outline-none"
                            />
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-700">₹{item.price * item.quantity}</td>
                          <td className="px-4 py-3 text-right">
                            <button 
                              onClick={() => removeEditItem(idx)}
                              className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition-colors"
                              title="Remove Item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {editingOrder.items.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                            No items in this order
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot className="bg-slate-50 border-t border-slate-200 font-bold text-slate-800">
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-right">Total Amount</td>
                        <td className="px-4 py-3">
                          ₹{editingOrder.items.reduce((acc, item) => acc + (item.price * item.quantity), 0)}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button 
                onClick={() => setEditingOrder(null)}
                className="px-4 py-2 rounded-lg text-slate-600 font-medium hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEdit}
                className="px-6 py-2 rounded-lg bg-cyan-600 text-white font-medium hover:bg-cyan-700 shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{title: string, value: string, icon: React.ReactNode, color: string}> = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start justify-between">
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
    </div>
    <div className={`p-3 rounded-xl ${color}`}>
      {icon}
    </div>
  </div>
);