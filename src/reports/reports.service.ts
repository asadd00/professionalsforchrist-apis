import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { PrismaService } from '../prisma/prisma.service';
import { ExportUsersQueryDto } from './dto/export-users-query.dto';
import { ExportProfessionalsQueryDto } from './dto/export-professionals-query.dto';
import { ExportBusinessesQueryDto } from './dto/export-businesses-query.dto';

// key = what the admin UI's column-selection checkboxes send. Covers every column on the
// Professional model (see prisma/schema.prisma) except `deletedAt` (the query already filters
// `deletedAt: null`, so it's always empty here) — FK columns (`lastEducationId`/`industryId`)
// are resolved to their looked-up name rather than exported as a raw id, matching
// ViewProfessionalSheet's "Last education"/"Industry" fields in the admin UI.
const PROFESSIONAL_COLUMNS: Record<string, { header: string; width: number; accessor: (p: any) => unknown }> = {
  id: { header: 'ID', width: 8, accessor: (p) => p.id },
  isVerified: { header: 'Verified', width: 10, accessor: (p) => p.isVerified },
  name: { header: 'Name', width: 24, accessor: (p) => p.name },
  email: { header: 'Email', width: 26, accessor: (p) => p.email },
  contactNumber: { header: 'Contact Number', width: 18, accessor: (p) => p.contactNumber },
  shouldNumberVisible: { header: 'Number Visible In Search', width: 14, accessor: (p) => p.shouldNumberVisible },
  gender: { header: 'Gender', width: 10, accessor: (p) => p.gender },
  dateOfBirth: { header: 'Date of Birth', width: 16, accessor: (p) => p.dateOfBirth },
  churchName: { header: 'Church Name', width: 24, accessor: (p) => p.churchName },
  churchArea: { header: 'Church Area', width: 20, accessor: (p) => p.churchArea },
  city: { header: 'City', width: 16, accessor: (p) => p.city },
  lastEducation: { header: 'Last Education', width: 20, accessor: (p) => p.education?.name },
  lastDegreeName: { header: 'Last Degree Name', width: 22, accessor: (p) => p.lastDegreeName },
  lastInstituteAttended: { header: 'Last Institute Attended', width: 26, accessor: (p) => p.lastInstituteAttended },
  isEmployed: { header: 'Employed', width: 10, accessor: (p) => p.isEmployed },
  occupation: { header: 'Occupation', width: 20, accessor: (p) => p.occupation },
  industry: { header: 'Industry', width: 20, accessor: (p) => p.industry?.name ?? p.otherIndustry },
  otherIndustry: { header: 'Other Industry', width: 20, accessor: (p) => p.otherIndustry },
  jobTitle: { header: 'Job Title', width: 20, accessor: (p) => p.jobTitle },
  companyName: { header: 'Company Name', width: 24, accessor: (p) => p.employer },
  yearsOfExperience: { header: 'Experience (years)', width: 16, accessor: (p) => p.yearsOfExperience },
  lastEmployer1: { header: 'Previous Employer 1', width: 22, accessor: (p) => p.lastEmployer1 },
  lastEmployer2: { header: 'Previous Employer 2', width: 22, accessor: (p) => p.lastEmployer2 },
  lastEmployer3: { header: 'Previous Employer 3', width: 22, accessor: (p) => p.lastEmployer3 },
  residentialArea: { header: 'Residential Area', width: 20, accessor: (p) => p.residentialArea },
  linkedInUrl: { header: 'LinkedIn URL', width: 30, accessor: (p) => p.linkedInUrl },
  notes: { header: 'Notes', width: 30, accessor: (p) => p.notes },
  createdById: { header: 'Created By (User ID)', width: 14, accessor: (p) => p.createdById },
  createdAt: { header: 'Created At', width: 22, accessor: (p) => p.createdAt },
  updatedAt: { header: 'Updated At', width: 22, accessor: (p) => p.updatedAt },
};

