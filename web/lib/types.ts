export type Role = "STUDENT" | "COMPANY" | "ADMIN";

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  studentId: string;
  career: string;
  semester: number;
}

export interface Company {
  id: number;
  name: string;
  industry: string;
  email: string;
  description: string;
}

export interface Vacancy {
  id: number;
  title: string;
  description?: string;
  requirements?: string[];
  mode: string;
  location?: string;
  company: string | { id: number; name: string };
  companyId?: number;
}

export interface Application {
  id: number;
  vacancy: string;
  company: string;
  status: string;
}

export interface DashboardMetrics {
  students: number;
  companies: number;
  vacancies: number;
  applications: number;
  cvsGenerated: number;
}
