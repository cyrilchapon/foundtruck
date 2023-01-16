import { Knex } from 'knex'
import type { UmzugStorage, MigrationParams } from 'umzug'

export type KnexStorageOptions = {
  tableName?: string
  schemaName?: string
  knex: Knex
}

type Migration = {
  name: string
}

export class KnexStorage implements UmzugStorage {
	public readonly tableName: string;
  public readonly schemaName?: string;
	public readonly knex: Knex;

  constructor(options: KnexStorageOptions) {
    this.tableName = options.tableName || 'migrations'
    this.schemaName = options.schemaName
    this.knex = options.knex
  }

  async logMigration (params: MigrationParams<unknown>) {
    const queryBuilder = this._getQueryBuilder()
    await queryBuilder
      .insert({
        name: params.name
      }, '*')
  }

  async unlogMigration (params: MigrationParams<unknown>) {
    const queryBuilder = this._getQueryBuilder()
    await queryBuilder
    .where({
      name: params.name
    })
    .delete()
  }

  async executed () {
    await this.createTable()

    const queryBuilder = this._getQueryBuilder()
    const migrations = await queryBuilder
      .select()

    const migrationNames = migrations.map(m => m.name)

    return migrationNames
  }

  async createTable () {
    await this._createSchema()

    if (!(await this._tableExists())) {
      await this._createTable()
    }
  }

  async _createTable () {
    const schemaBuilder = this._getSchemaBuilder()

    await schemaBuilder.createTable(this.tableName, (tableBuilder) => {
      tableBuilder.string('name')
      tableBuilder.primary(['name'])
    })
  }

  async _createSchema () {
    if (this.schemaName != null) {
      return this.knex.schema.createSchemaIfNotExists(this.schemaName)
    }
  }

  async _tableExists () {
    const schemaBuilder = this._getSchemaBuilder()

    return await schemaBuilder.hasTable(this.tableName)
  }

  _getQueryBuilder () {
    return (
      this.schemaName != null
        ? this.knex<Migration>(this.tableName).withSchema(this.schemaName)
        : this.knex<Migration>(this.tableName)
    )
  }

  _getSchemaBuilder () {
    return (
      this.schemaName != null
        ? this.knex.schema.withSchema(this.schemaName)
        : this.knex.schema
    )
  }
}
