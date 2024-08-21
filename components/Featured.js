"use client";
import styled from "styled-components";
import Product from "../models/Product";
import Link from "next/link";

import { useContext, useState } from "react";
import { Cartcontext } from "./Cartcontext"; 

const Bg = styled.div`
  background-color: #222;
  color: #fff;
  padding: 50px 0;
  `
;
const Centre = styled.div`
max-width: 800px;
margin: 0 auto;
padding: 0 20px;
`;
const Title = styled.h1`
  margin: 0;
  font-weight: normal;
  font-size: 1.5rem;
    @media screen and (min-width : 768px){
    font-size: 3rem;
    }
`;
const Desc = styled.p`
  color: #aaa;
  font-size: .8rem;
`;
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 100px;
  
  div:nth-child(1){
  order:2;}
  img {
    max-width: 370px;
    max-height:200px;
    display:block;
    margin: 0 auto;
  }
     @media screen and (min-width : 768px){
 grid-template-columns: 1.2fr 0.8fr;
 
 div:nth-child(1){
  order:0;
  }
   img {
    max-width: 380px;
  }
  }
`;
const Column = styled.div`
  display: flex;
  align-items: center;
`;
const Primarybtn = styled.button`
  background-color: #fff;
  border: 0;
  color: #000;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1.2rem;
  border: 1px solid #4C1D95;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  svg {
    height: 20px;
    margin-right: 5px;
  }
`;
const Buttonlink = styled(Link)`
  background-color: transparent;
  border: 0;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1.2rem;
  cursor: pointer;
  border: 1px solid #fff;
  text-decoration: none;
`;
const Buttonwrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 35px;
`;



export default function Featured({product = { id: null, name: '', price: 0 } }) {
  const { addToCart } = useContext(Cartcontext);

  const handleAddToCart = () => {
    addToCart(product.id);
  };

  return (
    <>
      <Bg>
        <Centre>
          <Wrapper>
            <Column>
              <div>
                <Title>MacBook Pro</Title>
                <Desc>
                  This model has the M3 chip and includes two Thunderbolt / USB 4 ports.
                  Colors: Silver, space gray
                  Model Identifier: Mac15,3
                  Newest compatible operating system: macOS Sonoma
                </Desc>
                <Buttonwrapper>
                  <Buttonlink href={'/product/product_id'} outline={1} white={1}>Read more</Buttonlink>
                  <Primarybtn onClick={handleAddToCart}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
<path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
</svg>
                    Add to cart
                  </Primarybtn>
                </Buttonwrapper>
              </div>
            </Column>
            <Column>
              <img src='mackpro.png' alt="" />
            </Column>
          </Wrapper>
        </Centre>
      </Bg>
      <Product product={product} />
    </>
  );
}
