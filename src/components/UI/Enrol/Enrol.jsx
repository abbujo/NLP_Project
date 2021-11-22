import React, { useEffect, useState } from "react";
import { Button, Input, message, Form, Select, Spin } from "antd";
import "./Enrol.css";
import { DashboardHeader } from "..";
import { db } from "../../../firebase";
import { useAuth } from "../../../contexts/authContexts";
import "firebase/firestore";
import firebase from "firebase";

const { Option } = Select;

const Enrol = (props) => {
  const { activeUser, setActiveUser } = useAuth();
  const [form] = Form.useForm();
  const [courses, setcourses] = useState([]);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    var list = [];
    const fetchData = async () => {
      try {
        const response = await db.collection("courses").get();
        response.forEach((info) => {
          if (info.exists) {
            list.push(info.data().courseID);
          }
        });
        setcourses(list);
        setloading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();

    return () => {
      setloading(true);
    };
  }, []);

  const onFinish = (values, clearProps) => {
    var docId = getHash(20);
    db.collection("enrolments")
      .doc(docId)
      .set({
        studentId: activeUser.userId,
        email: activeUser.email,
        courseId: values.type,
        result: "NA",
      })
      .then((info) => {
        console.log(info);
        createTransaction(docId);
        let newBalance = activeUser.balance - 1;
        setActiveUser({
          ...activeUser,
          balance: newBalance,
        });
        message.success("Enrolled Successfully");
      })
      .catch((error) => message.error(error));

    // db.collection("users")
    //   .doc(activeUser.userId)
    //   .update({
    //     courses: firebase.firestore.FieldValue.arrayUnion(values.code),
    //   });

    form.resetFields();
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
              operation: "enrolment",
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

  return (
    <>
      <DashboardHeader
        header={"Enrol into a Course"}
        subtext={"This operation carries a fees of 1 VUCoin."}
        goBack={props.history.goBack}
        isNested
      />
      {loading && <Spin />}
      {!loading && (
        <div className="add_course_container">
          <Form
            name="normal_login"
            className="login-form"
            onFinish={onFinish}
            form={form}
          >
            <Form.Item name="type">
              <Select placeholder="Select Course">
                {courses.map((course) => (
                  <Option value={course}>{course}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <Button className="bg-dark" htmlType="submit">
                Enrol Course
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </>
  );
};

export default Enrol;