// Same idea as PROFESSIONAL_COLUMNS above, covering every column on the Business model.
const BUSINESS_COLUMNS: Record<string, { header: string; width: number; accessor: (b: any) => unknown }> = {
  id: { header: 'ID', width: 8, accessor: (b) => b.id },
  isVerified: { header: 'Verified', width: 10, accessor: (b) => b.isVerified },
  registerFor: { header: 'Register For', width: 14, accessor: (b) => b.registerFor },
  ownerName: { header: 'Owner Name', width: 24, accessor: (b) => b.ownerName },
  businessType: { header: 'Business Type', width: 20, accessor: (b) => b.businessType },
  yearsOfExperience: { header: 'Experience (years)', width: 16, accessor: (b) => b.yearsOfExperience },
  dateOfBirth: { header: 'Date of Birth', width: 16, accessor: (b) => b.dateOfBirth },
  email: { header: 'Email', width: 26, accessor: (b) => b.email },
  contactNumber: { header: 'Contact Number', width: 18, accessor: (b) => b.contactNumber },
  city: { header: 'City', width: 16, accessor: (b) => b.city },
  residentialArea: { header: 'Residential Area', width: 20, accessor: (b) => b.residentialArea },
  website: { header: 'Website', width: 26, accessor: (b) => b.website },
  fbPage: { header: 'Facebook Page', width: 26, accessor: (b) => b.fbPage },
  instaPage: { header: 'Instagram Page', width: 26, accessor: (b) => b.instaPage },
  linkedInUrl: { header: 'LinkedIn URL', width: 30, accessor: (b) => b.linkedInUrl },
  notes: { header: 'Notes', width: 30, accessor: (b) => b.notes },
  createdById: { header: 'Created By (User ID)', width: 14, accessor: (b) => b.createdById },
  createdAt: { header: 'Created At', width: 22, accessor: (b) => b.createdAt },
  updatedAt: { header: 'Updated At', width: 22, accessor: (b) => b.updatedAt },
};

// Distinct-value lookups back the admin Reports page's filter dropdowns — every option shown is
// a real value already present in the table, not a hand-maintained list that can drift. Takes the
// Prisma model delegate itself (not a detached method reference) so `findMany` keeps its `this`.
const distinctStringValues = async (model: { findMany: (args: any) => Promise<any[]> }, field: string): Promise<string[]> => {
  const rows = await model.findMany({
    distinct: [field],
    select: { [field]: true },
    where: { deletedAt: null, [field]: { not: '' } },
    orderBy: { [field]: 'asc' },
  });
  return rows.map((r) => r[field]);
};

