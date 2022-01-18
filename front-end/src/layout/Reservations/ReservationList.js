import React from "react";
import ReservationCard from "./ReservationCard";
import "./ReservationList.css";

function ReservationList({ reservations, handleCancelReservation }) {
  const reservation_list = reservations.map((reservation, index) => (
    <ReservationCard
      reservation={reservation}
      key={index}
      handleCancelReservation={handleCancelReservation}
    />
  ));

  return <div className="reservation-list">{reservation_list}</div>;
}

export default ReservationList;
