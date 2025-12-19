import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

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
        { name: 'IT' },
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
