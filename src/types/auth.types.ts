export type UserRole = 'admin' | 'dosen' | 'mahasiswa';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}
