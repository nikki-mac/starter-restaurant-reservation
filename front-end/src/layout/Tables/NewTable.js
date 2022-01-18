import React, { useState } from "react";
import { useHistory } from "react-router";
import { createTable } from "../../utils/api";
import { getValidationErrors } from "../../validation/tables";
import ErrorAlert from "../ErrorAlert";


function NewTable({ table = {}, handleSubmit = () => {} }) {
  const history = useHistory();
  const [tableInfo, setTableInfo] = useState(table);
  const [errors, setErrors] = useState(undefined);
  

  function handleChange({ target }) {
    let { name, value } = target;
    if (name === "capacity") value = parseInt(value);
    setTableInfo({ ...tableInfo, [name]: value });
  }

  function isValidTable(tableInfo) {
    const errorMessages = getValidationErrors(tableInfo);
    if (errorMessages.length > 0) {
      setErrors({ message: errorMessages.join("\n") });
      return false;
    } else {
      setErrors(undefined);
    }
    return true;
  }

  async function submit(event) {
    const abortController = new AbortController();
    event.preventDefault();
    if (isValidTable(tableInfo)) {
      try {
        await createTable(tableInfo, abortController.signal);
        history.push("/dashboard");
      } catch (err) {
        if (err.name === "AbortError") {
          console.info("Aborted");
        } else {
          throw err;
        }
      }
    }
    handleSubmit(tableInfo);
  }

  function handleCancel(event) {
    history.goBack();
  }

  
  return (
    <>
      <h1 className="mb-3">Create Table</h1>
      <ErrorAlert error={errors} />
      <form onSubmit={submit}>
        <div className="form-group">
          <label htmlFor="table_name">Table Name</label>
          <input
            className="form-control"
            name="table_name"
            id="table_name"
            onChange={handleChange}
            value={tableInfo.table_name || ""}
            type="text"
            minLength="2"
          />
          <label htmlFor="capacity">Number of Seats</label>
          <input
            className="form-control"
            name="capacity"
            id="capacity"
            onChange={handleChange}
            value={tableInfo?.capacity || ""}
            type="number"
            min={1}
          />
        </div>
        <button type="submit" className="btn btn-outline-warning m-2">
          Submit
        </button>
        <button onClick={handleCancel} className="btn btn-outline-danger m-2">
          Cancel
        </button>
      </form>
    </>
  );
}

export default NewTable;
