-- CreateTable
CREATE TABLE "podcast_settings" (
    "id" SERIAL NOT NULL,
    "youtubeUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "podcast_settings_pkey" PRIMARY KEY ("id")
);
