import {
  createContext, useCallback, useContext, useEffect, useMemo, useState } from
"react";
import { toast } from "sonner";
import {
  fetchCustomers,
  fetchAdminOrders,
  blockCustomer,
  unblockCustomer,
  deleteCustomer,
  updateOrderStatus } from
"./api/adminApi";
import { getAdminToken } from "./api/client";






















export async function registryIsBlocked(email) {
  try {
    const users = await fetchCustomers({ q: email });
    return users.find((u) => u.email === email)?.status === "blocked";
  } catch {
    return false;
  }
}

export function registryRegisterUser(_data) {

  // Handled by authApi.registerUser during sign-in
}
export function registryUpdateWishlist(_email, _wishlist) {

  // Handled by userApi.updateWishlist from shop-store
}
export function registryAddOrder(_order) {

  // Orders are persisted via orderApi.createOrder
}











const RegistryCtx = createContext(null);

export function UsersRegistryProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!getAdminToken()) return;
    setLoading(true);
    try {
      const [u, o] = await Promise.all([fetchCustomers(), fetchAdminOrders()]);
      setUsers(u);
      setOrders(o.map((order) => ({
        id: order.id,
        date: order.date,
        total: order.total,
        status: order.status,
        items: order.items,
        userEmail: order.userEmail || "",
        userName: order.userName || ""
      })));
    } catch {

      // Admin not authenticated — keep empty state
    } finally {setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 15000);
    return () => clearInterval(interval);
  }, [refresh]);

  const blockUser = async (email) => {
    try {
      await blockCustomer(email);
      await refresh();
      toast("User blocked");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to block user");
    }
  };

  const unblockUser = async (email) => {
    try {
      await unblockCustomer(email);
      await refresh();
      toast.success("User unblocked");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to unblock user");
    }
  };

  const deleteUser = async (email) => {
    try {
      await deleteCustomer(email);
      await refresh();
      toast("User removed from registry");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      await refresh();
      toast.success(`Order updated → ${status}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update order");
    }
  };

  const value = useMemo(
    () => ({
      users,
      orders,
      loading,
      blockUser,
      unblockUser,
      deleteUser,
      updateOrderStatus: handleUpdateOrderStatus,
      refresh
    }),
    [users, orders, loading, refresh]
  );

  return <RegistryCtx.Provider value={value}>{children}</RegistryCtx.Provider>;
}

export function useUsersRegistry() {
  const ctx = useContext(RegistryCtx);
  if (!ctx) throw new Error("useUsersRegistry must be inside UsersRegistryProvider");
  return ctx;
}