import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { Form, Input, Button, Select, message, Spin } from "antd";
import {
  QuestionCircleOutlined,
  BankOutlined,
  SmileOutlined,
  UserOutlined,
  LockOutlined,
} from "@ant-design/icons";
import "./RegisterForm.css";
import { Link } from "react-router-dom";
import logo from "./../../../assets/logo.png";
import { useAuth } from "../../../contexts/authContexts";
import { notification } from "antd";

const { Option } = Select;

const RegisterForm = () => {
  const { register, currentUser, error } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [selection, setselection] = useState("");
  let history = useHistory();

  const onSelect = (val) => {
    setselection(val);
  };

  const onFinish = async (values) => {
    console.log(values)
    try {
      setIsLoggingIn(true);
      await register(values);
      setIsLoggingIn(false);
    } catch (error) {
      message.error(error);
      setIsLoggingIn(false);
    }
  };

  const openNotification = (info) => {
    notification.open({
      message: "Sign Up Failed",
      description: "Cannot Register. " + info,
      onClick: () => {
        console.log("Notification Clicked!");
      },
    });
  };

  useEffect(() => {
    if (currentUser && currentUser !== null) {
      history.push("/dashboard");
    }
    return () => {
      setIsLoggingIn(false);
    };
  }, [currentUser]);

  useEffect(() => {
    if (error !== "") {
      console.log(error);
      openNotification(error);
    }
    return () => {
      setIsLoggingIn(false);
    };
  }, [error]);

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

      <h2>Register</h2>
      <Form.Item name="name" rules={[{ required: true }]}>
        <Input
          prefix={<SmileOutlined className="site-form-item-icon" />}
          placeholder="Name"
        />
      </Form.Item>
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
      <Form.Item
        name="confirmPassword"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Please confirm your password!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("The two passwords that you entered do not match!")
              );
            },
          }),
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Confirm Password"
        />
      </Form.Item>
      <Form.Item name="type">
        <Select placeholder="Select Role" onSelect={onSelect}>
          <Option value="Student">Student</Option>
          <Option value="Faculty">Faculty</Option>
          <Option value="ThirdParty">Third Party</Option>
        </Select>
      </Form.Item>
      {selection == "Student" && (
        <Form.Item name="studentDepartment" rules={[{ required: true }]}>
          <Input
            prefix={<BankOutlined className="site-form-item-icon" />}
            placeholder="Student Department"
          />
        </Form.Item>
      )}
      {selection == "ThirdParty" && (
        <Form.Item name="thirdPartyType" rules={[{ required: true }]}>
          <Input
            prefix={<QuestionCircleOutlined className="site-form-item-icon" />}
            placeholder="Third Party Type"
          />
        </Form.Item>
      )}
      <Form.Item>
        <Button htmlType="submit" className="login-form-button bg-dark">
          {isLoggingIn ? <Spin style={{ color: "white" }} /> : null}
          Register
        </Button>
        <p style={{ textAlign: "center", paddingTop: "10px" }}>
          Already have an account?{" "}
          <Link style={{ textAlign: "center", paddingTop: "10px" }} to="/">
            {" "}
            Sign In
          </Link>
        </p>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;
