import { Knex } from 'knex'

export const createUpdateTimestampFn =
  (knex: Knex | Knex.Transaction) =>
  async (tableName: string, columnName: string) =>
    knex.raw(`
  CREATE FUNCTION update_${tableName}_timestamp()
  RETURNS trigger AS $$
  BEGIN
    NEW.${columnName} = now();
    RETURN NEW;
  END;
  $$ language 'plpgsql';
`)

export const dropUpdateTimestampFn =
  (knex: Knex | Knex.Transaction) =>
  async (tableName: string, columnName: string) =>
    knex.raw(`
  DROP FUNCTION update_${tableName}_timestamp();
`)

export const createUpdateTrigger =
  (knex: Knex | Knex.Transaction) =>
  async (tableName: string, columnName: string) =>
    knex.raw(`
  CREATE TRIGGER ${tableName}_${columnName}
  BEFORE UPDATE ON ${tableName}
  FOR EACH ROW
  EXECUTE PROCEDURE update_${tableName}_timestamp();
`)

export const dropUpdateTrigger =
  (knex: Knex | Knex.Transaction) =>
  async (tableName: string, columnName: string) =>
    knex.raw(`
  DROP TRIGGER ${tableName}_${columnName}
  ON ${tableName};
`)

export const createDatabase =
  (knex: Knex | Knex.Transaction) => async (dbName: string) =>
    knex.raw(`CREATE DATABASE ??`, dbName)

export const dropDatabase =
  (knex: Knex | Knex.Transaction) => async (dbName: string) =>
    knex.raw(`DROP DATABASE ??`, dbName)
