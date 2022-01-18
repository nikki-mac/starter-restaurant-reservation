import React, { useState } from "react";
import { useHistory } from "react-router";
import { createReservation } from "../../utils/api";
import { getValidationErrors } from "../../validation/reservations";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "../ErrorAlert";

function NewReservation() {
  const history = useHistory();
  const [errors, setErrors] = useState(undefined);
  
  function isValidReservation(reservationInfo) {
    const errorMessages = getValidationErrors(reservationInfo);
    if (errorMessages.length > 0) {
      setErrors({ message: errorMessages.join("\n") });
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
        await createReservation(reservationInfo, abortController.signal);
        history.push(`/dashboard?date=${reservationInfo.reservation_date}`);
      } catch (err) {
        setErrors(err);
      }
    }
  };

  function handleCancel() {
    history.goBack();
  };

  return (
    <>
      <h1 className="mb-3">Create Reservation</h1>
      <ErrorAlert error={errors} />
      <ReservationForm handleSubmit={handleSubmit} handleCancel={handleCancel} />
    </>
  );
}

export default NewReservation;
