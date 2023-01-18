import type { Migration } from '../umzug'

export const up: Migration = async ({ context: { knex } }) => {
  await knex.raw(`
    CREATE FUNCTION BBox(x integer, y integer, zoom integer)
      RETURNS geometry AS
    $BODY$
    DECLARE
      max numeric := 6378137 * pi();
      res numeric := max * 2 / 2^zoom;
      bbox geometry;
    BEGIN
      return ST_MakeEnvelope(
          -max + (x * res),
          max - (y * res),
          -max + (x * res) + res,
          max - (y * res) - res,
          3857);
    END;
    $BODY$
    LANGUAGE plpgsql IMMUTABLE;
  `)
}

export const down: Migration = async ({ context: { knex } }) => {
  await knex.raw('DROP FUNCTION BBox;')
}
