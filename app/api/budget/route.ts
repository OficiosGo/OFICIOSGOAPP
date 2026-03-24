import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/api-handler";
import { budgetRequestSchema } from "@/lib/validators";
import { budgetService } from "@/server/services/budget.service";

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json();
  const parsed = budgetRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", code: "VALIDATION", details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const result = await budgetService.createRequest({
    ...parsed.data,
    clientEmail: parsed.data.clientEmail || undefined,
  });

  return NextResponse.json({
    data: {
      requestId: result.request.id,
      category: result.request.category.name,
      totalNotified: result.totalNotified,
      notifications: result.notifications,
    },
  }, { status: 201 });
});