import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import axios from "axios";
import { Table } from "antd";
import moment from "moment";


function Appointments() {

    const [appointments, setAppointments ] = useState([]);
    const dispatch = useDispatch();
  
    const getAppointmentData = async () => {
      try {
        dispatch(showLoading());
        const response = await axios.get("/api/user/get-appointments-by-user-id", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        dispatch(hideLoading());
        if (response.data.success) {
          setAppointments(response.data.data);
        }
      } catch (error) {
        dispatch(hideLoading());
        console.log(error);
      }
    };

    const columns = [
        {
            title: "Id",
            dataIndex: "_id",
        },
        {
          title: "Doctor",
          dataIndex: "name",
          render: (text, record) => (
            <span>
              {record.doctorInfo.firstName} {record.doctorInfo.lastName}
            </span>
          ),
        },
        {
          title: "Phone",
          dataIndex: "phoneNumber",
          render: (text, record) => (
            <span>
              {record.doctorInfo.phoneNumber}
            </span>
          ),
        },
        {
          title: "Data",
          dataIndex: "createdAt",
          render: (text, record) => (
            <span>
               {moment(record.date).format("DD-MM-YYYY")}
            </span>
          ),
        },
        {
          title: "Time",
          dataIndex: "createdAt",
          render: (text, record) => (
            <span>
               {moment(record.time).format("HH:mm")}
            </span>
          ),
        },
        {
            title: "Status",
            dataIndex: "status",
        },
      ];

    useEffect(() => {
        getAppointmentData();
      }, []);

  return (
    <Layout>
      <h1 className="page-header">Appointments</h1>
      <Table columns={columns} dataSource={appointments} />
    </Layout>
  )
}

export default Appointments
