import React from "react";
import { Button, Input, message, Form } from "antd";
import "./AddCourse.css";
import { DashboardHeader } from "../";
import { db } from "./../../../firebase";
import { useAuth } from "../../../contexts/authContexts";
import "firebase/firestore";
import firebase from "firebase";

const AddCourse = (props) => {
  const { activeUser, setActiveUser } = useAuth();
  const [form] = Form.useForm();

  const onFinish = (values, clearProps) => {
    let CourseDetails = {
      courseID: values.code,
      courseName: values.name,
    };

    db.collection("courses")
      .doc()
      .set(CourseDetails)
      .then(() => {
        message.success("Course Added Successfully");
      })
      .catch((error) => message.error(error));
    console.log(activeUser);

    db.collection("users")
      .doc(activeUser.userId)
      .update({
        courses: firebase.firestore.FieldValue.arrayUnion(values.code),
      })
      .then(() => {
        let newBalance = activeUser.balance - 1;
        setActiveUser({
          ...activeUser,
          balance: newBalance,
        });
        createTransaction();
      });

    form.resetFields();
  };

  const createTransaction = () => {
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
              operation: "addCourse",
              cost: 1,
              docId: activeUser.userId,
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

  return (
    <>
      <DashboardHeader
        header={"Add Course"}
        subtext={"This operation carries a fees of 1 VUCoin."}
        goBack={props.history.goBack}
        isNested
      />
      <div className="add_course_container">
        <Form
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            name="name"
            label="Course Name"
            rules={[
              {
                required: true,
                message: "Please input the course name!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="code"
            label="Course Code"
            rules={[
              {
                required: true,
                message: "Please input the course code!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button className="bg-dark" htmlType="submit">
              Register Course
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default AddCourse;
