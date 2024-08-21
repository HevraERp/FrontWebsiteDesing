'use client'
import styled from 'styled-components';
import { useState } from 'react';
import { signup } from './actions';
import { useRouter } from 'next/navigation';

export default function signupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);  
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const response = await signup(formData);

    if (response.error) {
      setError(response.error); 
    } else {
      setError(null); 
       router.push('/');
    }
  };

  return (
    <Container>
      <FormContainer>
        <Title>Sign Up</Title>
        <Form onSubmit={handleSignup}>
          <InputGroup>
            <Label htmlFor="signup-username">Username:</Label>
            <Input
              id="signup-username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="signup-email">Email:</Label>
            <Input
              id="signup-email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="signup-password">Password:</Label>
            <Input
              id="signup-password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>

          <ButtonContainer>
            <Button type="submit">Sign Up</Button>
          </ButtonContainer>
        </Form>
        {error && <ErrorMessage>{error}</ErrorMessage>} 
      </FormContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #E5E7EB;
`;

const FormContainer = styled.div`
  max-width: 400px;
  width: 100%;
  padding: 32px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  background-color: #FFFFFF;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ErrorMessage = styled.div`
  background-color: #FEE2E2;
  color: #B91C1C;
  padding: 8px 16px;
  border-radius: 4px;
  margin-top: 16px;
  margin-bottom: 16px;
  text-align: center;
  font-size: 14px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
  text-align: center;
  color: #4B5563;
`;

const Separator = styled.div`
  text-align: center;
  margin: 16px 0;
  color: #9CA3AF;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: medium;
  color: #4B5563;
  margin-bottom: 4px;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-size: 14px;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
  &:focus {
    border-color: #3B82F6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Button = styled.button`
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  background-color: #1E40AF;
  color: #FFFFFF;
  font-weight: bold;
  cursor: pointer;
  margin: 10px 16px;
  transition: background-color 0.2s;
  &:hover {
    background-color: #2563EB;
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(29, 78, 216, 0.5);
  }
`;