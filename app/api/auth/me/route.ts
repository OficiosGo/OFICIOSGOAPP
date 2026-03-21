import { NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/api-handler";
import { getCurrentUser } from "@/server/auth/session";
import { userRepository } from "@/server/repositories/user.repository";
import { AppError } from "@/lib/errors";

export const GET = withErrorHandling(async () => {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) throw AppError.unauthorized();

  const user = await userRepository.findById(sessionUser.id);
  if (!user) throw AppError.unauthorized();

  return NextResponse.json({
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      profile: user.profile,
    },
  });
});
