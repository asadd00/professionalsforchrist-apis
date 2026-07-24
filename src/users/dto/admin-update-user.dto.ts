import { IsBoolean, IsEnum, IsOptional } from "class-validator";
import { UserRole } from "@prisma/client";
import { UpdateUserDto } from "./update-user.dto";

/**
 * Admin-only extension of UpdateUserDto — isActive/role must never be reachable from
 * PATCH /users (self-update, JwtAuthGuard only), or any user could self-promote to admin
 * or reactivate a deactivated account. Only PATCH /users/:id (AdminAuthGuard) uses this.
 */
export class AdminUpdateUserDto extends UpdateUserDto {
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;
}
