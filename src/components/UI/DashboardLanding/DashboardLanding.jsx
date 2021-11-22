import React from "react";
import "./DashboardLanding.css";
import { DashboardHeader, DashItem } from "..";

const DashboardLanding = (props) => {
  const ITEMS = [
    { header: "Add Courses", slug: "add-course", visibility: "Faculty" },
    { header: "Edit Profile", slug: "edit-profile", visibility: "All" },
    { header: "View Wallet", slug: "view-wallet", visibility: "All" },
    { header: "Enrol Course", slug: "enrol", visibility: "Student" },
    { header: "Update Result", slug: "update-result", visibility: "Faculty" },
    {
      header: "Access Request",
      slug: "access-request",
      visibility: "ThirdParty",
    },
    {
      header: "View Requested Data",
      slug: "requested-data",
      visibility: "ThirdParty",
    },
    { header: "Grant Access", slug: "grant-access", visibility: "Student" },
  ];

  return (
    <>
      <DashboardHeader header="DASHBOARD" />
      <div className="dashboardLanding">
        <ul>
          {ITEMS.map(({ header, slug, visibility }, index) => (
            <DashItem
              key={index}
              header={header}
              slug={slug}
              visibility={visibility}
            />
          ))}
        </ul>
      </div>
    </>
  );
};

export default DashboardLanding;
