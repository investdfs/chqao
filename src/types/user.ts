export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  status: 'active' | 'blocked';
  type?: string;
}

export interface PreviewUser {
  id: string;
  email: string;
  name: string;
  status: 'active' | 'blocked';
}