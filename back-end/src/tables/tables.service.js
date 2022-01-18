const knex = require("../db/connection");

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

function read(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}

function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

async function seat(table_id, reservation_id) {
  try {
    await knex.transaction(async (trx) => {
      const table = await trx("tables")
        .select("*")
        .where({ table_id })
        .update({ reservation_id }, "*")
        .then((updatedRecords) => updatedRecords[0]);

      await trx("reservations")
        .select("*")
        .where({ reservation_id })
        .update({ status: "seated" }, "*");
      return table;
    });
  } catch (error) {
    console.error(error);
  }
}

async function finish(table_id, reservation_id) {
  try {
    await knex.transaction(async (trx) => {
      const table = await trx("tables")
        .select("*")
        .where({ table_id })
        .update({ reservation_id: null }, "*")
        .then((updatedRecords) => updatedRecords[0]);

      await trx("reservations")
        .select("*")
        .where({ reservation_id })
        .update({ status: "finished" }, "*");
      return table;
    });
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  list,
  read,
  create,
  seat,
  finish,
};
