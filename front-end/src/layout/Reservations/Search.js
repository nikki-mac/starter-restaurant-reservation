import React, { useState } from "react";
import { listReservations, cancelReservation } from "../../utils/api";
import ReservationList from "./ReservationList";
import ErrorAlert from "../ErrorAlert";

function SearchReservations() {
  const [mobile_number, setMobileNumber] = useState("");
  const [reservations, setReservations] = useState([]);
  const [errors, setErrors] = useState(undefined);

  function handleChange({ target }) {
    let { value } = target;
    setMobileNumber(value);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    beginSearch();
  };

  async function beginSearch() {
    try {
      const reservations = await listReservations({ mobile_number });
      let filteredReservations = reservations.filter((reservation) =>
        ["booked", "seated"].includes(reservation.status)
      );
      setReservations(filteredReservations);
    } catch (err) {
      setErrors(err);
    }
  };

  function handleCancelReservation(reservation_id) {
    const abortController = new AbortController();
    setErrors(null);

    cancelReservation(reservation_id, abortController.signal)
      .then(beginSearch)
      .catch(setErrors);
  }

  const reservationList =
    reservations?.length > 0 ? (
      <ReservationList
        handleCancelReservation={handleCancelReservation}
        reservations={reservations}
      />
    ) : (
      <p>No reservations found.</p>
    );

  return (
    <>
      <h1 className="mb-3">Search Reservations</h1>
      <ErrorAlert error={errors} />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="mobile_number">Mobile Number</label>
          <input
            className="form-control"
            name="mobile_number"
            id="mobile_number"
            onChange={handleChange}
            value={mobile_number}
            type="text"
          />
        </div>
        <button type="submit" className="btn btn-outline-warning m-2">
          Search
        </button>
      </form>
      <br />
      {reservationList}
    </>
  );
}

export default SearchReservations;
