import React from "react";
import "./Sidebar.css";
import { NavLink, Link } from "react-router-dom";
import { AiOutlineCloseCircle } from "react-icons/all";
import logo from "../../../assets/logo.png";
import { useAuth } from "../../../contexts/authContexts";

const Sidebar = ({ isMobMenuVisible, showMobMenu }) => {
  const { activeUser } = useAuth();

  return (
    <div className="sidebar">
      <div className="sidebar__menu">
        <div className="sidebar__logo">
          <NavLink to="/">
            <img src={logo} alt="logo" />
          </NavLink>
        </div>
        <div className="sidebar__tabs">
          {activeUser.type == "Faculty" && (
            <NavLink
              to={`/dashboard/add-course`}
              exact={true}
              activeClassName="sidebar__activeNavLink"
            >
              Add Course
            </NavLink>
          )}
          {activeUser.type == "ThirdParty" && (
            <NavLink
              to={`/dashboard/requested-data`}
              exact={true}
              activeClassName="sidebar__activeNavLink"
            >
              View Requested Data
            </NavLink>
          )}
          {activeUser.type == "ThirdParty" && (
            <NavLink
              to={`/dashboard/access-request`}
              exact={true}
              activeClassName="sidebar__activeNavLink"
            >
              Access Request
            </NavLink>
          )}
          {activeUser.type == "Faculty" && (
            <NavLink
              to={`/dashboard/update-result`}
              exact={true}
              activeClassName="sidebar__activeNavLink"
            >
              Update Result
            </NavLink>
          )}
          {activeUser.type == "Student" && (
            <NavLink
              to={`/dashboard/enrol`}
              exact={true}
              activeClassName="sidebar__activeNavLink"
            >
              Enrol Course
            </NavLink>
          )}
          {activeUser.type == "Student" && (
            <NavLink
              to={`/dashboard/grant-access`}
              exact={true}
              activeClassName="sidebar__activeNavLink"
            >
              Grant Access
            </NavLink>
          )}
          <NavLink
            to={`/dashboard/view-wallet`}
            activeClassName="sidebar__activeNavLink"
          >
            View Wallet
          </NavLink>
          <NavLink
            to={`/dashboard/edit-profile`}
            activeClassName="sidebar__activeNavLink"
          >
            Edit Profile
          </NavLink>
        </div>
      </div>
      <div
        className={
          isMobMenuVisible
            ? "sidebar__mobMenu sidebar__mobileMenuActive"
            : "sidebar__mobMenu"
        }
      >
        <div className="sidebar__mobMenuClose">
          <AiOutlineCloseCircle onClick={showMobMenu} />
        </div>
        <div className="sidebar__logo">
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <div className="sidebar__tabs" onClick={showMobMenu}>
          {activeUser.type == "Faculty" && (
            <NavLink
              to={`/dashboard/add-course`}
              exact={true}
              activeClassName="sidebar__activeNavLink"
            >
              Add Course
            </NavLink>
          )}
          {activeUser.type == "ThirdParty" && (
            <NavLink
              to={`/dashboard/requested-data`}
              exact={true}
              activeClassName="sidebar__activeNavLink"
            >
              View Requested Data
            </NavLink>
          )}
          {activeUser.type == "ThirdParty" && (
            <NavLink
              to={`/dashboard/access-request`}
              exact={true}
              activeClassName="sidebar__activeNavLink"
            >
              Access Request
            </NavLink>
          )}
          {activeUser.type == "Faculty" && (
            <NavLink
              to={`/dashboard/update-result`}
              exact={true}
              activeClassName="sidebar__activeNavLink"
            >
              Update Result
            </NavLink>
          )}
          {activeUser.type == "Student" && (
            <NavLink
              to={`/dashboard/enrol`}
              exact={true}
              activeClassName="sidebar__activeNavLink"
            >
              Enrol Course
            </NavLink>
          )}
          {activeUser.type == "Student" && (
            <NavLink
              to={`/dashboard/grant-access`}
              exact={true}
              activeClassName="sidebar__activeNavLink"
            >
              Grant Access
            </NavLink>
          )}
          <NavLink
            to={`/dashboard/view-wallet`}
            activeClassName="sidebar__activeNavLink"
          >
            View Wallet
          </NavLink>
          <NavLink
            to={`/dashboard/edit-profile`}
            activeClassName="sidebar__activeNavLink"
          >
            Edit Profile
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
