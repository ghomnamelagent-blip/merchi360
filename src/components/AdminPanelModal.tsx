import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Search,
  RotateCcw,
  Sliders,
  Package,
  Layers,
  Sparkles,
  Flame,
  Check,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  ClipboardList,
  Eye,
  EyeOff,
  ShoppingBag,
  Clock,
  MapPin,
  Phone,
  User,
  ArrowRight
} from 'lucide-react';
import { MenuItem, MenuCategory, ActiveOrder, OrderStatus, DishVariant } from '../types';
import { CATEGORIES, FALLBACK_FOOD_IMG } from '../data/menuData';
import { formatPKR } from '../utils/format';
import { ADMIN_PASSWORD_STORAGE_KEY, DEFAULT_ADMIN_PASSWORD, getStoredAdminPassword } from './AdminLoginModal';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: MenuItem[];
  onToggleStock: (itemId: string) => void;
  onAddItem: (newItem: MenuItem) => void;
  onUpdateItem: (updatedItem: MenuItem) => void;
  onDeleteItem: (itemId: string) => void;
  onResetDefaults: () => void;
  activeOrders?: ActiveOrder[];
  onUpdateOrderStatus?: (orderId: string, status: OrderStatus) => void;
  onNotify?: (msg: string, isError?: boolean) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  items,
  onToggleStock,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onResetDefaults,
  activeOrders = [],
  onUpdateOrderStatus,
  onNotify,
}) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'orders' | 'security'>('menu');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Password Change Form State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showPassFields, setShowPassFields] = useState(false);

  // Form states for Add / Edit
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<MenuCategory>('Desi Items');
  const [formPrice, setFormPrice] = useState<number>(1000);
  const [formDesc, setFormDesc] = useState('');
  const [formImage, setFormImage] = useState(FALLBACK_FOOD_IMG);
  const [formInStock, setFormInStock] = useState(true);
  const [formVariants, setFormVariants] = useState<DishVariant[]>([]);

  if (!isOpen) return null;

  const totalCount = items.length;
  const inStockCount = items.filter((i) => i.inStock !== false).length;
  const outOfStockCount = totalCount - inStockCount;

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      (item.itemNumber && item.itemNumber.toString().includes(search));

    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormPrice(item.price);
    setFormDesc(item.description);
    setFormImage(item.image);
    setFormInStock(item.inStock !== false);
    setFormVariants(item.variants ? JSON.parse(JSON.stringify(item.variants)) : []);
    setIsAddingNew(false);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormCategory('Desi Items');
    setFormPrice(1200);
    setFormDesc('Freshly prepared gourmet specialty cooked with traditional spices.');
    setFormImage(FALLBACK_FOOD_IMG);
    setFormInStock(true);
    setFormVariants([]);
    setIsAddingNew(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || formPrice <= 0) return;

    if (isAddingNew) {
      const newItem: MenuItem = {
        id: `dish-custom-${Date.now()}`,
        itemNumber: items.length + 1,
        name: formName.trim(),
        category: formCategory,
        price: Number(formPrice),
        description: formDesc.trim(),
        image: formImage.trim() || FALLBACK_FOOD_IMG,
        inStock: formInStock,
        variants: formVariants.length > 0 ? formVariants : undefined,
        rating: 5.0,
        reviewsCount: 1,
      };
      onAddItem(newItem);
      onNotify?.(`Added "${newItem.name}" to menu!`);
    } else if (editingItem) {
      const updated: MenuItem = {
        ...editingItem,
        name: formName.trim(),
        category: formCategory,
        price: Number(formPrice),
        description: formDesc.trim(),
        image: formImage.trim() || FALLBACK_FOOD_IMG,
        inStock: formInStock,
        variants: formVariants.length > 0 ? formVariants : undefined,
      };
      onUpdateItem(updated);
      onNotify?.(`Updated "${updated.name}"!`);
    }

    setEditingItem(null);
    setIsAddingNew(false);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    const storedPass = getStoredAdminPassword();

    const isCurrentValid =
      currentPass === storedPass ||
      (storedPass === '360merchiadmin' && currentPass === '360mirchiadmin');

    if (!isCurrentValid) {
      setPasswordError('Current password does not match.');
      return;
    }

    if (!newPass || newPass.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    if (newPass !== confirmPass) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    try {
      localStorage.setItem(ADMIN_PASSWORD_STORAGE_KEY, newPass);
      setPasswordSuccess('Admin password changed successfully! Remember your new credentials.');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      onNotify?.('Admin password updated successfully!');
    } catch {
      setPasswordError('Failed to save new password to browser storage.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-[#141416] border border-zinc-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="p-4 sm:p-6 bg-[#18181A] border-b border-zinc-800 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B35] to-[#FF8B5A] flex items-center justify-center text-white shadow-lg shadow-[#FF6B35]/20">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">Mirchi 360 Admin Dashboard</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
                  Single-Admin Mode
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Manage all 194 verified dishes, one-click stock availability, PKR rates, and customer orders.
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'menu'
                  ? 'bg-[#FF6B35] text-white shadow-md shadow-[#FF6B35]/20'
                  : 'bg-zinc-800/80 hover:bg-zinc-750 text-zinc-300'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Menu Dishes ({totalCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#FF6B35] text-white shadow-md shadow-[#FF6B35]/20'
                  : 'bg-zinc-800/80 hover:bg-zinc-750 text-zinc-300'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>Orders ({activeOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-[#FF6B35] text-white shadow-md shadow-[#FF6B35]/20'
                  : 'bg-zinc-800/80 hover:bg-zinc-750 text-zinc-300'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Change Password</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors ml-2 cursor-pointer"
              aria-label="Close Admin Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab 1: Menu Dishes Management */}
        {activeTab === 'menu' && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Quick Stats Bar */}
            <div className="px-6 py-3 bg-[#18181A]/60 border-b border-zinc-850 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
              <div className="flex items-center gap-4">
                <span className="text-zinc-400">
                  Total Dishes: <strong className="text-white">{totalCount}</strong>
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <strong>{inStockCount}</strong> In Stock
                </span>
                <span className="flex items-center gap-1.5 text-red-400">
                  <XCircle className="w-3.5 h-3.5" />
                  <strong>{outOfStockCount}</strong> Out of Stock
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onResetDefaults}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
                  title="Reload all 194 verified dishes and rates"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Restore 194 Menu</span>
                </button>

                <button
                  onClick={openAddModal}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#FF6B35] hover:bg-[#ff5a1f] text-white text-xs font-bold shadow-md shadow-[#FF6B35]/20 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Dish</span>
                </button>
              </div>
            </div>

            {/* Search & Category Filter */}
            <div className="p-4 bg-[#141416] border-b border-zinc-800 flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search 194 dishes by name, # number, or description..."
                  className="w-full bg-[#1C1C1E] border border-zinc-700/80 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6B35]"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Category selector */}
              <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === 'All'
                      ? 'bg-zinc-200 text-zinc-900 font-bold'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  All ({totalCount})
                </button>
                {CATEGORIES.filter((c) => c.id !== 'All Items').map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-[#FF6B35] text-white font-bold'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dish Items Grid */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-zinc-850">
              {filteredItems.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-white">No dishes found</h4>
                  <p className="text-xs text-zinc-400 mt-1">Try adjusting your search or category filter.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredItems.map((dish) => {
                    const isInStock = dish.inStock !== false;
                    return (
                      <div
                        key={dish.id}
                        className={`p-3 rounded-2xl border transition-all flex flex-col justify-between ${
                          isInStock
                            ? 'bg-[#1A1A1E] border-zinc-800 hover:border-zinc-700'
                            : 'bg-[#151517] border-red-900/30 opacity-75'
                        }`}
                      >
                        <div className="flex gap-3">
                          <img
                            src={dish.image}
                            alt={dish.name}
                            onError={(e) => {
                              e.currentTarget.src = FALLBACK_FOOD_IMG;
                            }}
                            className="w-16 h-16 rounded-xl object-cover shrink-0 bg-zinc-900"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono text-zinc-500">#{dish.itemNumber}</span>
                              <h4 className="text-xs font-bold text-white truncate">{dish.name}</h4>
                            </div>
                            <span className="text-[10px] text-[#FF6B35] block truncate">{dish.category}</span>
                            <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">{dish.description}</p>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {dish.variants && dish.variants.length > 0 ? (
                                dish.variants.map((v) => (
                                  <span key={v.name} className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                                    {v.name}: {formatPKR(v.price)}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs font-bold text-white">{formatPKR(dish.price)}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-3 pt-2 border-t border-zinc-850 flex items-center justify-between gap-2">
                          {/* Stock Toggle Button */}
                          <button
                            onClick={() => onToggleStock(dish.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              isInStock
                                ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30'
                                : 'bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/30'
                            }`}
                            title="Single-click toggle stock"
                          >
                            {isInStock ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>In Stock</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Out of Stock</span>
                              </>
                            )}
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEditModal(dish)}
                              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                              title="Edit rate & details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete "${dish.name}" from menu?`)) {
                                  onDeleteItem(dish.id);
                                  onNotify?.(`Deleted "${dish.name}"`);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-900/50 text-zinc-400 hover:text-red-300 transition-colors cursor-pointer"
                              title="Delete dish"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Orders Management */}
        {activeTab === 'orders' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-base font-bold text-white">Live Customer Orders & Decisions</h4>
                <p className="text-xs text-zinc-400">Accept, dispatch, or update status of active customer deliveries.</p>
              </div>
            </div>

            {activeOrders.length === 0 ? (
              <div className="text-center py-16 bg-[#18181A] rounded-2xl border border-zinc-800">
                <ShoppingBag className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-white">No active orders right now</h4>
                <p className="text-xs text-zinc-400 mt-1">New incoming customer orders will appear here automatically.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <div key={order.orderId} className="p-4 rounded-2xl bg-[#1A1A1E] border border-zinc-800">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white text-sm">#{order.orderId}</span>
                          <span className="px-2 py-0.5 rounded-full bg-[#FF6B35]/20 text-[#FF6B35] font-bold text-[11px] uppercase">
                            {order.status.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-400">Placed: {order.placedAt}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-zinc-400 block">Total Amount</span>
                        <strong className="text-base text-[#FF6B35] font-black">{formatPKR(order.total)}</strong>
                      </div>
                    </div>

                    {/* Customer & Location */}
                    <div className="py-2.5 flex flex-wrap gap-4 text-xs text-zinc-300">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{order.customerName || 'Customer'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{order.customerPhone || '0300-1234567'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="truncate max-w-xs">{order.address}</span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="py-2 border-t border-zinc-850 space-y-1">
                      {order.items.map((ci) => (
                        <div key={ci.id} className="flex justify-between text-xs text-zinc-300">
                          <span>
                            {ci.quantity}x {ci.name} {ci.selectedVariant ? `(${ci.selectedVariant})` : ''}
                          </span>
                          <span className="font-semibold text-zinc-200">{formatPKR(ci.price * ci.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Change Status Decision Buttons */}
                    {onUpdateOrderStatus && (
                      <div className="mt-3 pt-2.5 border-t border-zinc-800 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-zinc-400 mr-1">Admin Action:</span>
                        <button
                          onClick={() => onUpdateOrderStatus(order.orderId, 'confirmed')}
                          className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-xs font-semibold cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => onUpdateOrderStatus(order.orderId, 'preparing')}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 text-xs font-semibold cursor-pointer"
                        >
                          Mark Preparing
                        </button>
                        <button
                          onClick={() => onUpdateOrderStatus(order.orderId, 'on_the_way')}
                          className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 text-xs font-semibold cursor-pointer"
                        >
                          Dispatch Rider
                        </button>
                        <button
                          onClick={() => onUpdateOrderStatus(order.orderId, 'delivered')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-semibold cursor-pointer"
                        >
                          Mark Delivered
                        </button>
                        <button
                          onClick={() => onUpdateOrderStatus(order.orderId, 'cancelled')}
                          className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs font-semibold cursor-pointer"
                        >
                          Cancel Order
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Security & Change Admin Password */}
        {activeTab === 'security' && (
          <div className="flex-1 overflow-y-auto p-6 max-w-xl mx-auto w-full min-h-0 flex flex-col justify-center">
            <div className="bg-[#18181A] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="text-center mb-6">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#FF6B35]/10 border border-[#FF6B35]/20 flex items-center justify-center text-[#FF6B35]">
                  <KeyRound className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-black text-white">Change Admin Password</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Only one password controls the entire Mirchi 360 Admin Panel. Change it anytime to keep your store secure.
                </p>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Current Password
                  </label>
                  <input
                    type={showPassFields ? 'text' : 'password'}
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="Enter current password..."
                    className="w-full bg-[#222226] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6B35]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    New Password
                  </label>
                  <input
                    type={showPassFields ? 'text' : 'password'}
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="At least 6 characters..."
                    className="w-full bg-[#222226] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6B35]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type={showPassFields ? 'text' : 'password'}
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Re-enter new password..."
                    className="w-full bg-[#222226] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6B35]"
                    required
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showPassFields}
                      onChange={(e) => setShowPassFields(e.target.checked)}
                      className="rounded bg-zinc-800 border-zinc-700 text-[#FF6B35] focus:ring-0"
                    />
                    <span>Show passwords</span>
                  </label>
                </div>

                {passwordError && (
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-800 text-xs text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{passwordSuccess}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#FF6B35] hover:bg-[#ff5a1f] text-white font-bold text-sm shadow-lg shadow-[#FF6B35]/25 transition-all cursor-pointer"
                >
                  Update Admin Password
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Add / Edit Dish Modal Popup */}
        {(isAddingNew || editingItem) && (
          <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#1C1C1F] border border-zinc-700 rounded-3xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
                <h4 className="text-base font-black text-white">
                  {isAddingNew ? 'Add New Food Dish' : `Edit: ${editingItem?.name}`}
                </h4>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setIsAddingNew(false);
                  }}
                  className="p-1.5 text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveForm} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-zinc-300 mb-1">Dish Name</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    placeholder="e.g. Royal Chicken Biryani"
                    className="w-full bg-[#242428] border border-zinc-700 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-zinc-300 mb-1">Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as MenuCategory)}
                      className="w-full bg-[#242428] border border-zinc-700 rounded-xl px-3 py-2 text-white text-xs cursor-pointer"
                    >
                      {CATEGORIES.filter((c) => c.id !== 'All Items').map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-300 mb-1">Base Rate (PKR / Rs.)</label>
                    <input
                      type="number"
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      required
                      min={1}
                      className="w-full bg-[#242428] border border-zinc-700 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-zinc-300 mb-1">Description / Food Details</label>
                  <textarea
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    rows={2}
                    placeholder="Explain what is in the dish..."
                    className="w-full bg-[#242428] border border-zinc-700 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-300 mb-1">Photo Image URL</label>
                  <input
                    type="url"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#242428] border border-zinc-700 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="formStockCheck"
                    checked={formInStock}
                    onChange={(e) => setFormInStock(e.target.checked)}
                    className="rounded bg-zinc-800 border-zinc-700 text-[#FF6B35]"
                  />
                  <label htmlFor="formStockCheck" className="text-zinc-300 font-semibold cursor-pointer">
                    Item is Available & In Stock
                  </label>
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(null);
                      setIsAddingNew(false);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#FF6B35] hover:bg-[#ff5a1f] text-white font-bold cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
