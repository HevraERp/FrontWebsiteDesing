"use client";
import styled from 'styled-components';
import { useContext, useState, useEffect } from 'react';
import { Cartcontext } from '@/components/Cartcontext';
import Link from 'next/link';
import Search from './Search';
import { supabase } from '@/utils/supabase/client';

const StyledHeader = styled.header`
  background-color: #222;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: calc(100% - 17px); /* Full width minus 10px for margin */
  margin: 0 auto;
  margin-left: 8px; /* 5px margin on the left */
  margin-right: 8px; /* 5px margin on the right */
  z-index: 1000;
  box-sizing: border-box;
`;

const Centre = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Logo = styled(Link)`
  color: #fff;
  text-decoration: none;
  position: relative;
  z-index: 3;
  font-size: 1.2rem;
  padding-left: 10px;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 32px 0px;
  margin: 2px;
`;

const Stylednav = styled.nav`
  ${(props) =>
    props.$mobileNavactive
      ? `
  display: block;
  `
      : ` display: none;`}
  gap: 20px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 70px 20px 20px;
  background-color: #222;
  @media screen and (min-width: 768px) {
    display: flex;
    position: static;
    padding: 0;
  }
`;

const Navlink = styled(Link)`
  color: #aaa;
  display: block;
  text-decoration: none;
  font-size: 1.2rem;
  padding: 5px 0;

  @media screen and (min-width: 768px) {
    padding: 0;
  }
`;

const Navbuton = styled.button`
  background-color: transparent;
  width: 30px;
  height: 30px;
  border: 0;
  position: relative;
  z-index: 3;
  color: white;
  cursor: pointer;
  @media screen and (min-width: 768px) {
    display: none;
  }
`;

export default function Header() {
  const context = useContext(Cartcontext);
  const [mobileNavactive, setmobileNavactive] = useState(false);
  const [session, setSession] = useState(null);
  const { cartCount } = context;

  useEffect(() => {

  }, []);

  const checkUserSession = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        setSession(false);
      } else if (session) {
        setSession(true);
      } else {
        setSession(false);
      }
    } catch (error) {
      console.error('Error checking user session:', error);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    } else {
      setSession(false);
      window.location.href = '/';
    }
  };

  return (
    <>
      <StyledHeader>
        <Centre>
          <Wrapper>
            <Logo href="/">Awroshop</Logo>
            <Search />
            <Stylednav $mobileNavactive={mobileNavactive}>
              <Navlink href="/">Home</Navlink>
              <Navlink href="/wishlist">wishlist</Navlink>
              {session ? (
                <>
                  <Navlink href="#" onClick={handleLogout}>Logout</Navlink>
                </>
              ) : (
                <Navlink href="/login">Login</Navlink>
              )}
              <Navlink href="/Card">Cart ({cartCount})</Navlink>
          
            </Stylednav>
            <Navbuton onClick={() => setmobileNavactive((prev) => !prev)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </Navbuton>
          </Wrapper>
        </Centre>
      </StyledHeader>
      <div style={{ paddingTop: '80px' }} />
    </>
  );
}
