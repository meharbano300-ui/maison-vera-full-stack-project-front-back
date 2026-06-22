import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { registerUser, loginUser } from "./api/authApi";
import {
  fetchUser,
  updateProfile as apiUpdateProfile,
  addAddress as apiAddAddress,
  updateAddress as apiUpdateAddress,
  removeAddress as apiRemoveAddress,
  setDefaultAddress as apiSetDefaultAddress,
  addCard as apiAddCard,
  removeCard as apiRemoveCard,
  setDefaultCard as apiSetDefaultCard,
  deleteAccount as apiDeleteAccount,
  fetchUserOrders } from
"./api/userApi";
import { createOrder, cancelOrder as apiCancelOrder } from "./api/orderApi";
import { getStoredUserEmail, setStoredUserEmail } from "./api/client";































































































const Ctx = createContext(null);
const KEY = "maison_account_v1";

function loadLocal() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
}

function rid() {
  return Math.random().toString(36).slice(2, 9).toUpperCase();
}

export function UserProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [cards, setCards] = useState([]);
  const [orders, setOrders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState({
    orders: true,
    arrivals: true,
    events: true,
    promos: false,
    styling: false
  });
  const [ready, setReady] = useState(false);

  const applyUserData = useCallback((data) => {
    setProfile(data.profile);
    setAddresses(data.addresses);
    setCards(data.cards);
  }, []);

  const reloadUser = useCallback(async () => {
    const email = profile?.email || getStoredUserEmail();
    if (!email) return;
    try {
      const [data, userOrders] = await Promise.all([fetchUser(email), fetchUserOrders(email)]);
      applyUserData(data);
      setOrders(userOrders);
    } catch {

      // Keep cached local state if API unavailable
    }}, [profile?.email, applyUserData]);

  useEffect(() => {
    const d = loadLocal();
    if (d) {
      setProfile(d.profile ?? null);
      setAddresses(d.addresses ?? []);
      setCards(d.cards ?? []);
      setOrders(d.orders ?? []);
      setAppointments(d.appointments ?? []);
      if (d.notifications) setNotifications(d.notifications);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(
      KEY,
      JSON.stringify({ profile, addresses, cards, orders, appointments, notifications })
    );
  }, [profile, addresses, cards, orders, appointments, notifications, ready]);

  useEffect(() => {
    if (profile?.email) reloadUser();
  }, [profile?.email]); // eslint-disable-line react-hooks/exhaustive-deps

  const value = useMemo(
    () => ({
      profile,
      addresses,
      cards,
      orders,
      appointments,
      notifications,
      isLoggedIn: !!profile,
      reloadUser,

      signIn: async (p) => {
        try {
          // signIn is now only used for LOGIN (signup page calls registerUser directly)
          await loginUser({ email: p.email, password: p.password });
          setStoredUserEmail(p.email);
          const data = await fetchUser(p.email);
          applyUserData(data);
          const userOrders = await fetchUserOrders(p.email);
          setOrders(userOrders);
          toast.success("Welcome to the Maison");
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Sign in failed");
          throw err;
        }
      },
      signOut: () => {
        setProfile(null);
        setStoredUserEmail(null);
        toast("Signed out of your salon");
      },
      updateProfile: async (p) => {
        if (!profile) return;
        try {
          const data = await apiUpdateProfile(profile.email, p);
          applyUserData(data);
          toast.success("Profile updated");
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Update failed");
        }
      },
      deleteAccount: async () => {
        if (!profile) return;
        try {
          await apiDeleteAccount(profile.email);
          localStorage.removeItem(KEY);
          setProfile(null);
          setAddresses([]);
          setCards([]);
          setOrders([]);
          setAppointments([]);
          setStoredUserEmail(null);
          toast("Your account has been deleted");
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Delete failed");
        }
      },

      addAddress: async (a) => {
        if (!profile) return;
        try {
          const data = await apiAddAddress(profile.email, a);
          applyUserData(data);
          toast.success("Address saved");
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Failed to save address");
        }
      },
      updateAddress: async (id, a) => {
        if (!profile) return;
        try {
          const data = await apiUpdateAddress(profile.email, id, a);
          applyUserData(data);
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Failed to update address");
        }
      },
      removeAddress: async (id) => {
        if (!profile) return;
        try {
          const data = await apiRemoveAddress(profile.email, id);
          applyUserData(data);
          toast("Address removed");
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Failed to remove address");
        }
      },
      setDefaultAddress: async (id) => {
        if (!profile) return;
        try {
          const data = await apiSetDefaultAddress(profile.email, id);
          applyUserData(data);
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Failed to set default");
        }
      },

      addCard: async ({ number, ...rest }) => {
        if (!profile) return;
        const last4 = number.replace(/\s+/g, "").slice(-4);
        try {
          const data = await apiAddCard(profile.email, { ...rest, last4 });
          applyUserData(data);
          toast.success("Card added to your wallet");
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Failed to add card");
        }
      },
      removeCard: async (id) => {
        if (!profile) return;
        try {
          const data = await apiRemoveCard(profile.email, id);
          applyUserData(data);
          toast("Card removed");
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Failed to remove card");
        }
      },
      setDefaultCard: async (id) => {
        if (!profile) return;
        try {
          const data = await apiSetDefaultCard(profile.email, id);
          applyUserData(data);
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Failed to set default card");
        }
      },

      placeOrder: async (items, total, extras = {}) => {
        const email = profile?.email || extras.shippingAddress?.email;
        if (!email) throw new Error("Email required to place order");

        const order = await createOrder({
          userEmail: email,
          userName: profile?.name || extras.shippingAddress?.name || "Maison Guest",
          items,
          subtotal: extras.subtotal ?? total,
          shippingCost: extras.shippingCost ?? 0,
          deliveryMethod: extras.deliveryMethod,
          couponCode: extras.couponCode,
          shippingAddress: extras.shippingAddress,
          paymentMethod: extras.paymentMethod
        });

        setOrders((prev) => [order, ...prev]);
        toast.success("Order placed", { description: order.id });
        return order;
      },
      cancelOrder: async (id) => {
        try {
          const order = await apiCancelOrder(id);
          setOrders((prev) => prev.map((o) => o.id === id ? order : o));
          toast("Order cancelled");
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Cancel failed");
        }
      },

      bookAppointment: (a) => {
        setAppointments((prev) => [{ ...a, id: rid() }, ...prev]);
        toast.success("Appointment booked", { description: `${a.date} at ${a.time}` });
      },
      cancelAppointment: (id) => {
        setAppointments((prev) => prev.filter((a) => a.id !== id));
        toast("Appointment cancelled");
      },

      setNotification: (key, on) => setNotifications((prev) => ({ ...prev, [key]: on }))
    }),
    [profile, addresses, cards, orders, appointments, notifications, applyUserData, reloadUser]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUser() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useUser must be inside UserProvider");
  return c;
}