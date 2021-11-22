import React from "react";
import "./DashItem.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/authContexts";

function DashItem({ header, slug, visibility }) {
  const { activeUser } = useAuth();
  return (
    <>
    {console.log(visibility)}
      {(visibility == "All" || visibility == activeUser.type) &&
      (
        <Link to={`/dashboard/${slug}`}>
          <li className="dashItem">{header}</li>
        </Link>
      )}
    </>
  );
}

export default DashItem;
