import React, { createContext, useContext, useEffect, useState } from 'react';
import { productById } from '../data/shop';

const Context = createContext(null);
const key = 'rozogorod.cart.v1';
function readCart() {
  try {
    const data = JSON.parse(localStorage.getItem(key)) || {};
    return Object.fromEntries(Object.entries(data).filter(([id, qty]) =>
      productById[id] && Number.isInteger(qty) && qty > 0 && qty <= 99));
  } catch { return {}; }
}
export function CartProvider({ children }) {
  const [cart, setCart] = useState(readCart);
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(cart)); } catch { /* In-memory cart still works. */ }
  }, [cart]);
  function change(id, delta) {
    if (!productById[id]) return;
    setCart(old => {
      const next = { ...old };
      const qty = Math.min(99, (old[id] || 0) + delta);
      if (qty > 0) next[id] = qty;
      else delete next[id];
      return next;
    });
  }
  const lines = Object.entries(cart).map(([id, qty]) => ({ product: productById[id], qty }));
  const count = lines.reduce((sum, line) => sum + line.qty, 0);
  const total = lines.reduce((sum, line) => sum + line.product.price * line.qty, 0);
  return <Context.Provider value={{cart,lines,count,total,change,clear:()=>setCart({})}}>{children}</Context.Provider>;
}
export const useCart = () => useContext(Context);
