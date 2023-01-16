import { Command } from '@commander-js/extra-typings'
import { mgmtEnv } from '../env/mgmt-env'
import { createKnex } from '../knex'
import { URL } from 'url'
import { createDatabase, dropDatabase } from './util'

const _mgmtURL = new URL(mgmtEnv.DATABASE_URL)
_mgmtURL.pathname = ''
const mgmtURL = _mgmtURL.toString()

const knex = createKnex({ DATABASE_URL: mgmtURL })

const program = new Command()
program
  .name('db')
  .description('Perform database management tasks')

program
  .command('create')
  .description('Create database')
  .action(async () => {
    const dbName = new URL(mgmtEnv.DATABASE_URL).pathname.replace('/', '')
    await createDatabase(knex)(dbName)
  })

program
  .command('drop')
  .description('Drop database')
  .action(async () => {
    const dbName = new URL(mgmtEnv.DATABASE_URL).pathname.replace('/', '')
    await dropDatabase(knex)(dbName)
  })

const go = async () => {
  try {
    await program.parseAsync()
  } finally {
    await knex.destroy()
  }
}

void go()
