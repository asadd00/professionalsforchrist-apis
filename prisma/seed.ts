import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {

    /**
     * admin user
     */

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminEmail && adminPassword) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        await prisma.user.upsert({
            where: {
                email_loginType: {
                    email: adminEmail,
                    loginType: 'email',
                },
            },
            update: {
                password: hashedPassword,
                role: 'admin',
                isActive: true,
            },
            create: {
                name: 'Admin',
                email: adminEmail,
                password: hashedPassword,
                loginType: 'email',
                role: 'admin',
                isActive: true,
            },
        });

        console.log('Admin user seed completed');
    } else {
        console.log('Skipping admin user seed: ADMIN_EMAIL / ADMIN_PASSWORD not set');
    }

    /**
     * education
     */
    const educations = [
        { name: 'Under Matric / Middle' },
        { name: 'Matriculation' },
        { name: 'Intermediate' },
        { name: 'Bachelors' },
        { name: 'Masters' },
        { name: 'M Phil' },
        { name: 'PhD' },
        { name: 'Diploma / Certification' },
        { name: 'No education' },
    ];

    for (const edu of educations) {
        await prisma.education.upsert({
            where: { name: edu.name },
            update: {},
            create: {
                name: edu.name,
            },
        });
    }

    console.log('Education seed completed');

    /**
     * industry
     */

    const industries = [
        { name: 'Accounting' },
        { name: 'Advertising and Marketing' },
        { name: 'Aerospace' },
        { name: 'Agriculture' },
        { name: 'Computer and Technology (including IT and Software)' },
        { name: 'Construction' },
        { name: 'Education and Training' },
        { name: 'Energy (including Renewables and Oil & Gas)' },
        { name: 'Engineering' },
        { name: 'Entertainment and Media' },
        { name: 'Fashion' },
        { name: 'Finance and Economics (including Banking and Insurance)' },
        { name: 'Food and Beverage' },
        { name: 'Government and Public Service' },
        { name: 'Healthcare and Social Assistance' },
        { name: 'Hospitality and Tourism' },
        { name: 'Legal' },
        { name: 'Manufacturing' },
        { name: 'Pharmaceutical and Biotechnology' },
        { name: 'Transportation and Logistics' },
        { name: 'Other' },
    ];

    for (const industry of industries) {
        await prisma.industry.upsert({
            where: { name: industry.name },
            update: {},
            create: {
                name: industry.name,
            },
        });
    }

    console.log('Industry seed completed');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
