export interface User {
  name: string;
  role: string;
  displayName: string;
}

export interface UserQuestion {
  name: string;
  value: User;
}

export const AVAILABLE_USERS: UserQuestion[] = [
  {
    name: "Admin (Role: Admin)",
    value: { name: "admin", role: "admin", displayName: "Admin (Admin)" },
  },
  {
    name: "Priya (Role: HR)",
    value: { name: "priya", role: "hr", displayName: "Priya (HR)" },
  },
  {
    name: "David (Role: Manager)",
    value: { name: "david", role: "manager", displayName: "David (Manager)" },
  },
  {
    name: "Deepa (Role: Manager)",
    value: { name: "deepa", role: "manager", displayName: "Deepa (Manager)" },
  },
  {
    name: "Michael (Role: Manager)",
    value: {
      name: "michael",
      role: "manager",
      displayName: "Michael (Manager)",
    },
  },
  {
    name: "Karthik (Role: Manager)",
    value: {
      name: "karthik",
      role: "manager",
      displayName: "Karthik (Manager)",
    },
  },
  {
    name: "Jose (Role: Engineer)",
    value: { name: "jose", role: "engineer", displayName: "Jose (Engineer)" },
  },
  {
    name: "Sabitha (Role: Engineer)",
    value: {
      name: "sabitha",
      role: "engineer",
      displayName: "Sabitha (Engineer)",
    },
  },
  {
    name: "Wei (Role: Engineer)",
    value: {
      name: "wei",
      role: "engineer",
      displayName: "Wei (Engineer)",
    },
  },
  {
    name: "Ronja (Role: Engineer)",
    value: {
      name: "ronja",
      role: "engineer",
      displayName: "Ronja (Engineer)",
    },
  },
];
