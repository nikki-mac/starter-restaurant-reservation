import React, { useEffect, useState } from "react";
import { cancelReservation, listReservations } from "../utils/api";
import { formatDateAsMDY, previous, next, today } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationList from "../layout/Reservations/ReservationList";
import TableList from "../layout/Tables/TableList";

function Dashboard({ dateString }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [date, setDate] = useState(dateString);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then((data) => {
        setReservations(
          data.filter((reservation) =>
            ["booked", "seated"].includes(reservation.status)
          )
        );
      })
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function handleCancelReservation(reservation_id) {
    const abortController = new AbortController();
    setReservationsError(null);
    cancelReservation(reservation_id, abortController.signal)
      .then(loadDashboard)
      .catch(setReservationsError);
  }

  function goToNextDay() {
    setDate(next(date));
  }
  function goToPrevDay() {
    setDate(previous(date));
  }
  function goToToday() {
    setDate(today());
  }

  return (
    <main>
      <h1 className="mt-4">Dashboard</h1>
      <div className="d-md-flex mb-3 align-items-center">
        <h3 className="mb-0 mr-2">Reservations for {formatDateAsMDY(date)}</h3>
        <div>
          <button
            type="button"
            className="btn text-nowrap btn-warning m-2 shadow p-2 mb-2"
            name="prevDayBtn"
            onClick={goToPrevDay}
          >
            Previous Day
          </button>
          <button
            type="button"
            className="btn text-nowrap btn-warning m-2 shadow p-2 mb-2"
            name="todayBtn"
            onClick={goToToday}
          >
            Today
          </button>
          <button
            type="button"
            className="btn text-nowrap btn-warning m-2 shadow p-2 mb-2"
            name="nextDayBtn"
            onClick={goToNextDay}
          >
            Next Day
          </button>
        </div>
      </div>
      <ErrorAlert error={reservationsError} />
      <ReservationList
        reservations={reservations}
        handleCancelReservation={handleCancelReservation}
      />
      <br />
      <TableList refresh={loadDashboard} handleErrors={setReservationsError} />
    </main>
  );
}

export default Dashboard;
