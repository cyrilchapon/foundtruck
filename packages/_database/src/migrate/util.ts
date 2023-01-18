import { Knex } from 'knex'
import { KnexOrTransaction } from '../util'

export const createUpdateTimestampFn =
  (knex: KnexOrTransaction) =>
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
  (knex: KnexOrTransaction) =>
  async (tableName: string, columnName: string) =>
    knex.raw(`
  DROP FUNCTION update_${tableName}_timestamp();
`)

export const createUpdateTrigger =
  (knex: KnexOrTransaction) =>
  async (tableName: string, columnName: string) =>
    knex.raw(`
  CREATE TRIGGER ${tableName}_${columnName}
  BEFORE UPDATE ON ${tableName}
  FOR EACH ROW
  EXECUTE PROCEDURE update_${tableName}_timestamp();
`)

export const dropUpdateTrigger =
  (knex: KnexOrTransaction) =>
  async (tableName: string, columnName: string) =>
    knex.raw(`
  DROP TRIGGER ${tableName}_${columnName}
  ON ${tableName};
`)

export const createDatabase =
  (knex: KnexOrTransaction) => async (dbName: string) =>
    knex.raw(`CREATE DATABASE ??`, dbName)

export const dropDatabase =
  (knex: KnexOrTransaction) => async (dbName: string) =>
    knex.raw(`DROP DATABASE ??`, dbName)
