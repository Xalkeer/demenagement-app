export type TaskList = {
  id: number;
  name: string;
  color: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Task = {
  id: number;
  title: string;
  date: string;
  isCompleted: boolean;
  priority?: 'normal' | 'urgent' | 'super-urgent';
  listId?: number | null;
  list?: TaskList | null;
  description?: string | null;
  location?: string | null;
  assignee?: string | null;
  createdAt?: string;
  updatedAt?: string;
};
