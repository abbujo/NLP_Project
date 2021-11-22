import React from "react";
import "./DashboardHeader.css";
import { HeaderButton } from "..";
import { Button, Divider } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { breakStatement } from "@babel/types";

const DashboardHeader = ({ header, goBack, isNested, subtext }) => {
  return (
    <div className="dashboardHeader">
      <div className="dashboardHeader__head">
        {isNested && (
          <div className="dashboardHeader__backBtn">
            <Button className="bg-light" onClick={() => goBack()}>
              <ArrowLeftOutlined />
            </Button>
          </div>
        )}
        <h1>{header}</h1>
        {subtext && <p style={{ fontSize: 14, color: "green" }}>&nbsp;&nbsp;&nbsp;&nbsp;(*{subtext})</p>}
      </div>
      <div className="dashboardHeader__btn">
        <HeaderButton />
      </div>
    </div>
  );
};

export default DashboardHeader;
