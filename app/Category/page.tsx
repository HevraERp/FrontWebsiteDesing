"use client";
import styled from 'styled-components';
import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { Cartcontext } from '@/components/Cartcontext';
import { supabase } from '@/utils/supabase/client';
import Header from '@/components/Header';
import { useSearchParams } from 'next/navigation';
import Footer from '@/components/Footer';

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

`
const FilterWrapper = styled.div`
  margin: 20px 0;
  padding-left:80px;
`;

const CheckboxWrapper = styled.div`
  margin: 10px 0;
  display: flex;
  align-items: center;
`;

const CheckboxInput = styled.input`
  display: none;
`;

const CheckboxLabel = styled.label<{ checked?: boolean }>`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 1rem;
  color: ${({ checked }) => (checked ? '#000' : '#000')};
  font-weight: ${({ checked }) => (checked ? 'bold' : 'normal')};
  position: relative;
  padding-left: 30px; // Space for the checkbox

  &:before {
    content: '';
    display: inline-block;
    width: 24px;
    height: 24px;
    border: 2px solid ${({ checked }) => (checked ? '#000' : '#000')};
    border-radius: 4px;
    margin-right: 8px;
    background-color: ${({ checked }) => (checked ? '#000' : 'transparent')};
    position: relative;
    transition: background-color 0.3s ease, border-color 0.3s ease;

    &:after {
      content: '';
      display: ${({ checked }) => (checked ? 'block' : 'none')};
      width: 12px;
      height: 12px;
      background: white;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
      border-radius: 2px;
    }
  }
`;

function Category() {
  const [products, setProducts] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [categoryName, setCategoryName] = useState<string>('');

  const { addToCart } = useContext(Cartcontext);
  const searchparams = useSearchParams();
  const id = searchparams?.get('id') || '';

  const fetchData = async () => {
    try {
      // Fetch category name
      const { data: category, error: categoryError } = await supabase
        .from('categories')
        .select('name')
        .eq('id', id)
        .single();

      if (categoryError) {
        throw categoryError;
      }

      setCategoryName(category?.name || '');

      // Fetch products
      const { data: products, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', id);

      if (productError) {
        throw productError;
      }

      const formattedProducts = products?.map(product => ({
        id: product.id,
        name: product.name,
        image: product.img_url,
        price: product.price,
        brand_id: product.brand_id
      }));

      setProducts(formattedProducts);

      // Fetch brands
      const brandIds = products?.map(product => product.brand_id);
      if (brandIds.length > 0) {
        const { data: brands, error: brandError } = await supabase
          .from('brand')
          .select('*')
          .in('id', brandIds);

        if (brandError) {
          throw brandError;
        }

        const formattedBrands = brands?.map(brand => ({
          id: brand.id,
          name: brand.name,
        }));

        setBrands(formattedBrands);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);


  const handleAddToCart = (productId: any) => {
    addToCart(productId);
  };

  const handleCheckboxChange = (brandId: string) => {
    setSelectedBrands(prev =>
      prev.has(brandId)
        ? new Set([...prev].filter(id => id !== brandId))
        : new Set(prev).add(brandId)
    );
  };

  // Filter products based on selected brands
  const filteredProducts = selectedBrands.size
    ? products.filter(product => selectedBrands.has(product.brand_id))
    : products;

  return (
    <>
      <Header />
      <Titleforheader>{categoryName}  Category</Titleforheader>

      {brands.length > 0 && (
        <FilterWrapper>
          <Titleforh3>Filter by Brand</Titleforh3>
          {brands.map(brand => (
            <CheckboxWrapper key={brand.id}>
              <CheckboxInput
                type="checkbox"
                id={`brand-${brand.id}`}
                checked={selectedBrands.has(brand.id)}
                onChange={() => handleCheckboxChange(brand.id)}
              />
              <CheckboxLabel
                htmlFor={`brand-${brand.id}`}
                checked={selectedBrands.has(brand.id)}
              >
                {brand.name}
              </CheckboxLabel>
            </CheckboxWrapper>
          ))}
        </FilterWrapper>
      )}

      <Productsgrid>
        {filteredProducts.length > 0 && filteredProducts.map(product => (
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

export default Category;
