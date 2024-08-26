'use client';

import { supabase } from '@/utils/supabase/client';
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding-left:15px;
`;

const InputWrapper = styled.div`
  width: 95%;
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 20px;
  outline: none;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
  
  &:focus {
    border-color: #0070f3;
  }
`;

const ResultsList = styled.ul`
  width: 100%;
  max-width: 300px;
  margin-top: 6px;
  padding: 0;
  list-style-type: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

const ResultItem = styled.li`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f5f5f5;
  }

  & small {
    color: #666;
    font-size: 12px;
  }
`;

const NoResults = styled.p`
  margin: 8px 0;
  padding: 10px;
  color: #999;
  font-size: 14px;
`;

const HistoryList = styled.div`
  width: 100%;
  max-width: 500px;
  margin-top: 8px;
  padding: 0;
  list-style-type: none;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;
`;

const HistoryItem = styled.div`
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
  }
`;

export default function Search() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams?.get('query') || "");
  const [debouncedText] = useDebounce(query, 400);
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  const fetchData = async () => {
    if (debouncedText.length <= 1) {
      setResults([]);
      return;
    }

    try {
      const { data: brandData, error: brandError } = await supabase
        .from('brand')
        .select('*')
        .ilike('name', `%${debouncedText}%`);

      if (brandError) {
        console.error("Brand fetch error:", brandError);
      }

      const { data: categoryData, error: categoryError } = await supabase
        .from('category')
        .select('*')
        .ilike('name', `%${debouncedText}%`);

      if (categoryError) {
        console.error("Category fetch error:", categoryError);
      }

      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${debouncedText}%`);

      if (productError) {
        console.error("Product fetch error:", productError);
      }

      const combinedResults = [
        ...brandData?.map(item => ({
          _id: item.id,
          title: item.name,
          type: 'brand',
        })) || [],
        ...categoryData?.map(item => ({
          _id: item.id,
          title: item.name,
          type: 'category',
        }))||  [],
        ...productData?.map(item => ({
          _id: item.id,
          title: item.name,
          type: 'product',
        }))||  [],
      ].slice(0, 10); // Limit to 10 results

      setResults(combinedResults);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

useEffect(() => {
    fetchData();
    if (debouncedText && debouncedText.length > 1) {
      setHistory(prevHistory => {
        const newHistory = [debouncedText, ...prevHistory.filter(item => item !== debouncedText)];
        return newHistory.slice(0, 5); // Limit history to 5 items
      });
    }
  }, [debouncedText]);

  const handleNavigation = (type, id) => {
    const path = type === 'brand'
      ?`/brand-${id}`
      : type === 'category'
      ? `/category/${id}`
      : type === 'product'
      ?` /Product/?id=${id}`
      : '/';
    
    router.push(path);
    setShowResults(false); // Hide results after navigation
  };

  const handleHistoryClick = (searchTerm) => {
    setQuery(searchTerm);
    setShowHistory(false); // Hide history when selecting an item
  };

  const handleInputFocus = () => {
    setShowHistory(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      if (!query) {
        setShowHistory(false);
      }
    }, 200);
  };

  return (
    <Container>
      <InputWrapper>
        <Input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true); // Show results as user types
          }}
          placeholder="Search..."
              />
        {showHistory && !debouncedText && (
          <HistoryList>
            {history.map((item, index) => (
              <HistoryItem key={index} onClick={() => handleHistoryClick(item)}>
                {item}
              </HistoryItem>
            ))}
          </HistoryList>
        )}
        {showResults && debouncedText.length > 1 && (
          <ResultsList>
            {results.length > 0 ? (
              results.map((item) => (
                <ResultItem key={item._id} onClick={() => handleNavigation(item.type, item._id)}>
                  {item.title} <small>({item.type})</small>
                </ResultItem>
              ))
            ) : (
              <NoResults>No results found for "{debouncedText}"</NoResults>
            )}
          </ResultsList>
        )}
      </InputWrapper>
    </Container>
  );
}