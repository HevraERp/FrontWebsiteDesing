'use client'

import { createContext, useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';

export const Cartcontext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
const [userId, setUserId] = useState(null);


const checkUserSession = async () => {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    if (session && session.user) {
      const userId_INAUTHENTICATE_TABLE = session.user.email;
      const { data: user, error: userError } = await supabase
        .from("clients")
        .select("id")
        .eq("email", userId_INAUTHENTICATE_TABLE);

      const user_id = user?.[0]?.id || null;
      setUserId(user_id);
    } 
  } catch (error) {
    console.error("Error checking user session:", error);
  }
};

  useEffect(() => {
    const fetchCart = async () => {
      const { data, error } = await supabase
      .from("shoppingcart")
      .select("*")
      .eq("user_id", userId);

      if (error) {
        console.error('Error fetching cart:', error);
      } else {
        setCart(data || []);
      }
    };

    
checkUserSession();
    fetchCart();
  }, []);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const addToCart = async (product_id) => {
    const {data:cart } = await supabase.from('shoppingcart').select('*')
    const existingItem = cart.find(item => item.product_id === product_id);

    if (existingItem) {
      const { error } = await supabase
      .from('shoppingcart')
      .update({ quantity: existingItem.quantity + 1 })
      .eq('product_id', product_id).select();
   
      if (error) {
        console.error('Error updating cart:', error);
      } else {
        setCart(cart.map(item => 
          item.product_id === product_id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      }
    } else {
      const { data, error } = await supabase
        .from('shoppingcart')
        .insert([{ user_id:userId ,  product_id :  product_id, quantity: 1 }])
        .select();

      if (error) {
        console.error('Error adding to cart:', error);
      } else {
        setCart([...cart, ...data]);
      }
    }
  };

  const removeProduct = async (product_id) => {
    const {data:cart } = await supabase.from('shoppingcart').select('*')
    const existingItem = cart.find(item => item.product_id === product_id);

    if (existingItem) {
      if (existingItem.quantity > 1) {
        const {error } = await supabase
          .from('shoppingcart')
          .update({ quantity: existingItem.quantity - 1 })
          .eq('product_id', product_id).select();

        if (error) {
          console.error('Error updating cart:', error);
        } else {
          setCart(cart.map(item => 
            item.product_id === product_id ? { ...item, quantity: item.quantity - 1 } : item
          ));
        }
      } else {
        const { error } = await supabase
          .from('shoppingcart')
          .delete()
          .eq('product_id', product_id);

        if (error) {
          console.error('Error removing product from cart:', error);
        } else {
          setCart(cart.filter(item => item.product_id !== product_id));
        }
      }
    }
  };

  return (
    <Cartcontext.Provider value={{ cart, cartCount, addToCart, removeProduct }}>
      {children}
    </Cartcontext.Provider>
  );
}
