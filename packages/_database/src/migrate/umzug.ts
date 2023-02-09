import { MongoDBStorage, Umzug } from 'umzug'
import fs from 'fs'
import path from 'path'
import { MongoClient } from 'mongodb'

export type UmzugPurpose = 'migration' | 'seed'

export const createUmzug = (mongo: MongoClient, purpose: UmzugPurpose) => {
  const db = mongo.db()

  const umzug = new Umzug({
    storage: new MongoDBStorage({
      connection: db,
      collectionName: `${purpose}s`,
    }),
    context: {
      mongo,
    },
    migrations: {
      glob: `src/migrate/${purpose}s/!(_template).ts`,
    },
    logger: console,
    create: {
      folder: path.resolve(__dirname, `${purpose}s`),
      template: (filepath) => [
        [
          filepath,
          fs
            .readFileSync(
              path.resolve(__dirname, `${purpose}s`, '_template.ts'),
            )
            .toString(),
        ],
      ],
    },
  })

  return umzug
}

type _Umzug = ReturnType<typeof createUmzug>
export type Migration = _Umzug['_types']['migration']
