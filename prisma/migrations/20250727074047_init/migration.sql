-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "campsites" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name_ja" TEXT NOT NULL,
    "name_en" TEXT,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
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
    "facilities" TEXT NOT NULL DEFAULT '[]',
    "activities" TEXT NOT NULL DEFAULT '[]',
    "images" TEXT NOT NULL DEFAULT '[]',
    "price_min" INTEGER,
    "price_max" INTEGER,
    "reservation_url" TEXT,
    "reservation_phone" TEXT,
    "reservation_email" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
