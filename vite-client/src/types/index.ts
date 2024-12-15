export interface Organization {
  orgId: string;
  orgName: string;
  description: string | null;
  email: string;
  emailVerified: boolean;
  type: string;
  category: string;
  logo: string | null;
  address: string | null;
  phoneNo: string | null;
  startDate: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Member {
  memberId: string;
  memberName: string;
  description: string | null;
  email: string;
  emailVerified: boolean;
  type: string;
  category: string;
  logo: string | null;
  address: string | null;
  phoneNo: string | null;
  startDate: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// organization types
// Enterprise
// Small and Medium Enterprises (SME)
// Startup
// Non-Profit Organization (NPO)
// Government
// Educational Institution
// Corporation
// Partnership
// Sole Proprietorship
// Cooperative
// Multinational Corporation (MNC)
// Public Sector Unit (PSU)
// Social Enterprise
// Franchise
// Family Business
// Professional Association
// Religious Organization
// Charity
// Trust
// Foundation
// Public Company
// Private Company
// B Corporation (Benefit Corporation)
// Limited Liability Company (LLC)
// Joint Venture
// Holding Company
// Consortium
// Think Tank
// Research Institution
// Healthcare Provider
// Banking/Financial Institution
// Trade Union
// Advocacy Group
// Community Organization
// NGO (Non-Governmental Organization)
