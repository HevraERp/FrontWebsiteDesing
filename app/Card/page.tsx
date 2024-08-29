"use client";
import Header from "@/components/Header";
import styled from "styled-components";
import { Cartcontext } from "@/components/Cartcontext";
import {
  useState,
  useEffect,
  useContext,
  AwaitedReactNode,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
import Footer from "@/components/Footer";
import { supabase } from "@/utils/supabase/client";
import Button from "@/components/Button";
import React from "react";
import Product from "@/models/Product";

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
  margin-top: 0;
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
const ErrorMessage = styled.div`
  color: red;
  font-size: 16px;
  margin-top: 10px;
`;

const SidebarWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 300px;
  background-color: #fff;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
  transform: ${(props) =>
    props.isOpen ? "translateX(0)" : "translateX(100%)"};
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
`;

const SidebarContent = styled.div`
  padding: 20px;
  height: calc(100% - 40px);
  overflow-y: auto;

  img {
    max-width: 90px;
    max-height: 100px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
`;
const HistoryIcon = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  color: #fff;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1001;
`;

const SubmitButton = styled.button`
  background-color: #000;
  color: #fff;
  padding: 5px 5px;
  border: none;
  border-radius: 4px;
  margin: 5px;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
`;

export default function CardPage() {
  const { addToCart, removeProduct } = useContext(Cartcontext);
  const [cart, setCart] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardSecurityCode, setCardSecurityCode] = useState("");
  const [cardExpiryDate, setCardExpiryDate] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const HistoryIconSVG = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-6"
      width="24"
      height="24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
      />
    </svg>
  );

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
      .eq("user_id", userId);

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
    console.log("more of this items " + id);
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
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
      fetchOrderHistory();
      fetchProducts();
    }
  }, [userId]);

  function lessOfThisProduct(id: string) {
    removeProduct(id);
    setProducts((prevProducts) =>
      prevProducts
        .map((product) =>
          product._id === id
            ? { ...product, quantity: Math.max(product.quantity - 1, 0) }
            : product
        )
        .filter((product) => product.quantity > 0)
    );
  }

  let total = 0;
  for (const product of products) {
    const productTotal = product.price * product.quantity;
    total += productTotal;
  }

  const handleOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsButtonDisabled(true);

    if (
      !userId ||
      !country ||
      !city ||
      !street ||
      !zipCode ||
      !cardholderName ||
      !cardNumber ||
      !cardSecurityCode ||
      !cardExpiryDate
    ) {
      setError("please fill all the fields");
      return;
    }

    // Insert order
    const { data, error } = await supabase
      .from("orders")
      .insert([{ user_id: userId, total_amount: total }])
      .select();

    if (error) {
      console.error("Error inserting order:", error.message);
      return;
    }

    const orderId = data?.[0]?.id;
    if (!orderId) {
      console.error("Order ID not found");
      return;
    }

    // Insert order items
    const insertOrderItemsPromises = products.map((item) =>
      supabase
        .from("order_Items")
        .insert([
          {
            order_id: orderId,
            quantity: item.quantity,
            price: item.price,
            product_id: item._id,
          },
        ])
        .select()
    );

    const orderItemsResults = await Promise.all(insertOrderItemsPromises);

    orderItemsResults.forEach(({ error: orderItemError }) => {
      if (orderItemError) {
        console.error("Error inserting order item:", orderItemError.message);
      }
    });

    // Insert payments
    const { error: paymentError } = await supabase
      .from("payments")
      .insert([
        {
          order_id: orderId,
          amount: total,
          card_number: cardNumber,
          card_expire_date: cardExpiryDate,
          card_security_code: cardSecurityCode,
          card_name: cardholderName,
        },
      ])
      .select();

    if (paymentError) {
      console.log(
        "error inserting data to payment table " + paymentError.message
      );
    }

    // Insert shipping data
    const { error: shippingError } = await supabase
      .from("shipping")
      .insert([
        {
          order_id: orderId,
          street: street,
          city: city,
          country: country,
          zip_code: zipCode,
        },
      ])
      .select();

    if (shippingError) {
      console.log("error inserting data to shipping table " + shippingError);
    }

    // const updateProductPromises = products.map(async (product) => {
    //   const correspondingItem = cart.find(
    //     (item) => item.product_id === product._id
    //   );
    //   console.log(product._id);
    //   console.log(correspondingItem);

    //   if (correspondingItem) {
    //     const { error: productUpdateError } = await supabase
    //     .from("products")
    //     .update({ quantity: product.quantity - correspondingItem.quantity })
    //     .eq("id", product._id);

    //     if (productUpdateError) {
    //       console.error(
    //         `Error updating product quantity for product ID ${product._id}:`,
    //         productUpdateError.message
    //       );
    //     }
    //   }
    // });

    // await Promise.all(updateProductPromises);

    // Clear the cart in the database
    const { error: clearCartError } = await supabase
      .from("shoppingcart")
      .delete()
      .eq("user_id", userId);

    if (clearCartError) {
      console.error("Error clearing cart:", clearCartError.message);
    }

    // Reset form and cart
    setCountry("");
    setCity("");
    setStreet("");
    setZipCode("");
    setCardholderName("");
    setCardNumber("");
    setCardSecurityCode("");
    setCardExpiryDate("");
    setCart([]);
    setProducts([]);
    setCart([]);
    setProducts([]);
    alert(
      "we will email you as soon as admin accept your order thank you for your patient"
    );
  };

  async function checkingOrderAccept(order_id: string) {
    const { data: orders, error } = await supabase
      .from("orders")
      .select("status")
      .eq("id", order_id);

    if (error) {
      console.log(error.message);
      return;
    }

    if (orders) {
      for (const order of orders) {
        if (order.status === "pending") {
          alert("waiting for admin to accept your order");
          break;
        }

        if (order.status === "accepted") {
          alert("Your order has been accepted");
          break;
        }
        if (order.status === "canceled") {
          alert(
            "Your order has been canceled because we don't have enough items to accept your order"
          );
          break;
        }
        if (order.status === "completed") {
          alert("Your order has been sent to your location");
          break;
        }
      }
    }
  }

  const fetchOrderHistory = async () => {
    try {
      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("id, total_amount, created_at")
        .eq("user_id", userId);

      if (ordersError) {
        throw ordersError;
      }

      // Fetch order items, payments, and shipping for each order
      const ordersWithDetails = await Promise.all(
        ordersData.map(async (order) => {
          const { data: orderItems, error: orderItemsError } = await supabase
            .from("order_Items")
            .select("product_id, quantity, price")
            .eq("order_id", order.id);
          if (orderItemsError) {
            throw orderItemsError;
          }

          // Get product details for all items in one query
          const productIds = orderItems.map((item) => item.product_id);
          const { data: products, error: productsError } = await supabase
            .from("products")
            .select("*")
            .in("id", productIds);

          if (productsError) {
            throw productsError;
          }

          // Attach product details to each order item
          const itemsWithProducts = orderItems.map((item) => ({
            ...item,
            product: products.find((product) => product.id === item.product_id),
          }));

          return {
            ...order,
            items: itemsWithProducts,
            products,
          };
        })
      );
      setOrders(ordersWithDetails);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

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

            <HistoryIcon onClick={toggleSidebar}>
              <HistoryIconSVG />
            </HistoryIcon>
            <SidebarWrapper isOpen={isSidebarOpen}>
              <CloseButton onClick={toggleSidebar}>×</CloseButton>
              <SidebarContent>
                <h2>Your Order History</h2>
                <StyledTable>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <React.Fragment key={order.id}>
                        {order.items.map((item: any) => (
                          <tr key={`${order.id}-${item.product_id}`}>
                            <ProductInfoCell>
                              <ProductImageBox>
                                <img
                                  src={item.product.img_url}
                                  alt={item.product.name}
                                />
                              </ProductImageBox>
                              {item.product.name}
                            </ProductInfoCell>
                            <td>{item.quantity}</td>
                            <td>${item.price}</td>
                          </tr>
                        ))}
                        <tr>
                          <td>
                            <strong>Total: ${order.total_amount}</strong>{" "}
                          </td>
                          <td colSpan={2}>
                            <SubmitButton
                              onClick={() => checkingOrderAccept(order.id)}
                            >
                              {" "}
                              order status{" "}
                            </SubmitButton>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </StyledTable>
              </SidebarContent>
            </SidebarWrapper>
            {!!cart?.length && (
              <FormWrapper>
                <FormTitle>Complete your order</FormTitle>
                <Form onSubmit={handleOrder}>
                  <SectionTitle>Shipping Information</SectionTitle>
                  <InputGrid>
                    <InputField
                      type="text"
                      placeholder="Country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      pattern="^[A-Za-z\s]+$"
                      required
                    />
                    <InputField
                      type="text"
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      pattern="^[A-Za-z\s]+$"
                      required
                    />

                    <InputField
                      type="text"
                      placeholder="Street"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      pattern="[A-Za-z\s]*"
                      required
                    />
                    <InputField
                      type="text"
                      placeholder="Zip Code"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      pattern="\d{5}"
                      maxLength={5}
                      required
                    />
                  </InputGrid>

                  <SectionTitle>Payment Details</SectionTitle>
                  <InputGrid>
                    <InputField
                      type="text"
                      placeholder="Cardholder Name"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      pattern="[A-Za-z\s]*"
                      required
                    />
                    <InputField
                      type="text"
                      placeholder="Card Number"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      pattern="\d{16}"
                      maxLength={16}
                      required
                    />
                    <InputField
                      type="text"
                      placeholder="Security Code (CVV)"
                      value={cardSecurityCode}
                      onChange={(e) => setCardSecurityCode(e.target.value)}
                      pattern="\d{3}"
                      maxLength={3}
                      required
                    />
                    <InputField
                      type="text"
                      placeholder="Expiry Date (MM/YY)"
                      value={cardExpiryDate}
                      onChange={(e) => setCardExpiryDate(e.target.value)}
                      pattern="(0[1-9]|1[0-2])\/\d{2}"
                      maxLength={5}
                      required
                    />
                  </InputGrid>

                  <ButtonGroup>
                    <PurchaseButton type="submit" disabled={isButtonDisabled}>
                      {isButtonDisabled ? "Processing..." : "Complete Purchase"}
                    </PurchaseButton>
                  </ButtonGroup>
                </Form>
                {error && <ErrorMessage>{error}</ErrorMessage>}
              </FormWrapper>
            )}
          </ColumnsWrapper>
        </Centre>
      </Bg>
      <Footer />
    </>
  );
}
