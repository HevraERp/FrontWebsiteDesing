'use client'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styled from 'styled-components';
import { supabase } from "@/utils/supabase/client";
import { useState, useContext, useEffect } from "react";
import { Cartcontext } from "@/components/Cartcontext";
import Link from 'next/link';

const Productsgrid = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr;
  padding-top: 30px;
  padding: 40px;
  @media screen and (min-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 20px;
  }
  background-color: #eee;
`;

const Productinfobox = styled.div`
  margin-top: 5px;
`;

const Whiteboxy = styled.div`
  padding: 0px 44px;
`;

const Whitebox = styled(Link)`
  background-color: #fff;
  height: 120px;
  width: 180px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  padding: 40px;
  img {
    max-width: 100%;
    max-height: 120px;
  }
`;

const Productwrapper = styled.div``;

const Titledesign = styled.div`
  justify-content: center;
  text-align: center;
  align-items: center;
`;

const Title = styled(Link)`
  font-weight: normal;
  font-size: 0.9rem;
  margin: 0;
  text-decoration: none;
  color: inherit;
  padding: 0 50px;
`;

const Primarybtn = styled.button`
  background-color: transparent;
  border: 0;
  color: #0D3D29;
  padding: 5px 15px;
  border-radius: 5px;
  font-size: 1rem;
  border: 1px solid #0D3D29;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  font-weight: 400;
  font-family: 'Poppins', sans-serif;
  svg {
    height: 20px;
    margin-right: 5px;
  }
`;

const Rowprice = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 4px;
  gap: 32px;
  margin-bottom: 17px;
  padding: 0 50px;
`;

const Price = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
`;

const Titleforheader = styled.h2`
  font-size: 2rem;
  margin: 20px 0 20px;
  font-weight: 500;
  padding: 0 100px;
  padding-top: 20px;
`;

const Titleforh3 = styled.h3`
  font-size: 1.5rem;
  margin: 20px 0 20px;
  font-weight: 500;
  padding: 0 20px;
  padding-top: 20px;
`;

export default function Wishlist() {
  const [products, setProducts] = useState<any[]>([]);
  const { addToCart } = useContext(Cartcontext);
  const [userId, setUserId] = useState<string | null>(null);


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


  const fetchData = async () => {
    try {
      const { data: wishlistItems, error } = await supabase
      .from("wishlist")
      .select("product_id")
      .eq("user_id", userId);

      if (error) throw error;

      const productIds = wishlistItems?.map(item => item.product_id) || [];

      if (productIds.length > 0) {
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .in("id", productIds);
        
        if (productsError) {
          throw productsError;
        }
        const formattedProducts = productsData?.map(product => ({
          id: product.id,
          name: product.name,
          image: product.img_url,
          price: product.price,
        }));

        setProducts(formattedProducts);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddToCart = (productId: any) => {
    addToCart(productId);
  };


  useEffect(() => {
    const initialize = async () => {
      await checkUserSession(); 
    };
  
    initialize();
  }, []);
  
  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);
  
  
  return (
    <>
      <Header />
      <Titleforheader> Favorite items here</Titleforheader>
      <Productsgrid>
        {products.map(product => (
          <Productwrapper key={product.id}>
            <Whiteboxy>
              <Whitebox href={`/Product/?id=${product.id}`}>
                <img src={product.image} alt={product.name} />
              </Whitebox>
            </Whiteboxy>
            <Productinfobox>
              <Titledesign>
                <Title href={`/Product/?id=${product.id}`}>{product.name}</Title>
              </Titledesign>
              <Rowprice>
                <Price>${product.price}</Price>
                <Primarybtn onClick={() => handleAddToCart(product.id)}>
                  Add to Cart
                </Primarybtn>
              </Rowprice>
            </Productinfobox>
          </Productwrapper>
        ))}
      </Productsgrid>
      <Footer />
    </>
  );
}
