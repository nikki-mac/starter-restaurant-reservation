import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { editReservation, getReservation } from "../../utils/api";
import { getValidationErrors } from "../../validation/reservations";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "../ErrorAlert";

function EditReservation() {
  const history = useHistory();
  const { reservationId } = useParams();
  const [reservationInfo, setReservationInfo] = useState(undefined);
  const [errors, setErrors] = useState(undefined);


  function getReservationInfo() {
    const abortController = new AbortController();
    setErrors(undefined);
    if (!isNaN(reservationId)) {
      getReservation(reservationId, abortController.signal)
        .then((reservation) => {
          reservation.reservation_time = reservation.reservation_time.slice(0, 5);
          setReservationInfo(reservation);
        })
        .catch(setErrors);
    }
    return () => abortController.abort();
  };

  useEffect(getReservationInfo, [reservationId]);

  function isValidReservation(reservationInfo) {
    const errorMessages = getValidationErrors(reservationInfo);
    if (errorMessages.length > 0) {
      setErrors({ message: errorMessages.join("\n") });
      console.error("Invalid reservation", reservationInfo, errorMessages);
      return false;
    } else {
      setErrors(undefined);
    }
    return true;
  };

  async function handleSubmit(reservationInfo) {
    const abortController = new AbortController();
    if (isValidReservation(reservationInfo)) {
      try {
        await editReservation(reservationInfo, abortController.signal);
        history.push(`/dashboard?date=${reservationInfo.reservation_date}`);
      } catch (err) {
        setErrors(err);
      }
    } else {
    }
  };

  function handleCancel(event) {
    history.goBack();
  };

  return (
    <>
      <h1 className="mb-3">Edit Reservation</h1>
      <ErrorAlert error={errors} />
      <ReservationForm
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        reservation={reservationInfo}
      />
    </>
  );
}

export default EditReservation;
