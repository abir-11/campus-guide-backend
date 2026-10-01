-- CreateTable
CREATE TABLE "mentor_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "cgpa" DECIMAL(3,2) NOT NULL,
    "bio" TEXT NOT NULL,
    "goodSubjects" TEXT[],
    "experience" TEXT,
    "portfolio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mentor_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mentor_profiles_userId_key" ON "mentor_profiles"("userId");

-- CreateIndex
CREATE INDEX "mentor_profiles_department_idx" ON "mentor_profiles"("department");

-- CreateIndex
CREATE INDEX "mentor_profiles_cgpa_idx" ON "mentor_profiles"("cgpa");

-- AddForeignKey
ALTER TABLE "mentor_profiles" ADD CONSTRAINT "mentor_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
