import { Knex } from 'knex'
import { Umzug } from 'umzug'
import { KnexStorage } from './umzug-knex-storage'
import fs from 'fs'
import path from 'path'

export type UmzugPurpose = 'migration' | 'seed'

export const createUmzug = (knex: Knex, purpose: UmzugPurpose) => {
  const umzug = new Umzug({
    storage: new KnexStorage({
      knex,
      schemaName: 'migrations',
      tableName: `executed_${purpose}s`,
    }),
    context: {
      knex,
    },
    migrations: {
      glob: `src/migrate/${purpose}s/!(_template).ts`,
    },
    logger: console,
    create: {
      folder: path.resolve(__dirname, `${purpose}s`),
      template: (filepath) => ([
        [filepath, fs.readFileSync(path.resolve(__dirname, `${purpose}s`, '_template.ts')).toString()]
      ]),
    }
  })

  return umzug
}

type _Umzug = ReturnType<typeof createUmzug>
export type Migration = _Umzug['_types']['migration']
