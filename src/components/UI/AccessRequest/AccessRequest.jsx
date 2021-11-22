import React, { useState } from "react";
import { Button, Input, message, Form, Modal } from "antd";
import "./AccessRequest.css";
import { DashboardHeader } from "..";
import { db } from "../../../firebase";
import { useAuth } from "../../../contexts/authContexts";
import "firebase/firestore";
import firebase from "firebase";

const AccessRequest = (props) => {
  const { activeUser, setActiveUser } = useAuth();
  const [form] = Form.useForm();
  const [student, setstudent] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);

  const timeNow = new Date();
  const handleAccessRequest = () => {
    var docId = getHash(20);
    db.collection("requestedData")
      .doc(docId)
      .set({
        requestedBy: activeUser.userId,
        requestedData: student.userId,
        requestedAt: timeNow,
        accessGranted: false,
      })
      .then(() => {
        message.success("Access to student record requested.");
        let newBalance = activeUser.balance - 1;
        setActiveUser({
          ...activeUser,
          balance: newBalance,
        });
        createTransaction(docId);
      });
  };

  const createTransaction = (id) => {
    const fetchData = async () => {
      try {
        var dataToReturn = "";
        const query = await db
          .collection("transactions")
          .orderBy("createdAt", "desc")
          .limit(1)
          .get()
          .then((docs) => {
            if (docs.empty) {
              dataToReturn = "firstBlock";
            } else {
              docs.forEach((doc) => {
                dataToReturn = doc.data().currHash;
              });
            }
            return dataToReturn;
          })
          .then((prvHash) => {
            var currHash = getHash(32);
            updateTxn({
              operation: "accessRequest",
              cost: 1,
              docId: id,
              prvHash,
              currHash,
            });
          });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  };

  const getHash = (size) =>
    [...Array(size)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("");

  const updateTxn = (txnInfo) => {
    var dateTime = Date.now();
    var timestamp = Math.floor(dateTime / 1000);
    const decrement = firebase.firestore.FieldValue.increment(-1);
    db.collection("transactions")
      .add({ ...txnInfo, createdAt: timestamp })
      .then(() => {
        db.collection("users")
          .doc(activeUser.userId)
          .update({ balance: decrement });
      });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    handleAccessRequest();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = (values, clearProps) => {
    db.collection("users")
      .doc(values.code)
      .get()
      .then((doc) => {
        if (doc.exists) {
          if (doc.data().type == "Student") {
            setstudent(doc.data());
            return doc.data();
          } else {
            message.error("No such student exists!!!");
          }
        } else {
          message.error("No such student exists!!!");
        }
        return {};
      })
      .then((snap) => {
        if (Object.keys(snap).length > 0) {
          setIsModalVisible(true);
        } else {
          console.log("No Keys");
        }
      })
      .catch((err) => console.log(err));

    form.resetFields();
  };

  return (
    <>
      <DashboardHeader
        header={"Access Request"}
        subtext={"This operation carries a fees of 1 VUCoin."}
        goBack={props.history.goBack}
        isNested
      />
      <Modal
        title="Access Request"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Student Name: &nbsp;&nbsp;&nbsp;&nbsp;{student.name} </p>
        <p>Email: &nbsp;&nbsp;&nbsp;&nbsp;{student.email}</p>
        <p>Department: &nbsp;&nbsp;&nbsp;&nbsp;{student.studentDepartment}</p>
      </Modal>
      <div className="add_course_container">
        <Form
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            name="code"
            label="Student ID"
            rules={[
              {
                required: true,
                message:
                  "Please enter the ID of student whose record you want to access.",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button className="bg-dark" htmlType="submit">
              Find Student
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default AccessRequest;
