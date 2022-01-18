import React from "react";
import { Link } from "react-router-dom";
import { formatTimeAs12HR, formatDateAsMDY } from "../../utils/date-time";
import capitalizeFirstLetter from "../../utils/format-string";

function ReservationCard({ reservation, handleCancelReservation }) {
  const {
    first_name,
    last_name,
    reservation_date,
    reservation_time,
    reservation_id,
    people,
    status,
  } = reservation;

  const SeatButton =
    status === "booked" ? (
      <Link
        to={`/reservations/${reservation_id}/seat`}
        className="btn mx-1 btn-outline-warning"
      >
        Seat
      </Link>
    ) : null;

  const CancelButton =
    status === "booked" ? (
      <button
        type="button"
        className={"btn mx-1 btn-outline-danger"}
        onClick={onClickCancelReservation}
        data-reservation-id-cancel={reservation_id}
      >
        Cancel
      </button>
    ) : null;

  const EditButton = ["booked", "seated"].includes(status) ? (
    <Link
      className={"btn mx-1 btn-outline-secondary"}
      to={`/reservations/${reservation_id}/edit`}
    >
      Edit
    </Link>
  ) : null;

  function onClickCancelReservation(event) {
    event.preventDefault();
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      handleCancelReservation(reservation.reservation_id);
    }
  }

  return (
    <div className="col-md-6 col-lg-3 mt-4">
      <div
        className="card shadow pb-5 mb-4 bg-white"
        style={{ width: "18rem" }}
      >
        <div className="card-body">
          <h4 className="card-title mt-2">{`${first_name} ${last_name}`}</h4>
          <p className="card-text">
            {formatTimeAs12HR(reservation_time)} on{" "}
            {formatDateAsMDY(reservation_date)}
          </p>
          <p className="card-text">{`Party of ${people}`}</p>
          <p
            className="mb-4 font-weight-bold"
            data-reservation-id-status={reservation_id}
          >
            {capitalizeFirstLetter(status)}
          </p>
          {SeatButton}
          {EditButton}
          {CancelButton}
        </div>
      </div>
    </div>
  );
}

export default ReservationCard;
