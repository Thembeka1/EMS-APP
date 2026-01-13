const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'admin',
    },
  });

  // Create departments
  const departments = await Promise.all([
    prisma.department.upsert({
      where: { name: 'Engineering' },
      update: {},
      create: { name: 'Engineering', 
        description: 'Software development and engineering' },
    }),
    
    prisma.department.upsert({
      where: { name: 'HR' },
      update: {},
      create: { name: 'HR', 
        description: 'Human Resources' },
    }),
    prisma.department.upsert({
      where: { name: 'Marketing' },
      update: {},
      create: { name: 'Marketing', description: 'Marketing and Communications' },
    }),
  ]);

  // Create sample employees
  const employees = await Promise.all([
    prisma.employee.upsert({
      where: { email: 'john.doe@example.com' },
      update: {},
      create: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        address: '123 Main St',
        position: 'Senior Developer',
        salary: 90000,
        department: {
          connect: { id: departments[0].id }
        },
        hireDate: new Date(),
      },
    }),
    prisma.employee.upsert({
      where: { email: 'jane.smith@example.com' },
      update: {},
      create: {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '123-456-7891',
        address: '456 Oak Ave',
        position: 'HR Manager',
        salary: 85000,
        department: {
          connect: { id: departments[1].id }
        },
        hireDate: new Date(),
      },
    }),
  ]);

  console.log('Seed data created successfully!');
  console.log('Admin user created with email: admin@example.com and password: admin123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });