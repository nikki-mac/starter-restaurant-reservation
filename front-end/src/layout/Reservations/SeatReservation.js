import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";
import { listTables, getReservation, seatTable } from "../../utils/api";
import { formatTimeAs12HR } from "../../utils/date-time";
import ErrorAlert from "../ErrorAlert";

function SeatReservation() {
  const history = useHistory();
  const { reservationId } = useParams();

  const [tables, setTables] = useState([]);
  const [reservation, setReservation] = useState({ reservation_time: "00:00" });
  const [errors, setErrors] = useState(null);
  const [tableId, setTableId] = useState("");


  function loadInformation() {
    const abortController = new AbortController();
    setErrors(null);
    Promise.all([
      listTables({}, abortController.signal),
      getReservation(reservationId, abortController.signal),
    ])
      .then((responses) => {
        setTables(responses[0]);
        setReservation(responses[1]);
      })
      .catch((errors) => {
        setErrors(errors);
      });
  }

  useEffect(loadInformation, [reservationId]);


  function handleChange(event) {
    setTableId(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setErrors(null);
    if (tableId === "") {
      setErrors("Please select a table.");
    } else if (isNaN(tableId)) {
      setErrors("Please choose a valid table.");
    } else {
      seatReservationAtTable();
    }
  }

  async function seatReservationAtTable() {
    const abortController = new AbortController();
    setErrors(null);
    try {
      await seatTable(
        tableId,
        reservationId,
        abortController.signal
      );
      history.push(`/dashboard`);
    } catch (err) {
      if (err.name === "AbortError") {
        console.info("Aborted");
      } else {
        setErrors(err);
      }
    }
  }

  function handleCancel() {
    history.goBack();
  }

  const tableOptions = tables.map((table, index) => (
    <option key={index} value={table.table_id}>
      {table.table_name} - {table.capacity}
    </option>
  ));

  const { first_name, last_name, people, reservation_time } = reservation;

  
  return (
    <>
      <ErrorAlert error={errors} />
      <form onSubmit={handleSubmit}>
        <h3 className="my-2">
          {`Now Seating: ${first_name} ${last_name} - Party of ${people}`}
        </h3>
        <p>{`Reservation Time: ${formatTimeAs12HR(reservation_time)}`}</p>
        <label htmlFor="table_id">Seat at Table:</label>
        <select
          defaultValue={"default"}
          className="form-control my-2"
          name="table_id"
          id="table_id"
          onChange={handleChange}
        >
          <option value="default" disabled>
            --Please choose a table--
          </option>
          {tableOptions}
        </select>
        <button type="submit" className="btn btn-outline-warning m-2">
          Submit
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="btn btn-outline-danger m-2"
        >
          Cancel
        </button>
      </form>
    </>
  );
}

export default SeatReservation;
