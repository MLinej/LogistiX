import prisma from '../src/config/db.js'
import bcrypt from 'bcryptjs'

async function main() {
    const passwordHash = await bcrypt.hash('password123', 10)

    // Create User
    const user = await prisma.user.upsert({
        where: { email: 'admin@fleetflow.com' },
        update: {},
        create: {
            email: 'admin@fleetflow.com',
            name: 'Admin User',
            password_hash: passwordHash,
            role: 'manager',
        },
    })

    console.log('Seed: Created user', user.email)

    // Create Vehicles
    const vehicles = [
        { vehicle_number: "MH-12-AB-1234", model: "Tata Prima 4928.S", capacity_kg: 28000, odometer: 142300, last_service_km: 140000, state_code: "MH", rto_code: "12", status: "On_Trip" },
        { vehicle_number: "MH-14-CD-5678", model: "Ashok Leyland 4220", capacity_kg: 22000, odometer: 98500, last_service_km: 95000, state_code: "MH", rto_code: "14", status: "Available" },
    ]

    for (const v of vehicles) {
        await prisma.vehicle.upsert({
            where: { vehicle_number: v.vehicle_number },
            update: {},
            create: v,
        })
    }

    // Create Drivers
    const drivers = [
        { name: "Rajesh Kumar", license_number: "MH1220200001234", status: "On_Trip", safety_score: 92 },
        { name: "Vikram Singh", license_number: "GJ0120190005678", status: "On_Trip", safety_score: 87 },
    ]

    for (const d of drivers) {
        await prisma.driver.upsert({
            where: { license_number: d.license_number },
            update: {},
            create: d,
        })
    }

    console.log('Seed finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
