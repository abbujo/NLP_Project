import React from "react";
import "./ViewWallet.css";
import { useAuth } from "../../../contexts/authContexts";
import { DashboardHeader } from "..";

const ViewWallet = (props) => {
  const { activeUser } = useAuth();

  return (
    <>
      <DashboardHeader
        header={"View Wallet"}
        goBack={props.history.goBack}
        isNested
      />
      <div className="add_course_container">
        Your Balance is {activeUser.balance} VUCoin
      </div>
    </>
  );
};

export default ViewWallet;
