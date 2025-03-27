import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;


export async function GET() {
  const users = await prisma.user.findMany();  // ดึงข้อมูลทั้งหมดจากตาราง `user`
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const { name, email } = await request.json(); // รับข้อมูลจาก body ของ POST request

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
    },
  });

  return NextResponse.json(newUser);
}

export async function PUT(request: Request) {
  const { id, name, email } = await request.json();

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { name, email },
  });

  return NextResponse.json(updatedUser);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();

  const deletedUser = await prisma.user.delete({
    where: { id },
  });

  return NextResponse.json(deletedUser);
}
