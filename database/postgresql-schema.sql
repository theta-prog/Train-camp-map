-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campsites" (
    "id" TEXT NOT NULL,
    "name_ja" TEXT NOT NULL,
    "name_en" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "address_ja" TEXT NOT NULL,
    "address_en" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "price" TEXT NOT NULL,
    "nearest_station_ja" TEXT NOT NULL,
    "nearest_station_en" TEXT,
    "access_time_ja" TEXT NOT NULL,
    "access_time_en" TEXT,
    "description_ja" TEXT NOT NULL,
    "description_en" TEXT,
    "facilities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "activities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "price_min" INTEGER,
    "price_max" INTEGER,
    "reservation_url" TEXT,
    "reservation_phone" TEXT,
    "reservation_email" TEXT,
    "check_in_time" TEXT,
    "check_out_time" TEXT,
    "cancellation_policy_ja" TEXT,
    "cancellation_policy_en" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campsites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
