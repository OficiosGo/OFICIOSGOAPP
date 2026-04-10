-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PROFESSIONAL', 'CLIENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "ProfileStatus" AS ENUM ('PENDING', 'APPROVED', 'SUSPENDED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('FREE', 'STANDARD', 'PREMIUM');

-- CreateEnum
CREATE TYPE "SponsorTier" AS ENUM ('PREMIUM', 'STANDARD');

-- CreateEnum
CREATE TYPE "BudgetRequestStatus" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BudgetResponseStatus" AS ENUM ('PENDING', 'SENT', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "dni" TEXT,
    "birthDate" TIMESTAMP(3),
    "role" "UserRole" NOT NULL DEFAULT 'PROFESSIONAL',
    "resetToken" TEXT,
    "resetTokenExp" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "headline" TEXT,
    "bio" TEXT,
    "categoryId" TEXT NOT NULL,
    "additionalCategoryIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL DEFAULT 'Córdoba',
    "neighborhood" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "whatsapp" TEXT,
    "yearsExperience" INTEGER,
    "matricula" TEXT,
    "availability" TEXT,
    "urgencias24hs" BOOLEAN NOT NULL DEFAULT false,
    "conGarantia" BOOLEAN NOT NULL DEFAULT false,
    "profileImage" TEXT,
    "tier" "SubscriptionTier" NOT NULL DEFAULT 'FREE',
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "totalViews" INTEGER NOT NULL DEFAULT 0,
    "totalContacts" INTEGER NOT NULL DEFAULT 0,
    "status" "ProfileStatus" NOT NULL DEFAULT 'PENDING',
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkPhoto" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "caption" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "response" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sponsor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tier" "SponsorTier" NOT NULL,
    "logoUrl" TEXT,
    "websiteUrl" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "description" TEXT,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL DEFAULT 'Córdoba',
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3),
    "totalViews" INTEGER NOT NULL DEFAULT 0,
    "totalClicks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sponsor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileEvent" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfileEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetRequest" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientPhone" TEXT NOT NULL,
    "clientEmail" TEXT,
    "description" TEXT NOT NULL,
    "city" TEXT NOT NULL DEFAULT 'Villa María',
    "province" TEXT NOT NULL DEFAULT 'Córdoba',
    "status" "BudgetRequestStatus" NOT NULL DEFAULT 'PENDING',
    "notifiedCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BudgetRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetResponse" (
    "id" TEXT NOT NULL,
    "budgetRequestId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "message" TEXT,
    "amount" DECIMAL(10,2),
    "status" "BudgetResponseStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BudgetResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformEvent" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "page" TEXT,
    "referrer" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlatformEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_dni_key" ON "User"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "User_resetToken_key" ON "User"("resetToken");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "User"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_slug_key" ON "Profile"("slug");

-- CreateIndex
CREATE INDEX "Profile_categoryId_idx" ON "Profile"("categoryId");

-- CreateIndex
CREATE INDEX "Profile_city_idx" ON "Profile"("city");

-- CreateIndex
CREATE INDEX "Profile_status_idx" ON "Profile"("status");

-- CreateIndex
CREATE INDEX "Profile_tier_idx" ON "Profile"("tier");

-- CreateIndex
CREATE INDEX "Profile_slug_idx" ON "Profile"("slug");

-- CreateIndex
CREATE INDEX "Profile_city_categoryId_idx" ON "Profile"("city", "categoryId");

-- CreateIndex
CREATE INDEX "Profile_status_city_categoryId_idx" ON "Profile"("status", "city", "categoryId");

-- CreateIndex
CREATE INDEX "Profile_averageRating_idx" ON "Profile"("averageRating" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCategory_name_key" ON "ServiceCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCategory_slug_key" ON "ServiceCategory"("slug");

-- CreateIndex
CREATE INDEX "ServiceCategory_slug_idx" ON "ServiceCategory"("slug");

-- CreateIndex
CREATE INDEX "ServiceCategory_isActive_sortOrder_idx" ON "ServiceCategory"("isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "WorkPhoto_profileId_idx" ON "WorkPhoto"("profileId");

-- CreateIndex
CREATE INDEX "WorkPhoto_profileId_sortOrder_idx" ON "WorkPhoto"("profileId", "sortOrder");

-- CreateIndex
CREATE INDEX "Review_profileId_isVisible_idx" ON "Review"("profileId", "isVisible");

-- CreateIndex
CREATE INDEX "Review_authorId_idx" ON "Review"("authorId");

-- CreateIndex
CREATE INDEX "Review_createdAt_idx" ON "Review"("createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Review_profileId_authorId_key" ON "Review"("profileId", "authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Sponsor_slug_key" ON "Sponsor"("slug");

-- CreateIndex
CREATE INDEX "Sponsor_tier_isActive_idx" ON "Sponsor"("tier", "isActive");

-- CreateIndex
CREATE INDEX "Sponsor_city_isActive_idx" ON "Sponsor"("city", "isActive");

-- CreateIndex
CREATE INDEX "ProfileEvent_profileId_eventType_idx" ON "ProfileEvent"("profileId", "eventType");

-- CreateIndex
CREATE INDEX "ProfileEvent_createdAt_idx" ON "ProfileEvent"("createdAt");

-- CreateIndex
CREATE INDEX "ProfileEvent_profileId_createdAt_idx" ON "ProfileEvent"("profileId", "createdAt");

-- CreateIndex
CREATE INDEX "BudgetRequest_categoryId_status_idx" ON "BudgetRequest"("categoryId", "status");

-- CreateIndex
CREATE INDEX "BudgetRequest_status_idx" ON "BudgetRequest"("status");

-- CreateIndex
CREATE INDEX "BudgetRequest_createdAt_idx" ON "BudgetRequest"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "BudgetResponse_profileId_idx" ON "BudgetResponse"("profileId");

-- CreateIndex
CREATE INDEX "BudgetResponse_budgetRequestId_idx" ON "BudgetResponse"("budgetRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "BudgetResponse_budgetRequestId_profileId_key" ON "BudgetResponse"("budgetRequestId", "profileId");

-- CreateIndex
CREATE INDEX "PlatformEvent_eventType_idx" ON "PlatformEvent"("eventType");

-- CreateIndex
CREATE INDEX "PlatformEvent_createdAt_idx" ON "PlatformEvent"("createdAt");

-- CreateIndex
CREATE INDEX "PlatformEvent_eventType_createdAt_idx" ON "PlatformEvent"("eventType", "createdAt");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ServiceCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkPhoto" ADD CONSTRAINT "WorkPhoto_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileEvent" ADD CONSTRAINT "ProfileEvent_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetRequest" ADD CONSTRAINT "BudgetRequest_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ServiceCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetResponse" ADD CONSTRAINT "BudgetResponse_budgetRequestId_fkey" FOREIGN KEY ("budgetRequestId") REFERENCES "BudgetRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
