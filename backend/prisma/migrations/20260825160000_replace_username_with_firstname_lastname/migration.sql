-- Safe migration: replace username with firstName + lastName
-- Step 1: Add columns as nullable so existing rows aren't blocked
ALTER TABLE "User" ADD COLUMN "firstName" TEXT;
ALTER TABLE "User" ADD COLUMN "lastName" TEXT;

-- Step 2: Backfill existing rows from username (first word → firstName, rest → lastName)
UPDATE "User"
SET
  "firstName" = SPLIT_PART("username", ' ', 1),
  "lastName"  = COALESCE(NULLIF(SUBSTRING("username" FROM POSITION(' ' IN "username") + 1), ''), "username");

-- Step 3: Enforce NOT NULL now that all rows have values
ALTER TABLE "User" ALTER COLUMN "firstName" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "lastName" SET NOT NULL;

-- Step 4: Drop the old username column
ALTER TABLE "User" DROP COLUMN "username";
