import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import axios from "axios";
import { toast } from "react-hot-toast";

import Layout from "../components/Layout";
import "../styles/ApplyDoctor.css";
import { Button, Col, DatePicker, Row, TimePicker } from "antd/dist/antd";

function BookAppointment() {
  const [isAvailable, setIsAvailable] = useState(false);
  const navigate = useNavigate();
  const [date, setDate] = useState();
  const [time, setTime] = useState();

  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const params = useParams();
  const dispatch = useDispatch();

  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/get-doctor-info-by-id",
        {
          doctorId: params.doctorId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());
      if (response.data.success) {
        setDoctor(response.data.data);
      }
    } catch (error) {
      console.log(error);
      dispatch(hideLoading());
    }
  };

  const checkAvailability = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/check-booking-availability",
        {
          doctorId: params.doctorId,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        setIsAvailable(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error in booking appointment");
      dispatch(hideLoading());
    }
  };

  const bookNow = async () => {
    setIsAvailable(false);
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctor,
          userInfo: user,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());
      if (response.data.success) {
        toast.success("Appointment booked successfully");
        navigate('/appointments');
      }
    } catch (error) {
      toast.error("Error in booking appointment");
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getDoctorData();
  }, []);

  return (
    <Layout>
      <div className="page-title">
        {doctor && (
          <div>
            <h1 className="page-title">
              {doctor.firstName} {doctor.lastName}
            </h1>
            <hr />

            <Row gutter={20} className="mt-2" align="center">
              <Col span={8} sm={24} xs={24} lg={8}>
                <h1 className="normal-text">
                  <p>
                    <b>Timing:</b> {doctor.timings[0]} - {doctor.timings[1]}
                  </p>

                  <p>
                    <b>Phone Number: </b>
                    {doctor.phoneNumber}
                  </p>

                  <p>
                    <b>Address: </b>
                    {doctor.address}
                  </p>

                  <p>
                    <b>Website: </b>
                    {doctor.website}
                  </p>

                  <p>
                    <b>Fee per Visit: </b>
                    {doctor.feePerConsultation}
                  </p>
                </h1>

                <div className="d-flex flex-column pt-2">
                  <DatePicker
                    onChange={(value) => {
                      setDate(value.format("DD-MM-YYYY"));
                      setIsAvailable(false);
                    }}
                  />

                  <TimePicker
                    format="HH:mm"
                    className="mt-3"
                    onChange={(value) => {
                      setTime(value.format("HH:mm"));
                      setIsAvailable(false);
                    }}
                  />

                  {!isAvailable && (
                    <Button
                      className="primary-button mt-3 full-width-button"
                      onClick={checkAvailability}
                    >
                      Check Availability
                    </Button>
                  )}

                  {isAvailable && (
                    <Button
                      className="primary-button mt-3 full-width-button"
                      onClick={bookNow}
                    >
                      Book Now
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default BookAppointment;
