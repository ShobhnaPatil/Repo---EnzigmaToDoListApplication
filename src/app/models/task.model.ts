// All declarations at the beginning of program as per best practices
export enum TaskStatus {
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed'
}

export enum TaskPriority {
  LOW = 'Low',
  NORMAL = 'Normal',
  HIGH = 'High'
}

export interface Task {
startDate: string|Date;
  // Unique identifier for the task
  id: number;

  // Task title
  title: string;

  // Task description
  description: string;

  // Person assigned to the task
  assignedTo: string;

  // Current status of the task
  status: TaskStatus;

  // Due date for the task
  dueDate: Date;

  // Priority level of the task
  priority: TaskPriority;

  // Additional comments
  comments: string;

  // Creation timestamp
  createdAt: Date;

  // Last update timestamp
  updatedAt: Date;
}

// Task filter interface for filtering tasks
export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string;
  search?: string;
}

// Task form data interface
export interface TaskFormData {
  title: string;
  description: string;
  assignedTo: string;
  status: TaskStatus;
  dueDate: Date;
  priority: TaskPriority;
  comments: string;
  startDate: string|Date;
}
