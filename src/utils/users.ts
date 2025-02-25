export interface User {
  name: string;
  role: string;
  displayName: string;
}

export const AVAILABLE_USERS: User[] = [
  {
    name: 'admin',
    role: 'admin',
    displayName: 'Admin (Role: Admin)',
  },
  {
    name: 'priya',
    role: 'hr',
    displayName: 'Priya (Role: HR)',
  },
  {
    name: 'david',
    role: 'manager',
    displayName: 'David (Role: Manager)',
  },
  {
    name: 'deepa',
    role: 'manager',
    displayName: 'Deepa (Role: Manager)',
  },
  {
    name: 'michael',
    role: 'manager',
    displayName: 'Michael (Role: Manager)',
  },
  {
    name: 'karthik',
    role: 'manager',
    displayName: 'Karthik (Role: Manager)',
  },
  {
    name: 'jose',
    role: 'engineer',
    displayName: 'Jose (Role: Engineer)',
  },
  {
    name: 'sabitha',
    role: 'engineer',
    displayName: 'Sabitha (Role: Engineer)',
  },
  {
    name: 'wei',
    role: 'engineer',
    displayName: 'Wei (Role: Engineer)',
  },
  {
    name: 'ronja',
    role: 'engineer',
    displayName: 'Ronja (Role: Engineer)',
  },
];
