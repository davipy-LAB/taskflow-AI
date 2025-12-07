// src/types/task.ts

export type TaskStatus = 'to-do' | 'in-progress' | 'done';

export interface TaskRead {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  due_date: string | null; 
}

export interface TaskWrite {
  title: string;
  description?: string;
  status?: TaskStatus;
  due_date?: string;
}