export interface User {
  _id?: string;
  fullName: string;
  email: string;
  password?: string;
  role: 'student' | 'admin';
  enrolledExams?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'student' | 'admin';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}
