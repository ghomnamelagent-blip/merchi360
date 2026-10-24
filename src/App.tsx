import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { KioskMenuGrid } from './components/KioskMenuGrid';
import { PromotionalBanner } from './components/PromotionalBanner';
import { OrderTracker } from './components/OrderTracker';
import { RewardsSection } from './components/RewardsSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { LiveTrackerModal } from './components/LiveTrackerModal';
import { RewardsModal } from './components/RewardsModal';
import { NotificationsPopover } from './components/NotificationsPopover';
import { ProfileModal } from './components/ProfileModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { GeminiChatbot } from './components/GeminiChatbot';
import { VERIFIED_MENU_ITEMS } from './data/menuData';
import { MenuItem, CartItem, ActiveOrder, OrderStatus, PastOrder, DishVariant } from './types';
import { Check, AlertCircle } from 'lucide-react';
import { formatPKR } from './utils/format';

// New storage key specifically for the verified 194 Mirchi 360 dishes
const MENU_STORAGE_KEY = 'mirchi360_verified_194_menu_v1';

export default function App() {
  // Wipe old obsolete keys on startup so old dummy items are deleted completely
  useEffect(() => {
    try {
      localStorage.removeItem('mirchi360_menu_items');
      localStorage.removeItem('mirchi360_menu_items_v2');
      localStorage.removeItem('fastbites_menu');
      localStorage.removeItem('fastbites_cart');
    } catch (e) {
      // ignore
    }
  }, []);

  // Live Menu Items State (194 verified dishes)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const stored = localStorage.getItem(MENU_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= 190) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored menu items', e);
    }
    return VERIFIED_MENU_ITEMS;
  });

  // Save to localStorage whenever menuItems change
  useEffect(() => {
    try {
      localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(menuItems));
    } catch (e) {
      console.warn('Failed to save menu items to localStorage', e);
    }
  }, [menuItems]);

  // Navigation & UI States
  const [activeCategory, setActiveCategory] = useState<string>('All Items');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLiveTrackerOpen, setIsLiveTrackerOpen] = useState(false);
  const [isRewardsModalOpen, setIsRewardsModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Admin Single-User Password Protection States
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  // Trigger Admin flow
  const handleOpenAdmin = () => {
    if (isAdminAuthenticated) {
      setIsAdminPanelOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  // Check URL hash for #admin
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        handleOpenAdmin();
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [isAdminAuthenticated]);

  // Initial cart with a verified signature dish
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'cart-init-1',
      menuItemId: 'dish-1',
      name: 'Royal Sindhi Chicken Biryani',
      category: 'Desi Items',
      image: VERIFIED_MENU_ITEMS[0].image,
      selectedVariant: 'Half',
      price: 1070,
      quantity: 1,
    },
  ]);
  const [appliedPromo, setAppliedPromo] = useState<string>('');
  const [userPoints, setUserPoints] = useState<number>(1200);

  // Active Orders for live kitchen decisions & tracking
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([
    {
      orderId: 'M360-8492',
      status: 'preparing',
      items: [
        {
          id: 'order-item-1',
          menuItemId: 'dish-1',
          name: 'Royal Sindhi Chicken Biryani',
          category: 'Desi Items',
          image: VERIFIED_MENU_ITEMS[0].image,
          selectedVariant: 'Full',
          price: 1900,
          quantity: 1,
        },
        {
          id: 'order-item-2',
          menuItemId: 'dish-121',
          name: 'French Fries',
          category: 'Fish & Appetizers',
          image: VERIFIED_MENU_ITEMS[120].image,
          price: 300,
          quantity: 1,
        },
      ],
      subtotal: 2200,
      discount: 0,
      deliveryFee: 0,
      total: 2350,
      estimatedMinutes: 24,
      placedAt: '12 mins ago',
      address: 'House #14, Street 5, Phase 6, DHA, Karachi',
      riderName: 'Tariq (Courier)',
      riderVehicle: 'Mirchi Express 125cc',
      customerName: 'Hamza Khan',
      customerPhone: '0300-1234567',
    },
  ]);

  // Past Orders for User Profile 'Order History' Tab (Prices in PKR)
  const [pastOrders, setPastOrders] = useState<PastOrder[]>([
    {
      id: 'past-1',
      orderNumber: 'M360-7182',
      date: 'Oct 17, 2026 · 7:42 PM',
      status: 'Delivered',
      items: [
        {
          id: 'past-item-1',
          menuItemId: 'dish-1',
          name: 'Royal Sindhi Chicken Biryani',
          category: 'Desi Items',
          image: VERIFIED_MENU_ITEMS[0].image,
          selectedVariant: 'Half',
          price: 1070,
          quantity: 1,
        },
        {
          id: 'past-item-2',
          menuItemId: 'dish-121',
          name: 'French Fries',
          category: 'Fish & Appetizers',
          image: VERIFIED_MENU_ITEMS[120].image,
          price: 300,
          quantity: 1,
        },
      ],
      total: 1370,
    },
    {
      id: 'past-2',
      orderNumber: 'M360-6391',
      date: 'Oct 12, 2026 · 6:15 PM',
      status: 'Delivered',
      items: [
        {
          id: 'past-item-3',
          menuItemId: 'dish-188',
          name: 'Biryani Deal No 2',
          category: 'Special Deals',
          image: VERIFIED_MENU_ITEMS[187].image,
          price: 1870,
          quantity: 1,
        },
      ],
      total: 1870,
    },
  ]);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  const showToast = (msg: string, isError = false) => {
    setToastMessage({ text: msg, isError });
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Add dish to cart (supporting variants)
  const handleAddToCart = (item: MenuItem, variant?: DishVariant) => {
    if (item.inStock === false) {
      showToast(`"${item.name}" is currently out of stock.`, true);
      return;
    }

    const price = variant ? variant.price : item.price;
    const variantName = variant ? variant.name : undefined;
    const cartItemId = `${item.id}-${variantName || 'standard'}`;

    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === cartItemId);
      if (existing) {
        return prev.map((i) => (i.id === cartItemId ? { ...i, quantity: i.quantity + 1 } : i));
      } else {
        const newCartItem: CartItem = {
          id: cartItemId,
          menuItemId: item.id,
          name: item.name,
          category: item.category,
          image: item.image,
          selectedVariant: variantName,
          price: price,
          quantity: 1,
        };
        return [...prev, newCartItem];
      }
    });

    showToast(`Added ${item.name}${variantName ? ` (${variantName})` : ''} - ${formatPKR(price)} to cart!`);
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleApplyPromo = (code: string): boolean => {
    const cleanCode = code.toUpperCase().trim();
    if (['MIRCHI20', 'MIRCHI360', 'CRUNCH20'].includes(cleanCode)) {
      setAppliedPromo('MIRCHI20');
      showToast('20% Mirchi 360 discount applied to your order!');
      return true;
    }
    return false;
  };

  const handleClaimWeekendDeal = () => {
    setAppliedPromo('MIRCHI20');
    showToast('MIRCHI20 applied! 20% discount activated.');
    const el = document.getElementById('menu-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRedeemReward = (title: string, cost: number) => {
    if (userPoints >= cost) {
      setUserPoints((prev) => prev - cost);
      showToast(`Redeemed "${title}"! It has been added to your profile perks.`);
    }
  };

  // Reorder handler for Order History tab
  const handleReorder = (itemsToReorder: CartItem[]) => {
    const newItems: CartItem[] = itemsToReorder.map((item) => ({
      ...item,
      id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    }));

    setCartItems((prev) => [...prev, ...newItems]);
    showToast(`Reordered! ${newItems.length} dishes added to your basket.`);
  };

  // Checkout Placement Handler (PKR Calculations)
  const handleOrderSuccess = (details: {
    name: string;
    address: string;
    phone: string;
    paymentMethod: string;
  }) => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = appliedPromo ? subtotal * 0.2 : 0;
    const deliveryFee = subtotal >= 2000 ? 0 : 150;
    const estimatedTax = (subtotal - discount) * 0.05;
    const total = subtotal - discount + deliveryFee + estimatedTax + 150; // default rider tip

    const generatedNum = `${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: ActiveOrder = {
      orderId: `M360-${generatedNum}`,
      status: 'confirmed',
      items: [...cartItems],
      subtotal,
      discount,
      deliveryFee,
      total,
      estimatedMinutes: 28,
      placedAt: 'Just now',
      address: details.address,
      riderName: 'Tariq (Courier)',
      riderVehicle: 'Mirchi Express 125cc',
      customerName: details.name,
      customerPhone: details.phone,
    };

    // Add to active orders and history
    setActiveOrders((prev) => [newOrder, ...prev]);

    const historyEntry: PastOrder = {
      id: `past-${Date.now()}`,
      orderNumber: `M360-${generatedNum}`,
      date: 'Today · Just now',
      status: 'In Progress',
      items: [...cartItems],
      total,
      address: details.address,
    };

    setPastOrders((prev) => [historyEntry, ...prev]);
    setCartItems([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setUserPoints((prev) => prev + Math.round((total / 100) * 10)); // 10 pts per Rs. 100
    setIsLiveTrackerOpen(true);
    showToast('Order confirmed with Mirchi 360! Kitchen received your order.');
  };

  // Admin Actions
  const handleToggleStock = (itemId: string) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const nextState = item.inStock === false ? true : false;
          showToast(`"${item.name}" is now marked ${nextState ? 'IN STOCK' : 'OUT OF STOCK'}`);
          return { ...item, inStock: nextState };
        }
        return item;
      })
    );
  };

  const handleAddDish = (newItem: MenuItem) => {
    setMenuItems((prev) => [newItem, ...prev]);
  };

  const handleUpdateDish = (updatedItem: MenuItem) => {
    setMenuItems((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
  };

  const handleDeleteDish = (itemId: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset menu back to the verified 194 Mirchi 360 dishes?')) {
      setMenuItems(VERIFIED_MENU_ITEMS);
      localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(VERIFIED_MENU_ITEMS));
      showToast('Menu successfully restored to the 194 verified Mirchi 360 dishes!');
    }
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setActiveOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status } : o))
    );
    showToast(`Order #${orderId} marked as ${status.replace('_', ' ').toUpperCase()}`);
  };

  const cartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartDiscount = appliedPromo ? cartSubtotal * 0.2 : 0;
  const cartDeliveryFee = cartSubtotal >= 2000 || cartSubtotal === 0 ? 0 : 150;
  const cartTax = (cartSubtotal - cartDiscount) * 0.05;
  const cartTotal = cartSubtotal > 0 ? cartSubtotal - cartDiscount + cartDeliveryFee + cartTax + 150 : 0;

  return (
    <div className="min-h-screen bg-[#121212] text-[#E0E0E0] flex flex-col selection:bg-[#FF6B35] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-20 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl border text-white shadow-2xl text-xs sm:text-sm font-semibold animate-in slide-in-from-top-4 duration-200 ${
            toastMessage.isError
              ? 'bg-red-950/90 border-red-600'
              : 'bg-[#1E1E22] border-[#FF6B35]/70'
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
              toastMessage.isError ? 'bg-red-600' : 'bg-[#FF6B35]'
            }`}
          >
            {toastMessage.isError ? (
              <AlertCircle className="w-3.5 h-3.5 text-white" />
            ) : (
              <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
            )}
          </div>
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Sticky Top Navigation */}
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        unreadCount={1}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20 lg:pb-0">
        {/* Hero Section */}
        <Hero
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleFilterModal={() => {
            const el = document.getElementById('menu-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          hasActiveFilters={false}
        />

        {/* Digital Kiosk Interactive Menu Grid: Category Buttons + Dish Cards */}
        <KioskMenuGrid
          items={menuItems}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddToCart={handleAddToCart}
        />

        {/* Promotional Banner */}
        <PromotionalBanner onClaimDeal={handleClaimWeekendDeal} />

        {/* Order Tracker */}
        {activeOrders.length > 0 && (
          <OrderTracker
            order={activeOrders[0]}
            onOpenLiveTracker={() => setIsLiveTrackerOpen(true)}
          />
        )}

        {/* Rewards Section */}
        <RewardsSection
          points={userPoints}
          onOpenRewardsModal={() => setIsRewardsModalOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={handleOpenAdmin} />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        appliedPromo={appliedPromo}
        onApplyPromo={handleApplyPromo}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        total={cartTotal}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Live Order Tracker Modal */}
      {activeOrders.length > 0 && (
        <LiveTrackerModal
          isOpen={isLiveTrackerOpen}
          onClose={() => setIsLiveTrackerOpen(false)}
          order={activeOrders[0]}
          onUpdateStatus={(st) => handleUpdateOrderStatus(activeOrders[0].orderId, st)}
        />
      )}

      {/* Rewards Modal */}
      <RewardsModal
        isOpen={isRewardsModalOpen}
        onClose={() => setIsRewardsModalOpen(false)}
        points={userPoints}
        onRedeemReward={handleRedeemReward}
      />

      {/* Notifications Popover */}
      <NotificationsPopover
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onSelectPromoNotification={handleClaimWeekendDeal}
      />

      {/* User Profile Modal with Order History & Reorder */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onOpenRewards={() => setIsRewardsModalOpen(true)}
        pastOrders={pastOrders}
        onReorder={handleReorder}
      />

      {/* Single-Admin Password Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setIsAdminAuthenticated(true);
          setIsAdminLoginOpen(false);
          setIsAdminPanelOpen(true);
          showToast('Welcome Admin! Mirchi 360 Management Dashboard unlocked.');
        }}
      />

      {/* Secure Admin Dashboard Panel */}
      <AdminPanelModal
        isOpen={isAdminPanelOpen}
        onClose={() => {
          setIsAdminPanelOpen(false);
          if (window.location.hash === '#admin') {
            window.history.pushState('', document.title, window.location.pathname + window.location.search);
          }
        }}
        items={menuItems}
        onToggleStock={handleToggleStock}
        onAddItem={handleAddDish}
        onUpdateItem={handleUpdateDish}
        onDeleteItem={handleDeleteDish}
        onResetDefaults={handleResetDefaults}
        activeOrders={activeOrders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onNotify={(msg, isErr) => showToast(msg, isErr)}
      />

      {/* Dynamic Gemini AI Culinary Concierge */}
      <GeminiChatbot
        onApplyPromo={handleApplyPromo}
        currentMenu={menuItems}
      />
    </div>
  );
}
