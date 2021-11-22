import React from "react";
import { useHistory } from "react-router-dom";
import "./HeaderButton.css";
import { Avatar, Menu, Dropdown, Button } from "antd";
import { DownOutlined, LogoutOutlined } from "@ant-design/icons";
import avatar from "../../../assets/avatar.png";
import { useAuth } from "../../../contexts/authContexts";

const HeaderButton = () => {
  const { logout, currentUser } = useAuth();
  const history = useHistory();

  const handleLogoutClick = (e) => {
    logout().then(() => history.push("/"));
  };

  const menu = (
    <Menu>
      <Menu.Item onClick={handleLogoutClick} key="1" icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="headerButton">
      <Dropdown overlay={menu} trigger={["click"]}>
        <Button className="bg-dark">
          <Avatar src={avatar} alt="avatar" size="large" />
          {currentUser.claims.email.length > 10 ? (
            <>{currentUser.claims.email.substring(0, 10)}...</>
          ) : (
            currentUser.email
          )}
          <DownOutlined />
        </Button>
      </Dropdown>
    </div>
  );
};

export default HeaderButton;
