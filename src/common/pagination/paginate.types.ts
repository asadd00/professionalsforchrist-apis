import { Prisma } from '@prisma/client';

export interface PaginateOptions<TWhere, TInclude, TOrderBy> {
  where?: TWhere;
  page?: number;
  limit?: number;
  include?: TInclude;
  orderBy?: TOrderBy;
}
