import { PaginateOptions } from './paginate.types';

export async function paginate<
  TModel,
  TWhere,
  TInclude,
  TOrderBy,
>(
  model: {
    findMany: (args: any) => Promise<TModel[]>;
    count: (args: any) => Promise<number>;
  },
  options: PaginateOptions<TWhere, TInclude, TOrderBy>,
): Promise<{ data: TModel[]; meta: any }> {
  const {
    where = {},
    page = 1,
    limit = 10,
    include,
    orderBy,
  } = options;

  const take = Math.min(limit, 100);
  const skip = (page - 1) * take;

  const [data, total] = await Promise.all([
    model.findMany({
      where,
      skip,
      take,
      include,
      orderBy,
    }),
    model.count({ where }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit: take,
      totalPages: Math.ceil(total / take),
    },
  };
}
