// src/types/tasks.ts

export type TaskStatus = 'to-do' | 'in-progress' | 'done';

export interface TaskRead {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  due_date: string | null;
  created_at: string;
}

export interface TaskWrite {
  title: string;
  description?: string;
  status?: TaskStatus;
  due_date?: string;
}