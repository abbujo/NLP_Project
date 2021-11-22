import React, { useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import {
  QuestionCircleOutlined,
  BankOutlined,
  SmileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "./EditProfile.css";
import { Link } from "react-router-dom";
import logo from "./../../../assets/logo.png";
import { useAuth } from "../../../contexts/authContexts";
import { db } from "../../../firebase";

const EditProfile = () => {
  const [form] = Form.useForm();
  const { activeUser, setActiveUser } = useAuth();

  const onFinish = (values) => {
    if (activeUser.type == "Student") {
      db.collection("users").doc(activeUser.userId).update({
        name: values.name,
        studentDepartment: values.studentDepartment,
      });
      setActiveUser({
        ...activeUser,
        name: values.name,
        studentDepartment: values.studentDepartment,
      });
    }
    if (activeUser.type == "Faculty") {
      db.collection("users")
        .doc(activeUser.userId)
        .update({ name: values.name });
      setActiveUser({
        ...activeUser,
        name: values.name,
      });
    }
    if (activeUser.type == "ThirdParty") {
      db.collection("users")
        .doc(activeUser.userId)
        .update({ name: values.name, thirdPartyType: values.thirdPartyType });
      setActiveUser({
        ...activeUser,
        name: values.name,
        thirdPartyType: values.thirdPartyType,
      });
    }
    message.success("Successfully Edited the Profile");
  };

  const loadProfile = () => {
    console.log("setting field value");
    form.setFieldsValue({
      name: activeUser.name,
      email: activeUser.email,
      userAddress: activeUser.userAddress,
    });
    if (activeUser.type == "Student") {
      form.setFieldsValue({
        studentDepartment: activeUser.studentDepartment,
      });
    }
    if (activeUser.type == "ThirdParty") {
      form.setFieldsValue({
        thirdPartyType: activeUser.thirdPartyType,
      });
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <Form
      form={form}
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

      <h2>EDIT PROFILE</h2>
      <Form.Item
        name="name"
        rules={[{ required: true }]}
        initialValue={activeUser.name}
      >
        <Input
          prefix={<SmileOutlined className="site-form-item-icon" />}
          placeholder="Name"
        />
      </Form.Item>
      <Form.Item
        name="email"
        initialValue={activeUser.name}
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
          disabled={true}
        />
      </Form.Item>
      {activeUser.type == "Student" && (
        <Form.Item name="studentDepartment" rules={[{ required: true }]}>
          <Input
            prefix={<BankOutlined className="site-form-item-icon" />}
            placeholder="Student Department"
          />
        </Form.Item>
      )}
      {activeUser.type == "ThirdParty" && (
        <Form.Item name="thirdPartyType" rules={[{ required: true }]}>
          <Input
            prefix={<QuestionCircleOutlined className="site-form-item-icon" />}
            placeholder="Third Party Type"
          />
        </Form.Item>
      )}
      <Form.Item>
        <Button htmlType="submit" className="login-form-button bg-dark">
          Confirm
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditProfile;
