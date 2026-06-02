-- Forgot-password fields (schema added in f7029ae without a migration).
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "resetPasswordToken" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "resetPasswordExpires" TIMESTAMP(3);
