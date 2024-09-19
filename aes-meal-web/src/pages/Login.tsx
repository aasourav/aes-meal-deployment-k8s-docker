import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Input, message } from "antd";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import axios from "axios";

const MainContainer = styled.div`
  width: 100dvw;
  height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
`;

const StyledFormContainer = styled.div`
  background-color: white;
  padding: 3rem;
  width: 30%;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const StyledFormTitle = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 20px;
  color: #1890ff;
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: 40px;
  background-color: #1890ff;
  border-color: #1890ff;
  &:hover {
    background-color: #40a9ff;
    border-color: #40a9ff;
  }
`;

const StyledP = styled.p`
  text-decoration: underline;
  font-size: 0.9rem;
  cursor: pointer;
`;

interface ILogin {
  email: string;
  password: string;
}

const defaultLogin: ILogin = {
  email: "",
  password: "",
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loginInfo, setLoginInfo] = useState<ILogin>(defaultLogin);
  const [messageApi, contextHolder] = message.useMessage();

  const onClickNavigate = () => {
    navigate("/register");
  };

  const fetchUser = useCallback(async () => {
    try {
      const response = await axios(`${import.meta.env.VITE_BASE_URL}/v1/auth/user`, {
        method: "get",
        withCredentials: true,
      });

      if (response.status === 200) {
        localStorage.setItem(
          "aes-meal-user",
          JSON.stringify(response?.data?.data?.userData),
        );
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const onChangeLogin = (key: keyof ILogin, value: string) => {
    setLoginInfo((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const onSubmit = async () => {
    try {
      const resp = await axiosInstance.post("/auth/login", loginInfo, {
        withCredentials: true,
      });
      localStorage.setItem("userInfo", JSON.stringify(resp?.data?.data?.user));
      messageApi.open({
        type: "success",
        content: resp?.data?.message,
      });
      navigate("/");
    } catch (err: any) {
      messageApi.open({
        type: "error",
        content: err?.response?.data?.message || "Login failed!",
      });
    }
  };

  return (
    <MainContainer>
      {contextHolder}
      <StyledFormContainer>
        <StyledFormTitle>AES-meal Login</StyledFormTitle>
        <Form name="validateOnly" layout="vertical" autoComplete="off">
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              value={loginInfo.email}
              onChange={(e) => onChangeLogin("email", e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              value={loginInfo.password}
              onChange={(e) => onChangeLogin("password", e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <StyledButton onClick={onSubmit} type="primary">
              Submit
            </StyledButton>
          </Form.Item>
        </Form>
        <StyledP onClick={onClickNavigate}>Create an account</StyledP>
      </StyledFormContainer>
    </MainContainer>
  );
};

export default Login;
