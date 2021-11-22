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
import "./UpdateResult.css";
import { DashboardHeader } from "..";
import { db } from "../../../firebase";
import { useAuth } from "../../../contexts/authContexts";
import "firebase/firestore";
import firebase from "firebase";

const { Option } = Select;

const UpdateResult = (props) => {
  const { activeUser, setActiveUser } = useAuth();
  const [form] = Form.useForm();
  const [courses, setcourses] = useState([]);
  const [enrolments, setenrolments] = useState([]);
  const [loading, setloading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [item, setitem] = useState({});
  const [grade, setgrade] = useState("P");
  const [updating, setupdating] = useState(false);

  const handleGradeUpdate = () => {
    setupdating(true);
    const fetchData = async () => {
      try {
        console.log(item.studentId);
        var docId = "";
        const query = await db
          .collection("enrolments")
          .where("studentId", "==", item["studentId"])
          .where("courseId", "==", item.courseId)
          .get()
          .then((data) => {
            data.forEach((doc) => {
              docId = doc.id;
            });
            return docId;
          })
          .then((id) => {
            db.collection("enrolments").doc(id).update({ result: grade });
            setupdating(false);
            let newBalance = activeUser.balance - 1;
            console.log(newBalance)
            setActiveUser({
              ...activeUser,
              balance: newBalance,
            });
            message.info("Result Updated Successfully");
            return id;
          })
          .then((id) => {
            createTransaction(id);
          });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
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
              operation: "updateResult",
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
    handleGradeUpdate();
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
          .collection("users")
          .where("userId", "==", activeUser.userId)
          .get();
        response.forEach((info) => {
          if (info.exists) {
            setcourses(info.data().courses);
          }
        });
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
          .collection("enrolments")
          .where("courseId", "in", courses)
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
  }, [courses, updating]);

  const updateGrade = (info) => {
    setitem(info);
    showModal();
  };

  return (
    <>
      <DashboardHeader
        header={"Update Result"}
        goBack={props.history.goBack}
        subtext={"This operation carries a fees of 1 VUCoin."}
        isNested
      />
      <Modal
        title="Update Grade"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Spin spinning={updating} />
        <p> Student ID: {item.studentId} &nbsp;&nbsp;&nbsp;&nbsp;</p>
        <p>Course ID: {item.courseId} &nbsp;&nbsp;&nbsp;&nbsp;</p>
        <p>Result: {item.result}</p>
        <p>
          Grade: &nbsp; &nbsp; &nbsp;
          <Select
            defaultValue="P"
            onChange={(i) => {
              setgrade(i);
            }}
          >
            <Option value="HD">HD</Option>
            <Option value="D">D</Option>
            <Option value="C">C</Option>
            <Option value="P">P</Option>
            <Option value="N">N</Option>
          </Select>
        </p>
      </Modal>
      {loading && <Spin />}
      {!loading && (
        <div className="add_course_container">
          <List
            itemLayout="horizontal"
            dataSource={enrolments}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    key="list-loadmore-edit"
                    onClick={() => updateGrade(item)}
                  >
                    Update Grade
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src="https://joeschmoe.io/api/v1/joe" />}
                  title={<a>{item.email}</a>}
                  description={
                    <a>
                      Student ID: {item.studentId} &nbsp;&nbsp;&nbsp;&nbsp;
                      Course ID: {item.courseId} &nbsp;&nbsp;&nbsp;&nbsp;
                      Result: {item.result}
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

export default UpdateResult;
