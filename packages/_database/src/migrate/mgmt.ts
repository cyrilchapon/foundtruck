import { Command } from '@commander-js/extra-typings'
import { mgmtEnv } from '../env/mgmt-env'
import { createDatabase, dropDatabase } from './util'
import { createMongo } from '../mongo'

const mongo = createMongo({ MONGO_URI: mgmtEnv.MONGO_MGMT_URI })

const program = new Command()
program.name('db').description('Perform database management tasks')

program
  .command('create')
  .description('Create database')
  .action(async () => {
    await createDatabase(mongo)(mgmtEnv.MONGO_MGMT_DB_NAME)
  })

program
  .command('drop')
  .description('Drop database')
  .action(async () => {
    await dropDatabase(mongo)(mgmtEnv.MONGO_MGMT_DB_NAME)
  })

const go = async () => {
  try {
    await program.parseAsync()
  } finally {
    await mongo.close()
  }
}

void go()
