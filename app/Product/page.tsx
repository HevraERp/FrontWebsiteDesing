
"use client";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Cartcontext } from "@/components/Cartcontext";
import styled from "styled-components";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 14px;
`;

const ProductsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ProductWrapper = styled.div`
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 3px 6px rgba(3, 3, 3, 0.2);
  display: flex;
  flex-direction: row;
  gap: 20px;
  padding: 20px;
  box-sizing: border-box;
`;

const ImageWrapper = styled.div`
  flex: 1;
  max-width: 37%;
`;

const MainImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 270px;
  object-fit: contain;
  border-radius: 8px;
`;

const ProductInfoBox = styled.div`
  flex: 1;
  display: flex;
  padding-left: 20px;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.a`
  font-size: 28px;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  margin-bottom: 10px;
  &:hover {
    text-decoration: none;
  }
`;

const Price = styled.span`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-right: 20px;
`;

const QuantityInput = styled.input`
  width: 50px;
  padding: 8px;
  font-size: 16px;
  margin-right: 20px;
  border: 1px solid #4c1d95;
  border-radius: 3px;
  text-align: center;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 16px;
  margin-top: 10px;
`;

const Primarybtn = styled.button`
  background-color: #fff;
  border: 0;
  color: #000;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1.2rem;
  border: 1px solid #4c1d95;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  svg {
    height: 20px;
    margin-right: 5px;
  }
`;

const TabWrapper = styled.div`
  margin-top: 17px;
`;

const TabHeader = styled.div`
  display: flex;
  margin-bottom: 8px;
`;

interface TabButtonProps {
  active: boolean;
}

const TabButton = styled.button<TabButtonProps>`
  background-color: ${({ active }) => (active ? '#000' : '#f0f0f0')};
  color: ${({ active }) => (active ? 'white' : '#333')};
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  margin-right: 5px;
  cursor: pointer;
  transition: background-color 0.25s ease-in-out;
  &:hover {
    background-color: ${({ active }) => (active ? '#000' : '#e0e0e0')};
  }
`;

const TabContent = styled.div`
  padding: 12px;
  border: 1px solid #f0f0f0;
  border-top: none;
  background-color: #fff;
  font-size: 16px;
  color: #333;
`;

const RelatedProducts = styled.div`
  margin-top: 10px;
`;

const RelatedProductWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const RelatedProduct = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  padding: 13px;
`;

const RelatedImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 150px;
  object-fit: contain;
  border-radius: 8px;
`;

const RelatedTitle = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: #000;
  text-decoration: none;
  margin-top: 30px;
  display: block;
`;

const Relatedlink = styled(Link)`
  text-decoration: none;
`;


export default function ProductPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const [quantity, setQuantity] = useState<number>(1); // Local state for quantity
  const [error, setError] = useState<string | null>(null); // Local state for error message
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({
    name: '',
    email: '',
    rating: 1,
    comment: '',
  });

  const searchParams = useSearchParams();
  const id = searchParams?.get('id')  || '';

  const fetchData = async () => {
    try {
      // Fetch product
      const { data: products, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id);

      if (productError) {
        throw productError;
      }

      const formattedProducts = products?.map(product => ({
        id: product.id,
        name: product.name,
        image: product.img_url,
        price: product.price,
        description: product.description,
        quantity: product.quantity, // Ensure quantity is included
        category: product.category_id
      }));

      setProducts(formattedProducts);
      setQuantity(formattedProducts[0]?.quantity ||  1); // Set initial quantity
      setError(null); // Reset error on successful fetch

      // Fetch related products by brand
      const { data: relatedProducts, error: relatedProductError } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', formattedProducts[0]?.category)
        .neq('id', id) // Exclude the current product
        .limit(3);

      if (relatedProductError) {
        throw relatedProductError;
      }

      setRelatedProducts(relatedProducts?.map(product => ({
        id: product.id,
        name: product.name,
        image: product.img_url,
        price: product.price,
        description: product.description
      })));
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch product data.');
    }
    
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const { addToCart } = useContext(Cartcontext);

  const handleAddToCart = (productId: any) => {
    if (quantity < 1||  quantity > (products[0]?.quantity || 0)) {
      setError('Out of stock or invalid quantity.');
      return;
    }
    addToCart({ id: productId, quantity });
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Number(event.target.value);
    if (newQuantity < 1) {
      setQuantity(1); 
      setError('Quantity cannot be less than 1.');
    } else if (newQuantity === 0) {
      setQuantity(0); 
      setError('Out of stock.');
    } else if (newQuantity > (products[0]?.quantity || 0)) {
      setQuantity(products[0]?.quantity || 0); 
      setError('Out of stock.');
    } else {
      setQuantity(newQuantity);
      setError(null); 
    }
  };

  const renderTabContent = (product: any) => {
    if (activeTab === 'description') {
      return (
        <>
          <TabContent>{product.description}</TabContent>
          <RelatedProducts>
            <h3>Related Products</h3>
            <RelatedProductWrapper>
              {relatedProducts.map((relatedProduct) => (
                <div>
                <RelatedProduct key={relatedProduct.id}>
                  <Relatedlink href={`/Product/?id=${relatedProduct.id}`}>
                    <RelatedImage src={relatedProduct.image} alt={relatedProduct.name} />
                    <RelatedTitle>{relatedProduct.name}</RelatedTitle>
                  </Relatedlink>
                </RelatedProduct>
                </div>
              ))}
            </RelatedProductWrapper>
          </RelatedProducts>
        </>
      );
    }

return <TabContent>Reviews content goes here.</TabContent>;
  };

  return (
    <>
      <Header />
      <Container>
        <ProductsGrid>
          {products.map(product => (
            <ProductWrapper key={product.id}>
              <ImageWrapper>
                <MainImage src={product.image} alt={product.name} />
              </ImageWrapper>
              <ProductInfoBox>
                <Title>{product.name}</Title>
                <div>
                  <Price>${product.price}</Price>
                  {product.quantity === 0 ? (
                  <ErrorMessage>Out of stock</ErrorMessage>
                ) : (
                  <>
                    <QuantityInput
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      min="1"
                      max={product.quantity}
                    />
                     <Primarybtn
                      onClick={() => handleAddToCart(product.id)}
                      disabled={quantity < 1 || quantity > product.quantity}
                    >
                      Add to Cart
                    </Primarybtn>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                  </>
                )}
                </div>
                {error && <ErrorMessage>{error}</ErrorMessage>} {/* Show error message */}
              </ProductInfoBox>
            </ProductWrapper>
          ))}
        </ProductsGrid>
        {products.length > 0 && (
          <TabWrapper>
            <TabHeader>
              <TabButton
                active={activeTab === 'description'}
                onClick={() => setActiveTab('description')}
              >
                Description
              </TabButton>
              <TabButton
                active={activeTab === 'reviews'}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews
              </TabButton>
            </TabHeader>
            {renderTabContent(products[0])}
          </TabWrapper>
        )}
      </Container>
      <Footer />
    </>
  );
}