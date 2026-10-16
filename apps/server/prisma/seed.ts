import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { SAMPLE_STUDENT_RESUME_DOCUMENT, SEED_TEMPLATES } from '@resumeforge/shared';

const prisma = new PrismaClient();

async function main() {
  console.log('[Seed] Seeding normalized database on Neon PostgreSQL...');

  // 1. Seed Templates
  for (const tpl of SEED_TEMPLATES) {
    await prisma.template.upsert({
      where: { slug: tpl.slug },
      update: {
        name: tpl.name,
        description: tpl.description,
        category: tpl.category,
        defaultTheme: tpl.defaultTheme as any,
        isActive: tpl.isActive,
      },
      create: {
        slug: tpl.slug,
        name: tpl.name,
        description: tpl.description,
        category: tpl.category,
        version: tpl.version,
        isActive: tpl.isActive,
        isPremium: tpl.isPremium,
        defaultTheme: tpl.defaultTheme as any,
      },
    });
  }
  console.log(`[Seed] Seeded ${SEED_TEMPLATES.length} official resume templates.`);

  // 2. Seed Admin & Demo Users
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('MyRmyC2026!', salt);

  const adminEmail = 'demo@myrmyc.app';
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: UserRole.ADMIN,
      onboardingCompleted: true,
      passwordHash,
    },
    create: {
      email: adminEmail,
      passwordHash,
      role: UserRole.ADMIN,
      onboardingCompleted: true,
      emailVerifiedAt: new Date(),
    },
  });
  console.log(`[Seed] Admin user created: ${admin.email} (ID: ${admin.id})`);

  const demoUserEmail = 'alex.rivera@myrmyc.app';
  const demoUser = await prisma.user.upsert({
    where: { email: demoUserEmail },
    update: {
      role: UserRole.USER,
      onboardingCompleted: true,
      passwordHash,
    },
    create: {
      email: demoUserEmail,
      passwordHash,
      role: UserRole.USER,
      onboardingCompleted: true,
      emailVerifiedAt: new Date(),
    },
  });
  console.log(`[Seed] Demo SWE user created: ${demoUser.email} (ID: ${demoUser.id})`);

  // 3. Seed Career Profile
  await prisma.careerProfile.upsert({
    where: { userId: admin.id },
    update: {
      fullName: 'Demo Administrator',
    },
    create: {
      userId: admin.id,
      fullName: 'Demo Administrator',
      headline: 'Principal Systems Architect & Platform Engineer',
      targetRoles: ['Principal Architect', 'Staff Software Engineer', 'Engineering Lead'],
      location: 'San Francisco, CA / Remote',
      masterData: SAMPLE_STUDENT_RESUME_DOCUMENT as any,
    },
  });

  await prisma.careerProfile.upsert({
    where: { userId: demoUser.id },
    update: {
      fullName: 'Alex Rivera',
    },
    create: {
      userId: demoUser.id,
      fullName: 'Alex Rivera',
      headline: 'B.Tech CSE Undergraduate (AI & ML Specialization) | Full-Stack Developer',
      targetRoles: ['Full-Stack Developer', 'Software Engineer', 'AI/ML Systems Engineer'],
      location: 'Bengaluru, Karnataka',
      masterData: SAMPLE_STUDENT_RESUME_DOCUMENT as any,
    },
  });

  // 4. Seed Canonical Student Resume
  let sampleResume = await prisma.resume.findFirst({
    where: { userId: admin.id, isSample: true },
  });

  if (!sampleResume) {
    sampleResume = await prisma.resume.create({
      data: {
        userId: admin.id,
        title: 'Alex Rivera (Sample Profile) — AI & Full-Stack Undergrad',
        targetJobTitle: 'Full-Stack Software Engineer',
        templateSlug: 'student-fresher',
        document: SAMPLE_STUDENT_RESUME_DOCUMENT as any,
        lastAtsScore: 84,
        isPinned: true,
        isSample: true,
        versions: {
          create: {
            userId: admin.id,
            versionNumber: 1,
            label: 'Initial Seed Baseline',
            documentSnapshot: SAMPLE_STUDENT_RESUME_DOCUMENT as any,
            atsScoreSnapshot: 84,
          },
        },
        applications: {
          create: {
            userId: admin.id,
            company: 'Cisco Systems',
            roleTitle: 'Software Engineering Intern',
            location: 'Bengaluru / Hybrid',
            status: 'INTERVIEWING',
            salaryRange: '₹45,000 / month',
            appliedDate: new Date('2026-09-15'),
            nextFollowUpDate: new Date('2026-10-20'),
            notes: 'Completed technical coding round. Preparing for systems & architecture interview.',
          },
        },
      },
    });
    console.log(`[Seed] Seeded sample resume: "${sampleResume.title}" (ID: ${sampleResume.id})`);
  } else {
    console.log(`[Seed] Sample resume already exists: "${sampleResume.title}" (ID: ${sampleResume.id})`);
  }

  // 5. Seed Additional Saved Job
  const existingJob = await prisma.savedJob.findFirst({
    where: { userId: admin.id, company: 'Google' },
  });
  if (!existingJob) {
    await prisma.savedJob.create({
      data: {
        userId: admin.id,
        company: 'Google',
        roleTitle: 'Associate Software Engineer (Campus 2028)',
        location: 'Bengaluru, Karnataka',
        jobUrl: 'https://careers.google.com/jobs/sample',
        tags: ['New Grad', 'Distributed Systems', 'C++', 'Go'],
        priority: 3,
        rawSnippet: 'Seeking undergraduate students graduating in 2028 with strong knowledge of Data Structures, Algorithms, and System Design.',
      },
    });
  }

  // 6. Seed Notification
  const existingNotice = await prisma.notification.findFirst({
    where: { userId: admin.id, title: { contains: 'Welcome' } },
  });
  if (!existingNotice) {
    await prisma.notification.create({
      data: {
        userId: admin.id,
        title: 'Welcome to myRmyC',
        message: 'Your production-grade workspace is connected to Neon Cloud PostgreSQL. All 6 templates and ATS diagnostic engines are ready.',
        type: 'SUCCESS',
        actionUrl: '/app/dashboard',
      },
    });
  }

  console.log('[Seed] Database seeding completed successfully.');
}

main()
  .catch((err) => {
    console.error('[Seed] Error during seeding:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
