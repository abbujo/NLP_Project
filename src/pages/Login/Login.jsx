import React from "react";
import "./Login.css";
import { Col, Row } from "antd";
import { LoginForm } from "./../../components/UI";

const Login = () => {
  return (
    <Row justify="space-around" align="middle">
      <Col xs={24} sm={24} md={12} lg={12}>
        <LoginForm />
      </Col>
    </Row>
  );
};

export default Login;
