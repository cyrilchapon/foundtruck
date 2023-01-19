import { Command } from '@commander-js/extra-typings'
import { mgmtEnv } from '../env/mgmt-env'
import { URL } from 'url'
import { createDatabase, dropDatabase } from './util'
import { createMongo } from '../mongo'

const _mgmtURL = new URL(mgmtEnv.MONGO_URI)
const dbName = _mgmtURL.pathname.replace('/', '')
_mgmtURL.pathname = ''
const mgmtURL = _mgmtURL.toString()

const mongo = createMongo({ MONGO_URI: mgmtURL })

const program = new Command()
program.name('db').description('Perform database management tasks')

program
  .command('create')
  .description('Create database')
  .action(async () => {
    await createDatabase(mongo)(dbName)
  })

program
  .command('drop')
  .description('Drop database')
  .action(async () => {
    await dropDatabase(mongo)(dbName)
  })

const go = async () => {
  try {
    await program.parseAsync()
  } finally {
    await mongo.close()
  }
}

void go()
