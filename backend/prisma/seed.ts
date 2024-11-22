 import { PrismaClient, Transmission, Maintenance, Role } from "@prisma/client";
 const prisma = new PrismaClient();

 async function main() {
//   // Insert mock customers
   await prisma.customer.createMany({
     data: [
       {
         name: "John Doe",
         email: "john.doe@example.com",
         password: "password123",
         dob: new Date("1990-01-01"),
         phone: "123-456-7890",
         state: "North Carolina",
         city: "Raleigh",
         driversLicense: "D1234567",
         createdAt: new Date(),
       },
       {
         name: "Jane Smith",
         email: "jane.smith@example.com",
         password: "password456",
         dob: new Date("1992-05-10"),
         phone: "098-765-4321",
         state: "New York",
         city: "Bronx",
         driversLicense: "S9876543",
         createdAt: new Date(),
       },
     ],
   });

//   // Insert mock vehicles
   await prisma.vehicles.createMany({
     data: [
       {
         make: "Toyota",
         model: "Corolla",
         year: 2021,
         transmission: Transmission.AUTOMATIC,
         pricePerDay: 100.0,
         state: "North Carolina",
         city: "Durham",
         maintenance: Maintenance.IN_SERVICE,
       },
       {
         make: "Honda",
         model: "Civic",
         year: 2022,
         transmission: Transmission.MANUAL,
         pricePerDay: 120.0,
         state: "New York",
         city: "New York City",
         maintenance: Maintenance.OUT_OF_SERVICE,
       },
       {
        make: "Acura",
        model: "Integra",
        year: 2016,
        transmission: Transmission.AUTOMATIC,
        pricePerDay: 80.0,
        state: "Arizona",
        city: "Phoenix",
        maintenance: Maintenance.OUT_OF_SERVICE,
      },
      {
        make: "Mercedes-Benz",
        model: "E350",
        year: 2024,
        transmission: Transmission.AUTOMATIC,
        pricePerDay: 140.0,
        state: "California",
        city: "Los Angeles",
        maintenance: Maintenance.OUT_OF_SERVICE,
      },
      {
        make: "Kia",
        model: "K5",
        year: 2024,
        transmission: Transmission.MANUAL,
        pricePerDay: 120.0,
        state: "Colorado",
        city: "Denver",
        maintenance: Maintenance.OUT_OF_SERVICE,
      },
      {
        make: "Dodge",
        model: "Charger",
        year: 2020,
        transmission: Transmission.AUTOMATIC,
        pricePerDay: 130.0,
        state: "Illinois",
        city: "Chicago",
        maintenance: Maintenance.OUT_OF_SERVICE,
      },
      {
        make: "Kia",
        model: "Optima",
        year: 2019,
        transmission: Transmission.AUTOMATIC,
        pricePerDay: 120.0,
        state: "Wisconsin",
        city: "Milwuakee",
        maintenance: Maintenance.IN_SERVICE,
      },
      {
        make: "Ford",
        model: "Bronco",
        year: 2021,
        transmission: Transmission.AUTOMATIC,
        pricePerDay: 130.0,
        state: "Oregon",
        city: "Portland",
        maintenance: Maintenance.IN_SERVICE,
      },
      {
        make: "Chevrolet",
        model: "Trailblazer",
        year: 2023,
        transmission: Transmission.AUTOMATIC,
        pricePerDay: 120.0,
        state: "Florida",
        city: "Miami",
        maintenance: Maintenance.OUT_OF_SERVICE,
      },
      {
        make: "Chevrolet",
        model: "Stingray",
        year: 2024,
        transmission: Transmission.AUTOMATIC,
        pricePerDay: 140.0,
        state: "California",
        city: "Oakland",
        maintenance: Maintenance.OUT_OF_SERVICE,
      },
     ],
     
   });

//   // Insert mock employees
   await prisma.employee.createMany({
     data: [
       {
         name: "Alice Johnson",
         password: "alicepassword",
         email: "alice.johnson@example.com",
         dob: new Date("1985-08-15"),
         phone: "111-222-3333",
         state: "South Carolina",
         city: "Columbia",
         createdAt: new Date(),
         role: Role.ADMIN,
       },
       {
         name: "Bob Williams",
         password: "bobpassword",
         email: "bob.williams@example.com",
         dob: new Date("1988-03-25"),
         phone: "444-555-6666",
         state: "Washington",
         city: "Seattle",
         createdAt: new Date(),
         role: Role.STAFF,
       },
     ],
   });
 }

 main()
   .catch((e) => {
     console.error(e);
   })
   .finally(async () => {
     await prisma.$disconnect();
   });
