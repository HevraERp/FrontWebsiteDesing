"use client";
import Header from "@/components/Header";
import styled from "styled-components";
import { Cartcontext } from "@/components/Cartcontext";
import { useState, useEffect, useContext } from "react";
import Footer from "@/components/Footer";
import { supabase } from "@/utils/supabase/client";
import Button from "@/components/Button";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr 0.8fr;
  }
  gap: 40px;
  margin-top: 40px;
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
  width: 500px;
  margin-left: 100px;
  margin-right: 20px;
  margin-bottom: 100px;
`;

const ProductInfoCell = styled.td`
  padding: 10px 20px;
  padding-left: 0px;
  padding-right: 30px;
`;

const ProductImageBox = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img {
    max-width: 180px;
    max-height: 180px;
  }
  @media screen and (min-width: 768px) {
    padding: 10px;
    width: 100%;
    height: 100%;
    img {
      max-width: 180px;
      max-height: 180px;
    }
  }
`;

const QuantityLabel = styled.span`
  padding: 15px;
  display: block;
  @media screen and (min-width: 768px) {
    display: inline-block;
    padding: 0 10px;
  }
`;
const Bg = styled.div`
  background-color: #eee;
  min-height: 100vh;
`;

const Centre = styled.div`
  max-width: 1300px;
  max-height:100px
  margin-buttom:10px;
  padding: 0 20px;
`;

const FormWrapper = styled.div`
  max-width: 1000px;
  margin: auto;
  padding: 32px;
  background-color: #fff;
  border-radius: 8px;
`;

const FormTitle = styled.h2`
  font-size: 2rem;
  color: #333;
  font-weight: bold;
`;

const Form = styled.form`
  margin-top: 32px;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  color: #333;
  margin-bottom: 16px;
`;

