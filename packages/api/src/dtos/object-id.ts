export type FlattenId<T, objectIdKey extends string = '_id'> = Omit<
  T,
  objectIdKey
> & {
  [K in objectIdKey]: string
}
