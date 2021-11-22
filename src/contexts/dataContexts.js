// import React, { useState, useContext, createContext } from "react";
// import { db } from "../firebase";

// const DataContext = createContext();

// export const useData = () => useContext(DataContext);

// const DataProvider = ({ children }) => {
//   const [jobsList, setJobsList] = useState();
//   // const [schedulesList, setSchedulesList] = useState([]);

//   const getJobs = () => {
//     db.collection("jobs").onSnapshot((querySnapshot) => {
//       let datas = [];
//       querySnapshot.forEach((doc) => {
//         const data = { ...doc.data(), jobID: doc.id };
//         datas = [...datas, data];
//       });
//       setJobsList(datas);
//     });
//   };

//   // const updateJobs = (jobID) =>
//   //   new Promise(async (resolve, reject) => {
//   //     const job = jobsList?.filter((job) => job.jobID === jobID);
//   //     console.log("job", job);
//   //     // console.log("jobsList", jobsList);
//   //     // console.log(jobID);

//   //     // try {
//   //     //   !job[0].isActive &&
//   //     //     (await db
//   //     //       .collection("schedules")
//   //     //       .where("jobID", "==", job[0].jobID)
//   //     //       .get()
//   //     //       .then((querySnapshot) => {
//   //     //         querySnapshot.forEach((doc) => {
//   //     //           doc.ref.update({ isActive: false }).then(() => resolve(0));
//   //     //         });
//   //     //       }));
//   //     // } catch (e) {
//   //     //   reject(e);
//   //     // }
//   //   });

//   // const getSchedules = async (jobID) => {
//   //   let va = updateJobs(jobID);

//   //   // !job[0].isActive &&
//   //   //   (await db
//   //   //     .collection("schedules")
//   //   //     .where("jobID", "==", job[0].jobID)
//   //   //     .get()
//   //   //     .then((querySnapshot) => {
//   //   //       querySnapshot.forEach((doc) => {
//   //   //         doc.ref.update({ isActive: false });
//   //   //       });
//   //   //     }));

//   //   db.collection("schedules")
//   //     .where("jobID", "==", jobID)
//   //     .onSnapshot((querySnapshot) => {
//   //       let datas = [];
//   //       querySnapshot.forEach((doc) => {
//   //         const { taskName, isActive } = doc.data();
//   //         const data = {
//   //           scheduleID: doc.id,
//   //           taskName,
//   //           isActive,
//   //         };
//   //         datas = [...datas, data];
//   //       });
//   //       setSchedulesList(datas);
//   //     });
//   // };

//   const values = { getJobs, jobsList };
//   // const values = { getJobs, jobsList, getSchedules, schedulesList };

//   return <DataContext.Provider value={values}>{children}</DataContext.Provider>;
// };

// export default DataProvider;
