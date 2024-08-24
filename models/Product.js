"use client";
import styled from 'styled-components';
import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { Cartcontext } from '@/components/Cartcontext'; 
import { supabase } from '@/utils/supabase/client';

import { useSearchParams,useRouter,usePathname } from 'next/navigation';
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

const CategoriesWrapper = styled.div`
  position: relative; /* Make this container the reference point for absolute positioning */
  width: 100%; /* Ensure it takes the full width of the container */
  height: 180px; /* zSet a fixed height for the container to manage overlap space */
  margin:10px 8px;
  overflow: hidden; /* Hide anything outside the bounds of this container */
  display: flex;
  
  justify-content: flex-start; /* Align items to the left */
`;

const CategoryContainer = styled.div`
  position:relative; /* Allows overlapping by positioning each circle absolutely */
  display: flex;
  flex-direction: column;
  align-items: center;
  margin:0 -29px; /* Remove margin to ensure precise overlap */
  padding-left:47px;
`;

const CategoryCircle = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 140px;
  height: 140px;
  background: linear-gradient(145deg, #f0f0f0, #cacaca);
  border-radius: 50%;
  box-shadow: 6px 6px 12px #bebebe, -6px -6px 12px #eee;
  text-decoration: none;
  color: #0D3D29;
  font-size: 1rem;
  font-weight: 450;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 50%;
    top: 100%;
    left: 100%;
    transition: all 0.3s ease;
  }
  
  &:hover:before {
    top: -30%;
    left: -30%;
  }

  &:hover {
    background: linear-gradient(145deg, #cacaca, #f0f0f0);
    color: #ffffff;
    box-shadow: 6px 6px 12px #bebebe, -6px -6px 12px #ffffff;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;
const Categorytitels = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: #0D3D29;
  margin-top: 10px;
  text-align: center;
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
  margin: 30px 0 20px;
  font-weight: 500;
  padding: 0 100px;
  padding-top: 30px;
`;

function Product() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState(searchParams?.get('query') || "");
  
  const { addToCart } = useContext(Cartcontext);


  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const [{ data: fetchedProducts, error: productsError }, { data: fetchedCategories, error: categoriesError }] = await Promise.all([
          supabase.from('products').select('*').limit(28),
          supabase.from('categories').select('*'),
        ]);

      
        if (productsError) {
          throw new Error(`Products fetching error: ${productsError.message}`);
        }

        if (categoriesError) {
          throw new Error(`Categories fetching error: ${categoriesError.message}`);
        }

      
        if (Array.isArray(fetchedProducts) && Array.isArray(fetchedCategories)) {
          const formattedProducts = fetchedProducts.map((item) => ({
            _id: item.id,
            description: item.description,
            image: item.img_url,
            name: item.name,
            price: item.price,
            timespanz: item.timespanz,
          }));

          const formattedCategories = fetchedCategories.map((category) => ({
            id: category.id,
            name: category.name,
            image:category.images,
          }));
          
          setProducts(formattedProducts);
          setCategories(formattedCategories);
        } else {
          setError('Data format is incorrect.');
        }
      } catch (fetchError) {
        console.error('Fetch Error:', fetchError); 
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleAddToCart = (productId) => {
    addToCart(productId);
  };

  const handleSearch = (term) => {
    setQuery(term)
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  };



  return (
    <>
      <Titleforheader>Categories</Titleforheader>
     
      <CategoriesWrapper>
        
        {categories.map((category,index) => (
          <>
          <div key={category.id}>
          <CategoryContainer>
        <CategoryCircle href={`/Category/?id=${category.id}`}>
          <img src={category.image} alt={category.name} />
        </CategoryCircle>
        <Categorytitels>{category.name}</Categorytitels>
        </CategoryContainer>
      </div>
         </>
        ))}
       
      </CategoriesWrapper>
      

      <Productsgrid>
        {products.length > 0 && products.map((product) => (
          <Productwrapper key={product._id}>
            <Whiteboxy>
            <Whitebox href={`/Product/?id=${product._id}`}>
  <img src={product.image} alt={product.name} />
</Whitebox>

            </Whiteboxy>
            <Productinfobox>
              <Titledesign>
              <Title href={`/Product/?id=${product._id}`}>{product.name}</Title>
              </Titledesign>
              <Rowprice>
                <Price>${product.price}</Price>
                <Primarybtn onClick={() => handleAddToCart(product._id)}>Add to cart</Primarybtn>
              </Rowprice>
            </Productinfobox>
          </Productwrapper>
        ))}
      </Productsgrid>
    </>
  );
}

export default Product;