const InputGrid = styled.div`
  display: grid;
  gap: 16px;
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const InputField = styled.input`
  padding: 12px 16px;
  background-color: #f3f3f3;
  color: #333;
  font-size: 0.875rem;
  border-radius: 8px;
  border: 1px solid transparent;
  &:focus {
    outline: none;
    border-color: #1e90ff;
    background-color: #fff;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 32px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const CancelButton = styled.button`
  padding: 12px 24px;
  background-color: transparent;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 8px;
  flex: 1;
  cursor: pointer;
  &:hover {
    background-color: #f3f3f3;
  }
`;

const PurchaseButton = styled.button`
  padding: 12px 24px;
  background-color: #1e90ff;
  color: #fff;
  border: none;
  border-radius: 8px;
  flex: 1;
  cursor: pointer;
  &:hover {
    background-color: #1c86ee;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  th {
    text-align: left;
    text-transform: uppercase;
    color: black;
    font-weight: 600;
    font-size: 0.7rem;
  }
  td {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
`;

export default function CardPage() {
  const { addToCart, removeProduct} = useContext(Cartcontext);
  const [cart, setCart] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneName] = useState("");

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

      if (session?.user) {
        const userId_INAUTHENTICATE_TABLE = session.user.email;
        const { data: user, error: userError } = await supabase
          .from("clients")
          .select("id")
          .eq("email", userId_INAUTHENTICATE_TABLE);
  
        if (userError) {
          console.error("Error fetching user from Supabase:", userError);
          return;
        }
  
        const user_id = user?.[0]?.id;
        setUserId(user_id);
    
      } 
    } catch (error) {
      console.error("Error checking user session:", error);
    }
  };


const fetchProducts = async () => {
      const { data: cartData, error: CardError } = await supabase
        .from("shoppingcart")
        .select("*")
        .eq('user_id',userId);

      if (CardError) {
        console.error("Error fetching cards from Supabase:", CardError);
        return;
      }
      const cardItems = cartData.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }));

      setCart(cardItems);

      if (cardItems.length > 0) {
        try {
          const productIds = cardItems.map((item) => item.product_id);

          const { data: productsData, error: supabaseError } = await supabase
            .from("products")
            .select("*")
            .in("id", productIds);

          if (supabaseError) {
            console.error(
              "Error fetching products from Supabase:",
              supabaseError
            );
            return;
          }

          const formattedProducts = productsData.map((item) => {
            const cartItem = cardItems.find(
              (cartItem) => cartItem.product_id === item.id
            );
            return {
              _id: item.id,
              description: item.description,
              image: item.img_url,
              name: item.name,
              price: item.price,
              quantity: cartItem ? cartItem.quantity : 0,
            };
          });

          setProducts(formattedProducts);
        } catch (error) {
          console.error("Error:", error);
        }
      }
 };


  function moreOfThisProduct(id: string) {
   addToCart(id);
   console.log("more of this items " + id)
  setProducts(prevProducts =>
    prevProducts.map(product =>
      product._id === id
        ? { ...product, quantity: product.quantity + 1 }
        : product
    )
  );
}

  

  
useEffect(() => {
  const initialize = async () => {
    await checkUserSession(); 
  };

  initialize();
}, []);

useEffect(() => {
  if (userId) {
    fetchProducts();
  }
}, [userId]);



function lessOfThisProduct(id: string) {
  removeProduct(id);
  setProducts(prevProducts =>
    prevProducts
      .map(product =>
        product._id === id
          ? { ...product, quantity: Math.max(product.quantity - 1, 0) }
          : product
      )
      .filter(product => product.quantity > 0) 
  );

}


  let total = 0;
  for (const product of products) {
    const productTotal = product.price * product.quantity;
    total += productTotal;
  }

  return (
    <>
      {" "}
      <Bg>
        <Header />
        <Centre>
          <ColumnsWrapper>
            <Box>
              <h2>Cart</h2>
              {!products?.length && <div>Your cart is empty</div>}
              {products?.length > 0 && (
                <StyledTable>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product._id}>
                          <ProductInfoCell>
                            <ProductImageBox>
                              <img src={product.image} alt="" />
                            </ProductImageBox>
                            {product.title}
                          </ProductInfoCell>
                          <td>
                            <Button
                              onClick={() => lessOfThisProduct(product._id)}
                            >
                              -
                            </Button>
                            <QuantityLabel>{product.quantity}</QuantityLabel>
                            <Button
                              onClick={() => moreOfThisProduct(product._id)}
                            >
                              +
                            </Button>
                          </td>
                          <td>${product.quantity * product.price}</td>
                        </tr>
                      ))}
                      <tr>
                        <td></td>
                        <td></td>
                        <td>Total : ${total}</td>
                      </tr>
                    </tbody>
                </StyledTable>
              )}
            </Box>
            {!!cart?.length && (
              <FormWrapper>
                <FormTitle>Complete your order</FormTitle>
                <Form>
                  <SectionTitle>Personal Details</SectionTitle>
                  <InputGrid>
                    <InputField type="text" placeholder="First Name" />
                    <InputField type="text" placeholder="Last Name" />
                    <InputField type="email" placeholder="Email" />
                    <InputField type="number" placeholder="Phone No." />
                  </InputGrid>
                  <SectionTitle>Shipping Address</SectionTitle>
                  <InputGrid>
                    <InputField type="text" placeholder="Address Line" />
                    <InputField type="text" placeholder="City" />
                    <InputField type="text" placeholder="State" />
                    <InputField type="text" placeholder="Zip Code" />
                  </InputGrid>

                  <SectionTitle>Card Detail</SectionTitle>
                  <InputGrid>
                    <InputField type="text" placeholder="cardholder Name" />
                    <InputField type="number" placeholder="Card Number" />
                    <InputField type="number" placeholder="Card CVV" />
                    <InputField type="date" placeholder="Expire date" />
                  </InputGrid>
                  <ButtonGroup>
                    <CancelButton type="button">Cancel</CancelButton>
                    <PurchaseButton type="button">
                      Complete Purchase
                    </PurchaseButton>
                  </ButtonGroup>
                </Form>
              </FormWrapper>
            )}
          </ColumnsWrapper>
        </Centre>
      </Bg>
      <Footer />
    </>
  );
  }
