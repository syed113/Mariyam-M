import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Package,
  TrendingUp,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  RefreshCw,
  Search,
  Lock,
  ArrowRight,
  Users,
  Tag,
  LayoutTemplate
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, OrderStatus, Coupon } from '../../types';
import { api } from '../../services/api';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const {
    currentUser,
    login,
    products,
    orders,
    adminMetrics,
    refreshAdminMetrics,
    updateProductStock,
    updateProduct,
    addProduct,
    deleteProduct,
    updateOrderStatus,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'orders' | 'customers' | 'coupons' | 'cms' | 'addProduct'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Lists for extended admin tabs
  const [customersList, setCustomersList] = useState<Array<any>>([]);
  const [couponsList, setCouponsList] = useState<Coupon[]>([]);
  const [bannersList, setBannersList] = useState<any[]>([]);
  const [isLoadingTab, setIsLoadingTab] = useState(false);

  // Coupon Creation Form
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponVal, setNewCouponVal] = useState(15);
  const [newCouponMin, setNewCouponMin] = useState(2000);
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // Banner Creation Form
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('');
  const [newBannerCta, setNewBannerCta] = useState('Explore Atelier');
  const [newBannerImg, setNewBannerImg] = useState('https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=1200&q=80');

  // Admin login states if not authenticated as admin
  const [adminEmail, setAdminEmail] = useState('admin@mariyam.com');
  const [adminPassword, setAdminPassword] = useState('MariyamAdmin2026!');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState('');

  // New Product Form State
  const [newSku, setNewSku] = useState('');
  const [newName, setNewName] = useState('');
  const [newBrand, setNewBrand] = useState('Mariyam Maquillage');
  const [newDepartment, setNewDepartment] = useState('Makeup');
  const [newSubcat, setNewSubcat] = useState('Foundation');
  const [newPrice, setNewPrice] = useState(1499);
  const [newMrp, setNewMrp] = useState(1999);
  const [newStock, setNewStock] = useState(60);
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=800&q=80');

  useEffect(() => {
    if (currentUser?.role === 'ADMIN') {
      refreshAdminMetrics();
      if (activeTab === 'customers') {
        setIsLoadingTab(true);
        api.getAdminCustomers().then(setCustomersList).catch(() => {}).finally(() => setIsLoadingTab(false));
      } else if (activeTab === 'coupons') {
        setIsLoadingTab(true);
        api.getAdminCoupons().then(setCouponsList).catch(() => {}).finally(() => setIsLoadingTab(false));
      } else if (activeTab === 'cms') {
        setIsLoadingTab(true);
        api.getAdminBanners().then(setBannersList).catch(() => {}).finally(() => setIsLoadingTab(false));
      }
    }
  }, [currentUser, activeTab]);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    try {
      const created = await api.createAdminCoupon({
        code: newCouponCode.trim().toUpperCase(),
        discountType: newCouponType,
        discountValue: Number(newCouponVal),
        minOrderValue: Number(newCouponMin),
        description: newCouponDesc || `${newCouponVal}${newCouponType === 'percentage' ? '%' : '₹'} off luxury purchase`,
        usedCount: 0
      });
      setCouponsList(prev => [...prev.filter(c => c.code !== created.code), created]);
      setNewCouponCode('');
      setNewCouponDesc('');
      showToast(`Coupon ${created.code} activated`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to create coupon', 'error');
    }
  };

  const handleDeleteCoupon = async (code: string) => {
    try {
      await api.deleteAdminCoupon(code);
      setCouponsList(prev => prev.filter(c => c.code !== code));
      showToast(`Coupon ${code} removed`, 'info');
    } catch (err: any) {
      showToast('Failed to delete coupon', 'error');
    }
  };

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerTitle) return;
    try {
      const banner = await api.createAdminBanner({
        id: `bnr-${Date.now()}`,
        title: newBannerTitle,
        subtitle: newBannerSubtitle,
        ctaText: newBannerCta,
        ctaLink: '/shop',
        imageUrl: newBannerImg,
        placement: 'hero',
        active: true
      });
      setBannersList(prev => [...prev, banner]);
      setNewBannerTitle('');
      setNewBannerSubtitle('');
      showToast('Promotional banner added', 'success');
    } catch (err: any) {
      showToast('Failed to add banner', 'error');
    }
  };

  const handleToggleBanner = async (id: string) => {
    try {
      const updated = await api.toggleAdminBanner(id);
      setBannersList(prev => prev.map(b => b.id === id ? updated : b));
      showToast(`Banner ${updated.active ? 'activated' : 'deactivated'}`, 'info');
    } catch (err: any) {
      showToast('Failed to toggle banner', 'error');
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError('');
    try {
      await login(adminEmail, adminPassword);
      showToast('Admin operations console unlocked', 'success');
    } catch (err: any) {
      setAuthError(err.message || 'Invalid administrator credentials');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newSku) {
      showToast('Name and SKU are required', 'error');
      return;
    }

    const created: Partial<Product> = {
      id: `mm-prod-${Date.now()}`,
      sku: newSku.toUpperCase(),
      name: newName,
      slug: newName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      brand: newBrand,
      department: newDepartment,
      category: newDepartment,
      subcategory: newSubcat,
      price: Number(newPrice),
      mrp: Number(newMrp),
      stockCount: Number(newStock),
      rating: 4.8,
      reviewCount: 1,
      images: [newImage],
      primaryImage: newImage,
      thumbnail: newImage,
      gallery: [newImage],
      benefits: ['Dermatologically approved for Indian skin', 'Long-lasting performance in heat & humidity'],
      isBestseller: false,
      isFeatured: true
    };

    await addProduct(created);
    setActiveTab('inventory');
    setNewName('');
    setNewSku('');
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#FCF9F5] border border-[#E8DAC2] rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl relative my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#4A0E17] text-white p-4 sm:p-6 flex items-center justify-between border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg sm:text-xl flex items-center gap-2">
                <span>Mariyam Operations Console</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-sans uppercase font-bold ${
                  currentUser?.role === 'ADMIN' ? 'bg-emerald-700 text-white' : 'bg-amber-600 text-white'
                }`}>
                  {currentUser?.role === 'ADMIN' ? 'Live Admin Verified' : 'Protected Gateway'}
                </span>
              </h2>
              <p className="text-[11px] text-[#EADFCB]">Catalog, Inventory, Orders & Fulfillment Gateway</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* If user is NOT an admin, require Administrator Authentication */}
        {currentUser?.role !== 'ADMIN' ? (
          <div className="p-8 max-w-md mx-auto text-center space-y-5 my-auto">
            <div className="w-16 h-16 rounded-full bg-[#4A0E17]/10 flex items-center justify-center text-[#4A0E17] mx-auto border border-[#D4AF37]/40">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-xl text-[#351016]">Administrator Credentials Required</h3>
              <p className="text-xs text-gray-600">
                This console allows live catalog updates, atomic stock adjustments, and order state transitions.
              </p>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs">
                {authError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-3 text-xs text-left">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Admin Email</label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#D9C8AF] rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Admin Password</label>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#D9C8AF] rounded-xl"
                />
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3 bg-[#4A0E17] hover:bg-[#621420] text-white rounded-full font-bold uppercase tracking-wider text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isAuthenticating ? 'Authenticating...' : 'Unlock Operations Console'}
              </button>
            </form>

            <div className="pt-2 text-[11px] text-gray-500">
              Pre-configured admin login: <code className="text-[#4A0E17] font-semibold">admin@mariyam.com</code>
            </div>
          </div>
        ) : (
          <>
            {/* Tab Strip */}
            <div className="bg-white border-b border-[#E8DAC2] px-6 flex items-center gap-6 text-xs font-semibold overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-3.5 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'overview' ? 'border-[#4A0E17] text-[#4A0E17] font-bold' : 'border-transparent text-gray-500'
                }`}
              >
                Overview & Metrics
              </button>
              <button
                onClick={() => setActiveTab('inventory')}
                className={`py-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'inventory' ? 'border-[#4A0E17] text-[#4A0E17] font-bold' : 'border-transparent text-gray-500'
                }`}
              >
                <span>Product Catalog & Stock</span>
                {adminMetrics.lowStockItemsCount > 0 && (
                  <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {adminMetrics.lowStockItemsCount} low
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'orders' ? 'border-[#4A0E17] text-[#4A0E17] font-bold' : 'border-transparent text-gray-500'
                }`}
              >
                <span>Orders Fulfillment ({orders.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('customers')}
                className={`py-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'customers' ? 'border-[#4A0E17] text-[#4A0E17] font-bold' : 'border-transparent text-gray-500'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Customers</span>
              </button>
              <button
                onClick={() => setActiveTab('coupons')}
                className={`py-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'coupons' ? 'border-[#4A0E17] text-[#4A0E17] font-bold' : 'border-transparent text-gray-500'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Coupons & Promos</span>
              </button>
              <button
                onClick={() => setActiveTab('cms')}
                className={`py-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'cms' ? 'border-[#4A0E17] text-[#4A0E17] font-bold' : 'border-transparent text-gray-500'
                }`}
              >
                <LayoutTemplate className="w-3.5 h-3.5" />
                <span>CMS Banners</span>
              </button>
              <button
                onClick={() => setActiveTab('addProduct')}
                className={`py-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1 text-[#A37B30] ${
                  activeTab === 'addProduct' ? 'border-[#A37B30] font-bold' : 'border-transparent'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Product</span>
              </button>
            </div>

            {/* Main Admin Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* TAB 1: OVERVIEW METRICS */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-[#E8DAC2] p-4 rounded-2xl shadow-xs space-y-1">
                      <span className="text-[10px] uppercase font-bold text-gray-500">Gross Sales</span>
                      <p className="text-2xl font-serif font-bold text-[#4A0E17]">
                        ₹{adminMetrics.totalRevenue.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[11px] text-emerald-700 font-semibold">+18.4% vs last period</p>
                    </div>

                    <div className="bg-white border border-[#E8DAC2] p-4 rounded-2xl shadow-xs space-y-1">
                      <span className="text-[10px] uppercase font-bold text-gray-500">Total Orders</span>
                      <p className="text-2xl font-serif font-bold text-[#351016]">
                        {adminMetrics.totalOrders}
                      </p>
                      <p className="text-[11px] text-gray-500 font-semibold">100% Pan-India fulfilled</p>
                    </div>

                    <div className="bg-white border border-[#E8DAC2] p-4 rounded-2xl shadow-xs space-y-1">
                      <span className="text-[10px] uppercase font-bold text-gray-500">Average Order Value</span>
                      <p className="text-2xl font-serif font-bold text-[#351016]">
                        ₹{adminMetrics.averageOrderValue.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[11px] text-[#A37B30] font-semibold">Prestige tier basket</p>
                    </div>

                    <div className="bg-white border border-[#E8DAC2] p-4 rounded-2xl shadow-xs space-y-1">
                      <span className="text-[10px] uppercase font-bold text-gray-500">Low Stock SKUs</span>
                      <p className="text-2xl font-serif font-bold text-amber-700">
                        {adminMetrics.lowStockItemsCount}
                      </p>
                      <p className="text-[11px] text-amber-800">Requires batch replenishment</p>
                    </div>
                  </div>

                  {/* Restock Alert Box */}
                  {adminMetrics.lowStockItemsCount > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
                      <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-bold">Inventory Alert: High Velocity Depletion</p>
                        <p className="mt-0.5 text-amber-800">
                          Several foundations & creams have fallen below the 25-unit safety stock threshold.
                          Use the Product Catalog tab to execute one-click stock replenishments.
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab('inventory')}
                        className="px-3 py-1.5 bg-amber-800 text-white rounded-lg font-bold text-xs shrink-0"
                      >
                        View Low SKUs
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: INVENTORY & CATALOG */}
              {activeTab === 'inventory' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="relative flex-1 w-full sm:max-w-xs">
                      <input
                        type="text"
                        placeholder="Search SKU, product or brand..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#D9C8AF] rounded-xl text-xs focus:outline-none focus:border-[#4A0E17]"
                      />
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>

                    <span className="text-xs text-gray-500">
                      Live Catalog SKUs: <strong>{products.length}</strong>
                    </span>
                  </div>

                  <div className="bg-white border border-[#E8DAC2] rounded-2xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#FAF5EC] border-b border-[#E8DAC2] text-[#5C453E] uppercase text-[10px]">
                          <tr>
                            <th className="p-3">Product</th>
                            <th className="p-3">SKU</th>
                            <th className="p-3">Price / MRP</th>
                            <th className="p-3">Stock Units</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Quick Restock</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredProducts.map(p => (
                            <tr key={p.id} className="hover:bg-[#FCF9F5]">
                              <td className="p-3">
                                <div className="flex items-center gap-2.5">
                                  <img src={p.primaryImage} alt="" className="w-9 h-9 object-cover rounded-lg border" />
                                  <div className="min-w-0 max-w-xs">
                                    <p className="font-semibold text-gray-900 truncate">{p.name}</p>
                                    <p className="text-[10px] text-gray-500">{p.brand} • {p.subcategory}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 font-mono font-semibold text-gray-700">{p.sku}</td>
                              <td className="p-3">
                                <span className="font-bold text-[#4A0E17]">₹{p.price}</span>
                                <span className="text-[10px] text-gray-400 block line-through">₹{p.mrp}</span>
                              </td>
                              <td className="p-3">
                                <span className={`font-bold ${p.stockCount <= 25 ? 'text-amber-700' : 'text-gray-900'}`}>
                                  {p.stockCount}
                                </span>
                              </td>
                              <td className="p-3">
                                {p.stockCount === 0 ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">
                                    Out of Stock
                                  </span>
                                ) : p.stockCount <= 25 ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                                    Low Stock
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                    Optimal
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-right space-x-1.5">
                                <button
                                  onClick={() => updateProductStock(p.id, p.stockCount + 25)}
                                  className="px-2.5 py-1 bg-[#FAF5EC] border border-[#D9C8AF] hover:bg-[#F3EAD8] rounded-md text-[11px] font-semibold text-[#4A0E17]"
                                >
                                  +25
                                </button>
                                <button
                                  onClick={() => updateProductStock(p.id, p.stockCount + 50)}
                                  className="px-2.5 py-1 bg-[#FAF5EC] border border-[#D9C8AF] hover:bg-[#F3EAD8] rounded-md text-[11px] font-semibold text-[#4A0E17]"
                                >
                                  +50
                                </button>
                                <button
                                  onClick={() => setEditingProduct(p)}
                                  className="p-1 text-gray-500 hover:text-black"
                                  title="Edit"
                                >
                                  <Edit2 className="w-3.5 h-3.5 inline" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ORDERS FULFILLMENT */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="bg-white border border-[#E8DAC2] rounded-2xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#FAF5EC] border-b border-[#E8DAC2] text-[#5C453E] uppercase text-[10px]">
                          <tr>
                            <th className="p-3">Order #</th>
                            <th className="p-3">Customer</th>
                            <th className="p-3">Location</th>
                            <th className="p-3">Amount</th>
                            <th className="p-3">Payment</th>
                            <th className="p-3">Current Status</th>
                            <th className="p-3 text-right">Update Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {orders.map(order => (
                            <tr key={order.id} className="hover:bg-[#FCF9F5]">
                              <td className="p-3 font-mono font-bold text-[#4A0E17]">{order.orderNumber}</td>
                              <td className="p-3">
                                <p className="font-semibold text-gray-900">{order.shippingAddress.fullName}</p>
                                <p className="text-[10px] text-gray-500">{order.shippingAddress.phone}</p>
                              </td>
                              <td className="p-3">
                                <p className="text-gray-900">{order.shippingAddress.city}</p>
                                <p className="text-[10px] text-gray-500">{order.shippingAddress.pincode}</p>
                              </td>
                              <td className="p-3 font-bold text-gray-900">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800">
                                  {order.paymentMethod} • {order.paymentStatus}
                                </span>
                              </td>
                              <td className="p-3">
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#4A0E17] text-white">
                                  {order.status}
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                <select
                                  value={order.status}
                                  onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                                  className="bg-white border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none"
                                >
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Packed">Packed</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Out for Delivery">Out for Delivery</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: CUSTOMERS */}
              {activeTab === 'customers' && (
                <div className="bg-white border border-[#E8DAC2] rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#351016]">Registered Customer Directory</h3>
                      <p className="text-xs text-gray-500">Live registered client records and customer lifetime metrics</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-[#FAF5EC] border border-[#E8DAC2] rounded-lg">
                      {customersList.length} Registered Accounts
                    </span>
                  </div>

                  {isLoadingTab ? (
                    <div className="py-12 text-center text-xs text-gray-400">Loading client directory...</div>
                  ) : customersList.length === 0 ? (
                    <div className="py-12 text-center text-xs text-gray-500">No registered customers yet.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#FAF5EC] text-gray-600 font-semibold border-b border-[#E8DAC2]">
                          <tr>
                            <th className="p-3">Customer</th>
                            <th className="p-3">Contact</th>
                            <th className="p-3">Member Since</th>
                            <th className="p-3 text-center">Orders</th>
                            <th className="p-3 text-right">Lifetime Spend</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {customersList.map((c, i) => (
                            <tr key={c.id || i} className="hover:bg-gray-50">
                              <td className="p-3">
                                <p className="font-semibold text-gray-900">{c.name}</p>
                                <p className="text-[11px] text-gray-500">{c.email}</p>
                              </td>
                              <td className="p-3 text-gray-600 font-mono text-[11px]">{c.phone || 'N/A'}</td>
                              <td className="p-3 text-gray-500 text-[11px]">
                                {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                              </td>
                              <td className="p-3 text-center">
                                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold">
                                  {c.orderCount || 0}
                                </span>
                              </td>
                              <td className="p-3 text-right font-bold text-[#4A0E17]">
                                ₹{(c.totalSpent || 0).toLocaleString('en-IN')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: COUPONS */}
              {activeTab === 'coupons' && (
                <div className="space-y-6">
                  {/* Create Coupon Card */}
                  <form onSubmit={handleCreateCoupon} className="bg-white border border-[#E8DAC2] rounded-2xl p-5 space-y-3 text-xs">
                    <h4 className="font-serif font-bold text-sm text-[#351016]">Create New Promotional Code</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-gray-600 font-medium mb-1">Coupon Code *</label>
                        <input
                          type="text"
                          required
                          placeholder="FESTIVE25"
                          value={newCouponCode}
                          onChange={e => setNewCouponCode(e.target.value.toUpperCase())}
                          className="w-full px-3 py-2 border border-[#D9C8AF] rounded-lg uppercase font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 font-medium mb-1">Discount Type</label>
                        <select
                          value={newCouponType}
                          onChange={e => setNewCouponType(e.target.value as any)}
                          className="w-full px-3 py-2 border border-[#D9C8AF] rounded-lg bg-white"
                        >
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Fixed Amount (₹)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-600 font-medium mb-1">Value ({newCouponType === 'percentage' ? '%' : '₹'})</label>
                        <input
                          type="number"
                          required
                          value={newCouponVal}
                          onChange={e => setNewCouponVal(Number(e.target.value))}
                          className="w-full px-3 py-2 border border-[#D9C8AF] rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 font-medium mb-1">Min Order Value (₹)</label>
                        <input
                          type="number"
                          value={newCouponMin}
                          onChange={e => setNewCouponMin(Number(e.target.value))}
                          className="w-full px-3 py-2 border border-[#D9C8AF] rounded-lg"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-gray-600 font-medium mb-1">Description</label>
                        <input
                          type="text"
                          placeholder="e.g. 25% off festive bridal packages above ₹2,000"
                          value={newCouponDesc}
                          onChange={e => setNewCouponDesc(e.target.value)}
                          className="w-full px-3 py-2 border border-[#D9C8AF] rounded-lg"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="submit"
                          className="w-full py-2 bg-[#4A0E17] hover:bg-[#621420] text-white font-bold rounded-lg uppercase tracking-wider"
                        >
                          Activate Promo
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Active Coupons List */}
                  <div className="bg-white border border-[#E8DAC2] rounded-2xl p-5 space-y-3">
                    <h4 className="font-serif font-bold text-sm text-[#351016]">Active Promotional Codes</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {couponsList.map((cpn, idx) => (
                        <div key={cpn.code || idx} className="p-3.5 rounded-xl border border-[#E8DAC2] bg-[#FAF5EC]/50 flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-sm text-[#4A0E17] bg-white px-2 py-0.5 rounded border border-[#D4AF37]/50">
                                {cpn.code}
                              </span>
                              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                {cpn.discountType === 'percentage' ? `${cpn.discountValue}% OFF` : `₹${cpn.discountValue} OFF`}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{cpn.description}</p>
                            {cpn.minOrderValue && (
                              <p className="text-[10px] text-gray-500 mt-0.5">Min Order: ₹{cpn.minOrderValue.toLocaleString('en-IN')}</p>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteCoupon(cpn.code)}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete Coupon"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: CMS BANNERS */}
              {activeTab === 'cms' && (
                <div className="space-y-6">
                  {/* Create Banner Card */}
                  <form onSubmit={handleCreateBanner} className="bg-white border border-[#E8DAC2] rounded-2xl p-5 space-y-3 text-xs">
                    <h4 className="font-serif font-bold text-sm text-[#351016]">Add Promotional Marketing Banner</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-600 font-medium mb-1">Banner Title *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Royal Diwali Festive Atelier"
                          value={newBannerTitle}
                          onChange={e => setNewBannerTitle(e.target.value)}
                          className="w-full px-3 py-2 border border-[#D9C8AF] rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 font-medium mb-1">Subtitle</label>
                        <input
                          type="text"
                          placeholder="e.g. Infused with 24K Gold bio-actives"
                          value={newBannerSubtitle}
                          onChange={e => setNewBannerSubtitle(e.target.value)}
                          className="w-full px-3 py-2 border border-[#D9C8AF] rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 font-medium mb-1">CTA Text</label>
                        <input
                          type="text"
                          value={newBannerCta}
                          onChange={e => setNewBannerCta(e.target.value)}
                          className="w-full px-3 py-2 border border-[#D9C8AF] rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 font-medium mb-1">Image URL</label>
                        <input
                          type="text"
                          value={newBannerImg}
                          onChange={e => setNewBannerImg(e.target.value)}
                          className="w-full px-3 py-2 border border-[#D9C8AF] rounded-lg"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="py-2 px-5 bg-[#4A0E17] hover:bg-[#621420] text-white font-bold rounded-lg uppercase tracking-wider text-xs"
                    >
                      Publish Banner
                    </button>
                  </form>

                  {/* Banners List */}
                  <div className="bg-white border border-[#E8DAC2] rounded-2xl p-5 space-y-3">
                    <h4 className="font-serif font-bold text-sm text-[#351016]">Active Marketing Banners</h4>
                    {bannersList.length === 0 ? (
                      <p className="text-xs text-gray-400 py-6 text-center">No marketing banners configured.</p>
                    ) : (
                      <div className="space-y-3">
                        {bannersList.map(b => (
                          <div key={b.id} className="p-3 border border-[#E8DAC2] rounded-xl flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <img src={b.imageUrl} alt={b.title} className="w-16 h-10 object-cover rounded-md border" />
                              <div>
                                <p className="font-semibold text-xs text-gray-900">{b.title}</p>
                                <p className="text-[11px] text-gray-500">{b.subtitle}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleBanner(b.id)}
                                className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                                  b.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {b.active ? 'Active' : 'Inactive'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: ADD NEW PRODUCT FORM */}
              {activeTab === 'addProduct' && (
                <form onSubmit={handleCreateProduct} className="bg-white border border-[#E8DAC2] rounded-2xl p-6 space-y-4 text-xs max-w-2xl mx-auto">
                  <h3 className="font-serif font-bold text-lg text-[#351016]">
                    Catalog Listing Creator
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">SKU Reference *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. MM-GOLD-707"
                        value={newSku}
                        onChange={(e) => setNewSku(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#D9C8AF] rounded-lg uppercase"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Brand Name *</label>
                      <input
                        type="text"
                        required
                        value={newBrand}
                        onChange={(e) => setNewBrand(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#D9C8AF] rounded-lg"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block font-semibold text-gray-700 mb-1">Full Formulation Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mariyam 24K Liquid Illuminator & Highlighter"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#D9C8AF] rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Department</label>
                      <select
                        value={newDepartment}
                        onChange={(e) => setNewDepartment(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#D9C8AF] rounded-lg"
                      >
                        <option>Makeup</option>
                        <option>Skincare</option>
                        <option>Fragrance</option>
                        <option>Tools & Brushes</option>
                        <option>Bath & Body</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Subcategory</label>
                      <input
                        type="text"
                        value={newSubcat}
                        onChange={(e) => setNewSubcat(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#D9C8AF] rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Selling Price (₹)</label>
                      <input
                        type="number"
                        value={newPrice}
                        onChange={(e) => setNewPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#D9C8AF] rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">MRP (₹)</label>
                      <input
                        type="number"
                        value={newMrp}
                        onChange={(e) => setNewMrp(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#D9C8AF] rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Initial Stock Quantity</label>
                      <input
                        type="number"
                        value={newStock}
                        onChange={(e) => setNewStock(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#D9C8AF] rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Image URL</label>
                      <input
                        type="text"
                        value={newImage}
                        onChange={(e) => setNewImage(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#D9C8AF] rounded-lg"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#4A0E17] text-white rounded-full font-bold uppercase tracking-wider shadow-md hover:bg-[#621420] transition-colors"
                  >
                    Create Product in Store Catalog
                  </button>
                </form>
              )}

              {/* EDIT PRODUCT MODAL OVERLAY */}
              {editingProduct && (
                <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 border border-[#E8DAC2] text-xs">
                    <div className="flex items-center justify-between border-b pb-3">
                      <h4 className="font-serif font-bold text-base text-[#351016]">Edit {editingProduct.name}</h4>
                      <button onClick={() => setEditingProduct(null)}>✕</button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block font-semibold mb-1">Price (₹)</label>
                        <input
                          type="number"
                          value={editingProduct.price}
                          onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                          className="w-full p-2 border rounded"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">MRP (₹)</label>
                        <input
                          type="number"
                          value={editingProduct.mrp}
                          onChange={(e) => setEditingProduct({ ...editingProduct, mrp: Number(e.target.value) })}
                          className="w-full p-2 border rounded"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Stock Count</label>
                        <input
                          type="number"
                          value={editingProduct.stockCount}
                          onChange={(e) => setEditingProduct({ ...editingProduct, stockCount: Number(e.target.value) })}
                          className="w-full p-2 border rounded"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="bestseller"
                          checked={editingProduct.isBestseller}
                          onChange={(e) => setEditingProduct({ ...editingProduct, isBestseller: e.target.checked })}
                        />
                        <label htmlFor="bestseller" className="font-semibold">Mark as Cult Bestseller</label>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          updateProduct(editingProduct);
                          setEditingProduct(null);
                        }}
                        className="flex-1 py-2 bg-[#4A0E17] text-white rounded font-bold"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditingProduct(null)}
                        className="px-4 py-2 border rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
