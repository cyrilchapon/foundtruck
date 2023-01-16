export type WithoutTimestamps<
  T extends Record<string, unknown>,
  CreatedAt extends keyof T = 'created_at',
  UpdatedAt extends keyof T = 'updated_at',
> = Omit<T, CreatedAt | UpdatedAt>

export type PartialTimestamps<
  T extends Record<string, unknown>,
  CreatedAt extends keyof T = 'created_at',
  UpdatedAt extends keyof T = 'updated_at',
> = WithoutTimestamps<T, CreatedAt, UpdatedAt> & Partial<Pick<T, CreatedAt | UpdatedAt>>

export type WithoutId<
  T extends Record<string, unknown>,
  Id extends keyof T = 'id',
> = Omit<T, Id>

export type PartialId<
  T extends Record<string, unknown>,
  Id extends keyof T = 'id',
> = WithoutId<T, Id> & Partial<Pick<T, Id>>

export type BaseInsert<
  T extends Record<string, unknown>,
  Id extends keyof T = 'id',
  CreatedAt extends keyof T = 'created_at',
  UpdatedAt extends keyof T = 'updated_at',
> = Omit<T, Id | CreatedAt | UpdatedAt>

export type BaseInsertWithId<
  T extends Record<string, unknown>,
  CreatedAt extends keyof T = 'created_at',
  UpdatedAt extends keyof T = 'updated_at',
> = Omit<T, CreatedAt | UpdatedAt>

export type BaseUpdate<
  T extends Record<string, unknown>,
  Id extends keyof T = 'id',
  CreatedAt extends keyof T = 'created_at',
  UpdatedAt extends keyof T = 'updated_at',
> = Partial<BaseInsert<T, Id, CreatedAt, UpdatedAt>>
