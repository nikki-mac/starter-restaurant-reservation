import "./TableList.css";
import React, { useEffect, useState } from "react";
import { listTables } from "../../utils/api";
import TableCard from "./TableCard";
import ErrorAlert from "../ErrorAlert";


function TableList({ handleErrors, refresh }) {
  const [tables, setTables] = useState([]);
  const [errors, setErrors] = useState(null);

  function loadTables() {
    const abortController = new AbortController();
    listTables({}, abortController.signal).then(setTables).catch(setErrors);
    return () => abortController.abort();
  }

  useEffect(loadTables, []);

  const table_list = tables.map((table, index) => (
    <TableCard
      table={table}
      key={index}
      handleErrors={handleErrors}
      refreshTables={refreshTables}
    />
  ));

  function refreshTables() {
    loadTables();
    refresh();
  }

  return (
    <section className="table-list-section">
      <ErrorAlert error={errors} />
      <h3>Tables</h3>
      <div className="table-list">{table_list}</div>
    </section>
  );
}

export default TableList;
