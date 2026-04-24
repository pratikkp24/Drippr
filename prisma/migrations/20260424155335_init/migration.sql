-- CreateEnum
CREATE TYPE "Category" AS ENUM ('TOPS', 'BOTTOMS', 'DRESSES', 'OUTERWEAR', 'FOOTWEAR', 'ACCESSORIES', 'BAGS', 'JEWELRY', 'OTHER');

-- CreateEnum
CREATE TYPE "Season" AS ENUM ('SUMMER', 'MONSOON', 'WINTER', 'TRANSITIONAL', 'ALL_SEASON');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('AFFILIATE_LINK', 'MANUAL_UPLOAD', 'DRIPPR_CATALOG', 'THRIFTED', 'GIFTED', 'INHERITED');

-- CreateEnum
CREATE TYPE "DropType" AS ENUM ('OPEN', 'LIMITED', 'BY_REQUEST');

-- CreateEnum
CREATE TYPE "Occasion" AS ENUM ('WORK', 'CASUAL', 'EVENING', 'TRAVEL', 'FORMAL', 'FESTIVE', 'PARTY', 'EVENT');

-- CreateEnum
CREATE TYPE "TimeOfDay" AS ENUM ('MORNING', 'AFTERNOON', 'EVENING', 'FULL_DAY');

-- CreateEnum
CREATE TYPE "Feeling" AS ENUM ('LOVED', 'FINE', 'WOULDNT_REPEAT');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('NEW_FOLLOWER', 'DROP_SAVED', 'DROP_PUBLISHED_BY_FOLLOWED', 'PIECE_BACK_IN_STOCK', 'PRICE_DROP', 'SYSTEM');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "styleSignature" TEXT,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follow" (
    "id" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Piece" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "category" "Category" NOT NULL,
    "color" TEXT,
    "size" TEXT,
    "season" "Season"[],
    "purchasePrice" DECIMAL(10,2),
    "purchaseCurrency" TEXT NOT NULL DEFAULT 'INR',
    "photos" TEXT[],
    "primaryPhoto" TEXT,
    "sourceType" "SourceType" NOT NULL,
    "sourceUrl" TEXT,
    "partnerId" TEXT,
    "partnerProductId" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[],
    "styleNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Piece_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "affiliateProgram" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "commissionRate" DECIMAL(5,2),

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceHistory" (
    "id" TEXT NOT NULL,
    "pieceId" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "sizesAvailable" TEXT[],
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PriceHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Drop" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "story" TEXT,
    "coverImage" TEXT NOT NULL,
    "dropType" "DropType" NOT NULL DEFAULT 'OPEN',
    "season" "Season"[],
    "vibeTags" TEXT[],
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Drop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DropPiece" (
    "id" TEXT NOT NULL,
    "dropId" TEXT NOT NULL,
    "pieceId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "styleNote" TEXT,

    CONSTRAINT "DropPiece_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedDrop" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dropId" TEXT NOT NULL,
    "collectionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedDrop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Outfit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT,
    "scheduledFor" TIMESTAMP(3),
    "occasion" "Occasion",
    "timeOfDay" "TimeOfDay",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Outfit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutfitPiece" (
    "id" TEXT NOT NULL,
    "outfitId" TEXT NOT NULL,
    "pieceId" TEXT NOT NULL,

    CONSTRAINT "OutfitPiece_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WearLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pieceId" TEXT,
    "outfitId" TEXT,
    "wornAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "occasion" "Occasion",
    "feeling" "Feeling",
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WearLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutboundClick" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "pieceId" TEXT,
    "dropId" TEXT,
    "partnerId" TEXT NOT NULL,
    "clickedUrl" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userAgent" TEXT,
    "referrer" TEXT,
    "converted" BOOLEAN NOT NULL DEFAULT false,
    "conversionAmount" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OutboundClick_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "actionUrl" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "Follow_followingId_idx" ON "Follow"("followingId");

