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

interface IRegistration {
  email: string;
  employeeId: string;
  password: string;
  name: string;
}

const defaultRegistration: IRegistration = {
  email: "",
  employeeId: "",
  password: "",
  name: "",
};

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const [registrationInfo, setRegistrationInfo] =
    useState<IRegistration>(defaultRegistration);
  const [messageApi, contextHolder] = message.useMessage();

  const onChangeRegistration = (key: keyof IRegistration, value: string) => {
    setRegistrationInfo((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const onClickNavigate = () => {
    navigate("/login");
  };

  const onSubmit = async () => {
    try {
      const resp = await axiosInstance.post(
        "/auth/register",
        registrationInfo,
        {
          withCredentials: true,
        },
      );
      messageApi.open({
        type: "success",
        content: resp?.data?.message,
      });
      navigate("/login");
    } catch (err: any) {
      messageApi.open({
        type: "error",
        content: err?.response?.data?.message || "Registration failed!",
      });
    }
  };
  const wind = window as any;

  const fetchUser = useCallback(async () => {
    try {
      const response = await axios(`${wind.env.VITE_BASE_URL}/v1/auth/user`, {
        method: "get",
        withCredentials: true,
      });
      localStorage.setItem(
        "aes-meal-user",
        JSON.stringify(response?.data?.data?.userData),
      );

      if (response.status === 200) {
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <MainContainer>
      {contextHolder}
      <StyledFormContainer>
        <StyledFormTitle>AES-Meal Register</StyledFormTitle>
        <Form name="register" layout="vertical" autoComplete="off">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input
              value={registrationInfo.name}
              onChange={(e) => onChangeRegistration("name", e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              value={registrationInfo.email}
              onChange={(e) => onChangeRegistration("email", e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="employeeId"
            label="Employee ID"
            rules={[
              { required: true, message: "Please input your Employee ID!" },
            ]}
          >
            <Input
              value={registrationInfo.employeeId}
              onChange={(e) =>
                onChangeRegistration("employeeId", e.target.value)
              }
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              value={registrationInfo.password}
              onChange={(e) => onChangeRegistration("password", e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <StyledButton onClick={onSubmit} type="primary">
              Register
            </StyledButton>
          </Form.Item>
        </Form>
        <StyledP onClick={onClickNavigate}>Already have an account?</StyledP>
      </StyledFormContainer>
    </MainContainer>
  );
};

export default Registration;
