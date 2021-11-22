import React, { useState } from "react";
import "./Dashboard.css";
import {
  DashboardLanding,
  Sidebar,
  HeaderButton,
  EditProfile,
  AddCourse,
  ViewWallet,
  Enrol,
} from "../../components/UI";
import { AiOutlineMenu } from "react-icons/all";
import { Switch, Route } from "react-router-dom";
import UpdateResult from "../../components/UI/UpdateResult/UpdateResult";
import { AccessRequest } from "../../components/UI/AccessRequest";
import { ViewRequestedData } from "../../components/UI/ViewRequestedData";
import { GrantAccess } from "../../components/UI/GrantAccess";

const Dashboard = () => {
  const [isMobMenuVisible, setIsMobMenuVisible] = useState(false);

  const showMobMenu = () => setIsMobMenuVisible(!isMobMenuVisible);

  return (
    <div className="dashboard">
      <div className="dashboard__sidebar">
        <Sidebar
          isMobMenuVisible={isMobMenuVisible}
          showMobMenu={showMobMenu}
        />
      </div>
      <div className="dashboard__content">
        <div className="dashboard__header">
          <span className="dashboard__mobMenuOpen">
            <AiOutlineMenu onClick={showMobMenu} />
          </span>
          <HeaderButton />
        </div>
        <Switch>
          <Route path="/dashboard" component={DashboardLanding} exact />
          <Route path="/dashboard/add-course" component={AddCourse} />
          <Route path="/dashboard/grant-access" component={GrantAccess} />
          <Route path="/dashboard/edit-profile" component={EditProfile} />
          <Route path="/dashboard/requested-data" component={ViewRequestedData} />
          <Route path="/dashboard/view-wallet" component={ViewWallet} />
          <Route path="/dashboard/update-result" component={UpdateResult} />
          <Route path="/dashboard/access-request" component={AccessRequest} />
          <Route path="/dashboard/enrol" component={Enrol} />
        </Switch>
      </div>
    </div>
  );
};

export default Dashboard;
