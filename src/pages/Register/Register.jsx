import React from "react";
import "./Register.css";
import { Col, Row } from "antd";
import { RegisterForm } from "../../components/UI";

const Register = () => {
  return (
    <Row justify="space-around" align="middle">
      <Col xs={24} sm={24} md={12} lg={12}>
        <RegisterForm />
      </Col>
    </Row>
  );
};

export default Register;
