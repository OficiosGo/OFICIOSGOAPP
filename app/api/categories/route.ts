import { NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/api-handler";
import { categoryRepository } from "@/server/repositories/category.repository";

export const GET = withErrorHandling(async () => {
  const categories = await categoryRepository.getAll();

  const data = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    icon: c.icon,
    description: c.description,
    count: c._count.profiles,
  }));

  return NextResponse.json({ data });
});
