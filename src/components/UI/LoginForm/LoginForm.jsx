import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { Form, Input, Button, Checkbox, message, Spin } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./LoginForm.css";
import { Link } from "react-router-dom";
import logo from "./../../../assets/logo.png";
import { useAuth } from "../../../contexts/authContexts";

const LoginForm = () => {
  const { currentUser, login } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  let history = useHistory();

  const onFinish = async (values) => {
    try {
      setIsLoggingIn(true);
      await login(values.email, values.password);
      setIsLoggingIn(false);
    } catch (error) {
      message.error(error);
      setIsLoggingIn(false);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser !== null) {
      history.push("/dashboard");
    }

    return () => {
      setIsLoggingIn(false);
    };
  }, [currentUser]);


  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
    >
      <Link to="/">
        <img
          src={logo}
          alt="Vic Uni Student Record Management"
          className="logo"
        />
      </Link>

      <h2>Login</h2>
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            type: "email",
            message: "Please input your email address!",
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Email"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your Password!",
          },
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Link className="login-form-forgot" to="/forgot-password">
          Forgot password?
        </Link>
      </Form.Item>

      <Form.Item>
        <Button htmlType="submit" className="login-form-button bg-dark">
          {isLoggingIn ? <Spin style={{ color: "white" }} /> : null}
          Log in
        </Button>
        <p style={{ textAlign: "center", paddingTop: "10px" }}>
          Don't have an account?
          <Link
            style={{ textAlign: "center", paddingTop: "10px" }}
            to="/register"
          >
            {" "}
            Sign Up
          </Link>
        </p>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
