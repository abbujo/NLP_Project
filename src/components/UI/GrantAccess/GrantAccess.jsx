import React, { useEffect, useState } from "react";
import { List, Avatar, message, Spin, Button, Modal } from "antd";
import "./GrantAccess.css";
import { DashboardHeader } from "..";
import { db } from "../../../firebase";
import { useAuth } from "../../../contexts/authContexts";
import "firebase/firestore";
import firebase from "firebase";

const GrantAccess = (props) => {
  const { activeUser, setActiveUser } = useAuth();
  const [requests, setrequests] = useState([]);
  const [loading, setloading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [approval, setApproval] = useState("");
  const [updating, setupdating] = useState(true);

  const handleApproval = () => {
    const fetchData = async () => {
      try {
        var docId = "";
        await db
          .collection("requestedData")
          .doc(approval.requestId)
          .update({ accessGranted: true })
          .then(() => {
            setupdating(false);
            message.success("Successfully granted the request");
            let newBalance = activeUser.balance - 1;
            setActiveUser({
              ...activeUser,
              balance: newBalance,
            });
            createTransaction(approval.requestId);
          });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    handleApproval();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
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
              operation: "grantAccess",
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

  useEffect(() => {
    var list = [];
    const fetchData = async () => {
      try {
        const response = await db
          .collection("requestedData")
          .where("requestedData", "==", activeUser.userId)
          .get();
        response.forEach((info) => {
          if (info.exists) {
            console.log({ ...info.data(), requestId: info.id });
            list.push({ ...info.data(), requestId: info.id });
          }
        });
        setrequests(list);
        setloading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();

    return () => {
      setloading(true);
    };
  }, [updating]);

  const grantAccess = (info) => {
    setApproval(info);
    showModal();
  };

  return (
    <>
      <DashboardHeader
        header={"Grant Access"}
        subtext={"This operation carries a fees of 1 VUCoin."}
        goBack={props.history.goBack}
        isNested
      />
      <Modal
        title="Update Grade"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Are you sure you want to grant access to this user?</p>
      </Modal>
      {loading && <Spin />}
      {!loading && (
        <div className="add_course_container">
          <List
            itemLayout="horizontal"
            dataSource={requests}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    key="list-loadmore-edit"
                    disabled={item.accessGranted}
                    onClick={() => grantAccess(item)}
                  >
                    Grant Access
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src="https://joeschmoe.io/api/v1/joe" />}
                  title={
                    <a>
                      Requested On:
                      {new Date(
                        item.requestedAt.seconds * 1000
                      ).toLocaleDateString("en-US")}
                    </a>
                  }
                  description={
                    <a>
                      Requested By: {item.requestedBy} &nbsp;&nbsp;&nbsp;&nbsp;
                      Access Granted: {item.accessGranted ? "Yes" : "No"}{" "}
                      &nbsp;&nbsp;&nbsp;&nbsp;
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

export default GrantAccess;