// Shared by all three exports' `createdAt` range filter — `to` is inclusive through end-of-day
// rather than midnight, so picking the same date for `from`/`to` still includes that whole day.
const createdAtRange = (from?: string, to?: string): { createdAt: { gte?: Date; lte?: Date } } | Record<string, never> => {
  if (!from && !to) return {};

  const createdAt: { gte?: Date; lte?: Date } = {};
  if (from) createdAt.gte = new Date(from);
  if (to) {
    const endOfDay = new Date(to);
    endOfDay.setHours(23, 59, 59, 999);
    createdAt.lte = endOfDay;
  }
  return { createdAt };
};

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async exportUsersToExcel(query: ExportUsersQueryDto): Promise<Buffer> {
    const { from, to } = query;

    const users = await this.prisma.user.findMany({
      where: {
        ...createdAtRange(from, to),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        loginType: true,
        appPlatform: true,
        appVersion: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Users');

    sheet.columns = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'Name', key: 'name', width: 24 },
      { header: 'Email', key: 'email', width: 28 },
      { header: 'Phone', key: 'phone', width: 16 },
      { header: 'Role', key: 'role', width: 10 },
      { header: 'Active', key: 'isActive', width: 10 },
      { header: 'Login Type', key: 'loginType', width: 12 },
      { header: 'Platform', key: 'appPlatform', width: 12 },
      { header: 'App Version', key: 'appVersion', width: 12 },
      { header: 'Registered At', key: 'createdAt', width: 22 },
    ];

    for (const user of users) {
      sheet.addRow(user);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  async exportProfessionalsToExcel(query: ExportProfessionalsQueryDto): Promise<Buffer> {
    const { from, to, city, industryId, lastEducationId, yearsOfExperience, q, churchName, residentialArea, columns } = query;

    // Only spread the `q` OR-clause when `q` is actually present — an unconditional OR with
    // `contains: undefined` in every branch matches zero rows instead of "no filter" (see
    // ProfessionalService.findAll / backend CLAUDE.md for the same gotcha).
    // city/yearsOfExperience/churchName/residentialArea are picked from dropdowns of exact
    // distinct values (see getProfessionalFilterOptions) — exact match, not `contains`.
    const professionals = await this.prisma.professional.findMany({
      where: {
        deletedAt: null,
        ...createdAtRange(from, to),
        ...(city && { city }),
        ...(industryId && { industryId }),
        ...(lastEducationId && { lastEducationId }),
        ...(yearsOfExperience && { yearsOfExperience }),
        ...(churchName && { churchName }),
        ...(residentialArea && { residentialArea }),
        ...(q && {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { occupation: { contains: q, mode: 'insensitive' } },
            { jobTitle: { contains: q, mode: 'insensitive' } },
            { employer: { contains: q, mode: 'insensitive' } },
          ],
        }),
      },
      include: { industry: true, education: true },
      orderBy: { createdAt: 'desc' },
    });

    const selectedKeys = columns && columns.length > 0 ? columns.filter((key) => key in PROFESSIONAL_COLUMNS) : Object.keys(PROFESSIONAL_COLUMNS);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Professionals');

    sheet.columns = selectedKeys.map((key) => ({
      header: PROFESSIONAL_COLUMNS[key].header,
      key,
      width: PROFESSIONAL_COLUMNS[key].width,
    }));

    for (const professional of professionals) {
      const row: Record<string, unknown> = {};
      for (const key of selectedKeys) {
        row[key] = PROFESSIONAL_COLUMNS[key].accessor(professional);
      }
      sheet.addRow(row);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  async exportBusinessesToExcel(query: ExportBusinessesQueryDto): Promise<Buffer> {
    const { from, to, city, businessType, yearsOfExperience, q, residentialArea, columns } = query;

    // Same conditional-OR-only-when-q-present and exact-match-on-dropdown-fields rules as
    // exportProfessionalsToExcel above.
    const businesses = await this.prisma.business.findMany({
      where: {
        deletedAt: null,
        ...createdAtRange(from, to),
        ...(city && { city }),
        ...(businessType && { businessType }),
        ...(yearsOfExperience && { yearsOfExperience }),
        ...(residentialArea && { residentialArea }),
        ...(q && {
          OR: [
            { ownerName: { contains: q, mode: 'insensitive' } },
            { businessType: { contains: q, mode: 'insensitive' } },
            { residentialArea: { contains: q, mode: 'insensitive' } },
          ],
        }),
      },
      orderBy: { createdAt: 'desc' },
    });

    const selectedKeys = columns && columns.length > 0 ? columns.filter((key) => key in BUSINESS_COLUMNS) : Object.keys(BUSINESS_COLUMNS);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Businesses');

    sheet.columns = selectedKeys.map((key) => ({
      header: BUSINESS_COLUMNS[key].header,
      key,
      width: BUSINESS_COLUMNS[key].width,
    }));

    for (const business of businesses) {
      const row: Record<string, unknown> = {};
      for (const key of selectedKeys) {
        row[key] = BUSINESS_COLUMNS[key].accessor(business);
      }
      sheet.addRow(row);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  async getProfessionalFilterOptions() {
    const [cities, churchNames, residentialAreas, yearsOfExperience] = await Promise.all([
      distinctStringValues(this.prisma.professional, 'city'),
      distinctStringValues(this.prisma.professional, 'churchName'),
      distinctStringValues(this.prisma.professional, 'residentialArea'),
      distinctStringValues(this.prisma.professional, 'yearsOfExperience'),
    ]);

    return { cities, churchNames, residentialAreas, yearsOfExperience };
  }

  async getBusinessFilterOptions() {
    const [cities, businessTypes, residentialAreas, yearsOfExperience] = await Promise.all([
      distinctStringValues(this.prisma.business, 'city'),
      distinctStringValues(this.prisma.business, 'businessType'),
      distinctStringValues(this.prisma.business, 'residentialArea'),
      distinctStringValues(this.prisma.business, 'yearsOfExperience'),
    ]);

    return { cities, businessTypes, residentialAreas, yearsOfExperience };
  }
}
