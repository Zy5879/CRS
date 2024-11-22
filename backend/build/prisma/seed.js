"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        //   // Insert mock customers
        yield prisma.customer.createMany({
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
        yield prisma.vehicles.createMany({
            data: [
                {
                    make: "Toyota",
                    model: "Corolla",
                    year: 2021,
                    transmission: client_1.Transmission.AUTOMATIC,
                    pricePerDay: 100.0,
                    state: "North Carolina",
                    city: "Durham",
                    maintenance: client_1.Maintenance.IN_SERVICE,
                },
                {
                    make: "Honda",
                    model: "Civic",
                    year: 2022,
                    transmission: client_1.Transmission.MANUAL,
                    pricePerDay: 120.0,
                    state: "New York",
                    city: "New York City",
                    maintenance: client_1.Maintenance.OUT_OF_SERVICE,
                },
                {
                    make: "Acura",
                    model: "Integra",
                    year: 2016,
                    transmission: client_1.Transmission.AUTOMATIC,
                    pricePerDay: 80.0,
                    state: "Arizona",
                    city: "Phoenix",
                    maintenance: client_1.Maintenance.OUT_OF_SERVICE,
                },
                {
                    make: "Mercedes-Benz",
                    model: "E350",
                    year: 2024,
                    transmission: client_1.Transmission.AUTOMATIC,
                    pricePerDay: 140.0,
                    state: "California",
                    city: "Los Angeles",
                    maintenance: client_1.Maintenance.OUT_OF_SERVICE,
                },
                {
                    make: "Kia",
                    model: "K5",
                    year: 2024,
                    transmission: client_1.Transmission.MANUAL,
                    pricePerDay: 120.0,
                    state: "Colorado",
                    city: "Denver",
                    maintenance: client_1.Maintenance.OUT_OF_SERVICE,
                },
                {
                    make: "Dodge",
                    model: "Charger",
                    year: 2020,
                    transmission: client_1.Transmission.AUTOMATIC,
                    pricePerDay: 130.0,
                    state: "Illinois",
                    city: "Chicago",
                    maintenance: client_1.Maintenance.OUT_OF_SERVICE,
                },
                {
                    make: "Kia",
                    model: "Optima",
                    year: 2019,
                    transmission: client_1.Transmission.AUTOMATIC,
                    pricePerDay: 120.0,
                    state: "Wisconsin",
                    city: "Milwuakee",
                    maintenance: client_1.Maintenance.IN_SERVICE,
                },
                {
                    make: "Ford",
                    model: "Bronco",
                    year: 2021,
                    transmission: client_1.Transmission.AUTOMATIC,
                    pricePerDay: 130.0,
                    state: "Oregon",
                    city: "Portland",
                    maintenance: client_1.Maintenance.IN_SERVICE,
                },
                {
                    make: "Chevrolet",
                    model: "Trailblazer",
                    year: 2023,
                    transmission: client_1.Transmission.AUTOMATIC,
                    pricePerDay: 120.0,
                    state: "Florida",
                    city: "Miami",
                    maintenance: client_1.Maintenance.OUT_OF_SERVICE,
                },
                {
                    make: "Chevrolet",
                    model: "Stingray",
                    year: 2024,
                    transmission: client_1.Transmission.AUTOMATIC,
                    pricePerDay: 140.0,
                    state: "California",
                    city: "Oakland",
                    maintenance: client_1.Maintenance.OUT_OF_SERVICE,
                },
            ],
        });
        //   // Insert mock employees
        yield prisma.employee.createMany({
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
                    role: client_1.Role.ADMIN,
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
                    role: client_1.Role.STAFF,
                },
            ],
        });
    });
}
main()
    .catch((e) => {
    console.error(e);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
