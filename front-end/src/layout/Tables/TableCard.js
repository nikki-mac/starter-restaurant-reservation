import React from "react";
import { finishTable } from "../../utils/api";

function TableCard({ table, handleErrors, refreshTables }) {
  const { table_name, table_id, capacity, reservation_id } = table;

  async function finish() {
    const abortController = new AbortController();
    if (
      !window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    )
      return;
    try {
      await finishTable(table_id, abortController.signal);
      refreshTables();
    } catch (err) {
      handleErrors(err);
    }
  }

  const occupiedStatus = reservation_id ? "Occupied" : "Free";

  const finishButton = reservation_id ? (
    <button
      data-table-id-finish={table_id}
      className="btn btn-outline-warning"
      onClick={finish}
    >
      Finish Table
    </button>
  ) : null;

  return (
    <div className="col-md-6 col-lg-3 mt-4">
      <div
        className="card shadow pb-5 mb-4 bg-white"
        style={{ width: "18rem" }}
      >
        <h4 className="card-title mt-4">{`${table_name}`}</h4>
        <div className="card-body">
          <p className="card-text">{`Seats Party of ${capacity}`}</p>
          <p
            className="card-text mb-4 font-weight-bold"
            data-table-id-status={table_id}
          >{`Availability: ${occupiedStatus}`}</p>
          {finishButton}
        </div>
      </div>
    </div>
  );
}

export default TableCard;
