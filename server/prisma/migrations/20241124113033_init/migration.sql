-- CreateTable
CREATE TABLE "Organization" (
    "orgId" TEXT NOT NULL PRIMARY KEY,
    "orgName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'FREE_FOR_ALL',
    "category" TEXT NOT NULL,
    "logo" TEXT,
    "address" TEXT,
    "phoneNo" TEXT,
    "alternatePhoneNo" TEXT,
    "startDate" DATETIME NOT NULL,
    "chatRoomId" TEXT NOT NULL,
    "reputationCredits" INTEGER NOT NULL DEFAULT 1000,
    "refreshToken" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME
);

-- CreateTable
CREATE TABLE "Member" (
    "memberId" TEXT NOT NULL PRIMARY KEY,
    "memberName" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "phoneNo" TEXT,
    "alternatePhoneNo" TEXT,
    "memberImg" TEXT,
    "birthday" DATETIME NOT NULL,
    "country" TEXT,
    "city" TEXT,
    "occupation" TEXT,
    "companyName" TEXT,
    "loyaltyCredits" INTEGER NOT NULL DEFAULT 1000,
    "feedbackCount" INTEGER NOT NULL DEFAULT 0,
    "commentsCount" INTEGER NOT NULL DEFAULT 0,
    "refreshToken" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME
);

-- CreateTable
CREATE TABLE "ChatRoom" (
    "chatRoomId" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ChatRoom_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("orgId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Message" (
    "messageId" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "organizationId" TEXT,
    "memberId" TEXT,
    "chatRoomId" TEXT NOT NULL,
    "messageType" TEXT NOT NULL,
    "rating" INTEGER,
    "upvotes" INTEGER,
    "downvotes" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Message_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("orgId") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Message_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("memberId") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Message_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom" ("chatRoomId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EventCategory" (
    "categoryId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "EventCategory_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("orgId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SocialUrl" (
    "urlId" TEXT NOT NULL PRIMARY KEY,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "organizationId" TEXT,
    "memberId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "SocialUrl_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("orgId") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SocialUrl_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("memberId") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "isFavourite" BOOLEAN NOT NULL DEFAULT false,
    "memberId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Membership_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("memberId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Membership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("orgId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Event" (
    "eventId" TEXT NOT NULL PRIMARY KEY,
    "eventName" TEXT NOT NULL,
    "description" TEXT,
    "eventPoster" TEXT,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "pointsRequired" INTEGER,
    "eventDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "attachmentUrl" TEXT,
    "reportUrl" TEXT,
    "organizationId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Event_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("orgId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EventFeedbacks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rating" INTEGER NOT NULL,
    "feedback" TEXT,
    "eventId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    CONSTRAINT "EventFeedbacks_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("eventId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EventFeedbacks_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant" ("participantId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Participant" (
    "participantId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "gender" TEXT,
    "phoneNo" TEXT,
    "address" TEXT,
    "registeredAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'REGISTERED',
    "feedback" TEXT,
    "type" TEXT NOT NULL,
    "isMember" BOOLEAN NOT NULL,
    "memberId" TEXT,
    "eventId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Participant_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("memberId") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Participant_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("eventId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Certificate" (
    "certificateId" TEXT NOT NULL PRIMARY KEY,
    "certificateCode" TEXT NOT NULL,
    "certificateUrl" TEXT,
    "issuedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "participantId" TEXT,
    "memberId" TEXT,
    CONSTRAINT "Certificate_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant" ("participantId") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Certificate_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("memberId") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "notificationId" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "memberId" TEXT,
    "organizationId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Notification_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("memberId") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Notification_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("orgId") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_EventToMember" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_EventToMember_A_fkey" FOREIGN KEY ("A") REFERENCES "Event" ("eventId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EventToMember_B_fkey" FOREIGN KEY ("B") REFERENCES "Member" ("memberId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_email_key" ON "Organization"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_chatRoomId_key" ON "Organization"("chatRoomId");

-- CreateIndex
CREATE UNIQUE INDEX "Member_email_key" ON "Member"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ChatRoom_organizationId_key" ON "ChatRoom"("organizationId");

-- CreateIndex
CREATE INDEX "Event_eventDate_idx" ON "Event"("eventDate");

-- CreateIndex
CREATE INDEX "Event_organizationId_idx" ON "Event"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "EventFeedbacks_participantId_key" ON "EventFeedbacks"("participantId");

-- CreateIndex
CREATE INDEX "Participant_eventId_idx" ON "Participant"("eventId");

-- CreateIndex
CREATE INDEX "Participant_email_idx" ON "Participant"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_email_eventId_key" ON "Participant"("email", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_certificateCode_key" ON "Certificate"("certificateCode");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_participantId_key" ON "Certificate"("participantId");

-- CreateIndex
CREATE UNIQUE INDEX "_EventToMember_AB_unique" ON "_EventToMember"("A", "B");

-- CreateIndex
CREATE INDEX "_EventToMember_B_index" ON "_EventToMember"("B");
