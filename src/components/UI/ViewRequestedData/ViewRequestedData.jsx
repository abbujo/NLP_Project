import React, { useEffect, useState } from "react";
import {
  List,
  Avatar,
  message,
  Form,
  Select,
  Spin,
  Button,
  Modal,
  Input,
} from "antd";
import "./ViewRequestedData.css";
import { DashboardHeader } from "..";
import { db } from "../../../firebase";
import { useAuth } from "../../../contexts/authContexts";
import "firebase/firestore";
import firebase from "firebase";
import { CheckSquareTwoTone, CloseSquareTwoTone } from "@ant-design/icons";

const { Option } = Select;

const ViewRequestedData = (props) => {
  const { activeUser } = useAuth();
  const [form] = Form.useForm();
  const [RequestedData, setRequestedData] = useState([]);
  const [enrolments, setenrolments] = useState([]);
  const [loading, setloading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [grade, setgrade] = useState("P");
  const [updating, setupdating] = useState(false);

  // const handleGradeUpdate = () => {
  //   setupdating(true);
  //   const fetchData = async () => {
  //     try {
  //       console.log(item.studentId);
  //       var docId = "";
  //       const query = await db
  //         .collection("enrolments")
  //         .where("studentId", "==", item["studentId"])
  //         .where("courseId", "==", item.courseId)
  //         .get()
  //         .then((data) => {
  //           console.log("i am here", data);
  //           data.forEach((doc) => {
  //             docId = doc.id;
  //           });
  //           return docId;
  //         })
  //         .then((id) => {
  //           console.log("Updating result for", id);
  //           db.collection("enrolments").doc(id).update({ result: grade });
  //           setupdating(false);
  //           message.info("Result Updated Successfully");
  //         });
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };
  //   fetchData();
  // };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    // handleGradeUpdate();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    var list = [];
    const fetchData = async () => {
      try {
        const response = await db
          .collection("requestedData")
          .where("requestedBy", "==", activeUser.userId)
          .get();
        response.forEach((info) => {
          if (info.exists) {
            list.push({
              reqData: info.data().requestedData,
              accessGranted: info.data().accessGranted,
              reqId: info.id,
            });
          }
        });
        console.log(list);
        setRequestedData(list);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();

    return () => {
      setloading(true);
    };
  }, []);

  useEffect(() => {
    var list = [];
    const fetchData = async () => {
      try {
        const response = await db
          .collection("users")
          .where("userId", "in", RequestedData)
          .get();
        response.forEach((info) => {
          if (info.exists) {
            list.push(info.data());
          }
        });
        setenrolments(list);
        setloading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();

    return () => {
      setloading(true);
    };
  }, [RequestedData, updating]);

  const handleViewData = (sId) => {
    var list = [];
    const fetchData = async () => {
      try {
        const response = await db
          .collection("enrolments")
          .where("studentId", "==", sId)
          .get();
        response.forEach((info) => {
          if (info.exists) {
            list.push({
              courseId: info.data().courseId,
              grade: info.data().result,
            });
          }
        });
        setenrolments(list);
        setloading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  };
  const viewData = (sId) => {
    handleViewData(sId);
    showModal();
  };

  return (
    <>
      <DashboardHeader
        header={"View Requested Data"}
        goBack={props.history.goBack}
        isNested
      />
      <Modal
        title="View Requested Data"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Spin spinning={updating} />
        <List
          itemLayout="horizontal"
          dataSource={enrolments}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <a>Subject ID: {item.courseId} &nbsp;&nbsp;&nbsp;&nbsp; Grade: {item.grade}</a>
                }
              />
            </List.Item>
          )}
        />
      </Modal>
      {loading && <Spin />}
      {!loading && (
        <div className="add_course_container">
          <List
            itemLayout="horizontal"
            dataSource={RequestedData}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    key="list-loadmore-edit"
                    disabled={!item.accessGranted}
                    onClick={() => {
                      viewData(item.reqData);
                    }}
                  >
                    View Data
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src="https://joeschmoe.io/api/v1/joe" />}
                  title={<a>Req ID: {item.reqId}</a>}
                  description={
                    <a>
                      Student ID: {item.reqData} &nbsp;&nbsp;&nbsp;&nbsp;Access
                      Granted:{" "}
                      {item.accessGranted ? (
                        <CheckSquareTwoTone twoToneColor="#52c41a" />
                      ) : (
                        <CloseSquareTwoTone twoToneColor="#FF0000" />
                      )}
                    </a>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      )}
    </>
  );
};

export default ViewRequestedData;
