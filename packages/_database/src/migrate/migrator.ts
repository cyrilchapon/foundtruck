import { Command } from '@commander-js/extra-typings'
import { mgmtEnv } from '../env/mgmt-env'
import { createMongo } from '../mongo'
import { createUmzug } from './umzug'

const mongo = createMongo(mgmtEnv)
const umzug = createUmzug(mongo, 'migration')

const program = new Command()
program.name('mig').description('Perform database migrations powered by Umzug')

program
  .command('create')
  .description('Create a new migration')
  .argument('<name>', 'name of migration to create')
  .action(async (name) => {
    const nameWithExtension = name.endsWith('.ts') ? name : `${name}.ts`
    const nameWithTimestamp = `${Date.now()}-${nameWithExtension}`

    await umzug.create({
      name: nameWithTimestamp,
      prefix: 'NONE',
      allowExtension: '.ts',
      allowConfusingOrdering: false,
      skipVerify: false,
    })
  })

program
  .command('up')
  .description('Execute pending migrations')
  .option('--one', 'just execute next migration')
  .action(async (options) => {
    await umzug.up(!!options.one ? { step: 1 } : undefined)
  })

program
  .command('down')
  .description('Revert executed migrations')
  .option('--one', 'just revert previous migration')
  .action(async (options) => {
    await umzug.down(!!options.one ? undefined : { to: 0 })
  })

const go = async () => {
  try {
    await program.parseAsync()
  } finally {
    await mongo.close()
  }
}

void go()
