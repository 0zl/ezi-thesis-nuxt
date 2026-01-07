"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getBalitaByNik(nik: string) {
  if (!nik) return null;
  
  const balita = await prisma.balita.findUnique({
    where: { nik },
  });
  
  return balita;
}

export async function saveMeasurement(data: {
  nik: string;
  name: string;
  dob: string | Date;
  gender: string;
  parentName: string;
  weight: number;
  height: number;
  zScoreWeight?: number;
  zScoreHeight?: number;
  nutritionStatus: string;
}) {
  try {
    const {
      nik,
      name,
      dob,
      gender,
      parentName,
      weight,
      height,
      zScoreWeight,
      zScoreHeight,
      nutritionStatus,
    } = data;

    // Check if balita exists
    let balita = await prisma.balita.findUnique({
      where: { nik },
    });

    if (balita) {
      balita = await prisma.balita.update({
        where: { nik },
        data: {
          name,
          dob: new Date(dob), // Ensure Date object
          gender,
          parentName,
        },
      });
    } else {
      balita = await prisma.balita.create({
        data: {
          nik,
          name,
          dob: new Date(dob),
          gender,
          parentName,
        },
      });
    }

    const pemeriksaan = await prisma.pemeriksaan.create({
      data: {
        balitaId: balita.id,
        weight,
        height,
        zScoreWeight,
        zScoreHeight,
        nutritionStatus,
        date: new Date(),
      },
    });

    revalidatePath("/");
    return { success: true, data: pemeriksaan };
  } catch (error) {
    console.error("Error saving measurement:", error);
    return { success: false, error: "Failed to save measurement" };
  }
}

export async function getBalitaList({
  page = 1,
  query = "",
  limit = 10,
}: {
  page?: number;
  query?: string;
  limit?: number;
} = {}) {
  try {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query) {
      where.OR = [
        { name: { contains: query } },
        { nik: { contains: query } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.balita.findMany({
        where,
        include: {
          pemeriksaan: {
            orderBy: { date: "desc" },
            take: 1,
          },
        },
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.balita.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return { data, totalPages, total };
  } catch (error) {
    console.error("Error fetching balita list:", error);
    return { data: [], totalPages: 0, total: 0 };
  }
}

export async function deleteBalita(id: number) {
  try {
    await prisma.pemeriksaan.deleteMany({
      where: { balitaId: id }
    });

    await prisma.balita.delete({
      where: { id }
    });

    revalidatePath("/"); 
    return { success: true };
  } catch (error) {
    console.error("Error deleting balita:", error);
    return { success: false, error: "Failed to delete balita" };
  }
}
