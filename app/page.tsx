"use client";

import Header from "@/components/Header"
import Featured from "@/components/Featured";
import { CartProvider } from "@/components/Cartcontext";
import Footer from "@/components/Footer";

export default function Home() {
  return (
  <>
  <CartProvider>
    <Header/>
    <Featured/>
    <Footer/>
  </CartProvider>
  </>
  );
}
