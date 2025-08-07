import { PrismaClient, CourseLevel, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  const defaultPassword = await bcrypt.hash("password123", 10);

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "john.doe@example.com" },
      update: { password: defaultPassword },
      create: {
        name: "John Doe",
        email: "john.doe@example.com",
        password: defaultPassword,
      },
    }),
    prisma.user.upsert({
      where: { email: "jane.smith@example.com" },
      update: { password: defaultPassword },
      create: {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        password: defaultPassword,
      },
    }),
    prisma.user.upsert({
      where: { email: "prof.wilson@example.com" },
      update: { password: defaultPassword },
      create: {
        name: "Prof Wilson",
        email: "prof.wilson@example.com",
        password: defaultPassword,
      },
    }),
    prisma.user.upsert({
      where: { email: "sarah.jones@example.com" },
      update: { password: defaultPassword },
      create: {
        name: "Sarah Jones",
        email: "sarah.jones@example.com",
        password: defaultPassword,
      },
    }),
    prisma.user.upsert({
      where: { email: "mike.brown@example.com" },
      update: { password: defaultPassword },
      create: {
        name: "Mike Brown",
        email: "mike.brown@example.com",
        password: defaultPassword,
      },
    }),
  ]);

  console.log("Users created:", users.length);

  const courses = await Promise.all([
    prisma.course.upsert({
      where: { id: "course-1" },
      update: {},
      create: {
        id: "course-1",
        title: "Introduction to JavaScript",
        description:
          "Learn the fundamentals of JavaScript programming language. This course covers variables, functions, objects, and basic DOM manipulation.",
        level: CourseLevel.BEGINNER,
      },
    }),
    prisma.course.upsert({
      where: { id: "course-2" },
      update: {},
      create: {
        id: "course-2",
        title: "React Fundamentals",
        description:
          "Master the basics of React including components, props, state, and hooks. Build your first interactive web applications.",
        level: CourseLevel.INTERMEDIATE,
      },
    }),
    prisma.course.upsert({
      where: { id: "course-3" },
      update: {},
      create: {
        id: "course-3",
        title: "Advanced Node.js",
        description:
          "Deep dive into Node.js backend development with Express, databases, authentication, and deployment strategies.",
        level: CourseLevel.ADVANCED,
      },
    }),
    prisma.course.upsert({
      where: { id: "course-4" },
      update: {},
      create: {
        id: "course-4",
        title: "CSS for Beginners",
        description:
          "Learn styling with CSS from scratch. Covers selectors, box model, flexbox, grid, and responsive design principles.",
        level: CourseLevel.BEGINNER,
      },
    }),
    prisma.course.upsert({
      where: { id: "course-5" },
      update: {},
      create: {
        id: "course-5",
        title: "Python Data Science",
        description:
          "Introduction to data science with Python. Learn pandas, numpy, matplotlib, and basic machine learning concepts.",
        level: CourseLevel.INTERMEDIATE,
      },
    }),
    prisma.course.upsert({
      where: { id: "course-6" },
      update: {},
      create: {
        id: "course-6",
        title: "TypeScript Masterclass",
        description:
          "Advanced TypeScript concepts including generics, decorators, advanced types, and integration with popular frameworks.",
        level: CourseLevel.ADVANCED,
      },
    }),
  ]);

  console.log("Courses created:", courses.length);

  const enrollments = await Promise.all([
    prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: users[0].id,
          courseId: courses[0].id,
        },
      },
      update: {},
      create: {
        userId: users[0].id,
        courseId: courses[0].id,
        role: UserRole.STUDENT,
      },
    }),
    prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: users[0].id,
          courseId: courses[1].id,
        },
      },
      update: {},
      create: {
        userId: users[0].id,
        courseId: courses[1].id,
        role: UserRole.STUDENT,
      },
    }),
    prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: users[1].id,
          courseId: courses[0].id,
        },
      },
      update: {},
      create: {
        userId: users[1].id,
        courseId: courses[0].id,
        role: UserRole.STUDENT,
      },
    }),
    prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: users[1].id,
          courseId: courses[4].id,
        },
      },
      update: {},
      create: {
        userId: users[1].id,
        courseId: courses[4].id,
        role: UserRole.STUDENT,
      },
    }),
    prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: users[2].id,
          courseId: courses[0].id,
        },
      },
      update: {},
      create: {
        userId: users[2].id,
        courseId: courses[0].id,
        role: UserRole.PROFESSOR,
      },
    }),
    prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: users[2].id,
          courseId: courses[2].id,
        },
      },
      update: {},
      create: {
        userId: users[2].id,
        courseId: courses[2].id,
        role: UserRole.PROFESSOR,
      },
    }),
    prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: users[3].id,
          courseId: courses[3].id,
        },
      },
      update: {},
      create: {
        userId: users[3].id,
        courseId: courses[3].id,
        role: UserRole.STUDENT,
      },
    }),
    prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: users[4].id,
          courseId: courses[4].id,
        },
      },
      update: {},
      create: {
        userId: users[4].id,
        courseId: courses[4].id,
        role: UserRole.PROFESSOR,
      },
    }),
    prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: users[4].id,
          courseId: courses[5].id,
        },
      },
      update: {},
      create: {
        userId: users[4].id,
        courseId: courses[5].id,
        role: UserRole.PROFESSOR,
      },
    }),
  ]);

  console.log("Enrollments created:", enrollments.length);
  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