-- CreateIndex
CREATE UNIQUE INDEX "Follow_followerId_followingId_key" ON "Follow"("followerId", "followingId");

-- CreateIndex
CREATE INDEX "Piece_userId_idx" ON "Piece"("userId");

-- CreateIndex
CREATE INDEX "Piece_category_idx" ON "Piece"("category");

-- CreateIndex
CREATE INDEX "Piece_isPublic_idx" ON "Piece"("isPublic");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_name_key" ON "Partner"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_slug_key" ON "Partner"("slug");

-- CreateIndex
CREATE INDEX "PriceHistory_pieceId_checkedAt_idx" ON "PriceHistory"("pieceId", "checkedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Drop_slug_key" ON "Drop"("slug");

-- CreateIndex
CREATE INDEX "Drop_userId_idx" ON "Drop"("userId");

-- CreateIndex
CREATE INDEX "Drop_slug_idx" ON "Drop"("slug");

-- CreateIndex
CREATE INDEX "Drop_publishedAt_idx" ON "Drop"("publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "DropPiece_dropId_pieceId_key" ON "DropPiece"("dropId", "pieceId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedDrop_userId_dropId_key" ON "SavedDrop"("userId", "dropId");

-- CreateIndex
CREATE INDEX "Outfit_userId_scheduledFor_idx" ON "Outfit"("userId", "scheduledFor");

-- CreateIndex
CREATE UNIQUE INDEX "OutfitPiece_outfitId_pieceId_key" ON "OutfitPiece"("outfitId", "pieceId");

-- CreateIndex
CREATE INDEX "WearLog_userId_wornAt_idx" ON "WearLog"("userId", "wornAt");

-- CreateIndex
CREATE INDEX "WearLog_pieceId_idx" ON "WearLog"("pieceId");

-- CreateIndex
CREATE INDEX "OutboundClick_userId_createdAt_idx" ON "OutboundClick"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "OutboundClick_partnerId_createdAt_idx" ON "OutboundClick"("partnerId", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_userId_read_idx" ON "Notification"("userId", "read");

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Piece" ADD CONSTRAINT "Piece_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Piece" ADD CONSTRAINT "Piece_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceHistory" ADD CONSTRAINT "PriceHistory_pieceId_fkey" FOREIGN KEY ("pieceId") REFERENCES "Piece"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceHistory" ADD CONSTRAINT "PriceHistory_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drop" ADD CONSTRAINT "Drop_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DropPiece" ADD CONSTRAINT "DropPiece_dropId_fkey" FOREIGN KEY ("dropId") REFERENCES "Drop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DropPiece" ADD CONSTRAINT "DropPiece_pieceId_fkey" FOREIGN KEY ("pieceId") REFERENCES "Piece"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedDrop" ADD CONSTRAINT "SavedDrop_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedDrop" ADD CONSTRAINT "SavedDrop_dropId_fkey" FOREIGN KEY ("dropId") REFERENCES "Drop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedDrop" ADD CONSTRAINT "SavedDrop_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outfit" ADD CONSTRAINT "Outfit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutfitPiece" ADD CONSTRAINT "OutfitPiece_outfitId_fkey" FOREIGN KEY ("outfitId") REFERENCES "Outfit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutfitPiece" ADD CONSTRAINT "OutfitPiece_pieceId_fkey" FOREIGN KEY ("pieceId") REFERENCES "Piece"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WearLog" ADD CONSTRAINT "WearLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WearLog" ADD CONSTRAINT "WearLog_pieceId_fkey" FOREIGN KEY ("pieceId") REFERENCES "Piece"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WearLog" ADD CONSTRAINT "WearLog_outfitId_fkey" FOREIGN KEY ("outfitId") REFERENCES "Outfit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutboundClick" ADD CONSTRAINT "OutboundClick_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutboundClick" ADD CONSTRAINT "OutboundClick_dropId_fkey" FOREIGN KEY ("dropId") REFERENCES "Drop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
