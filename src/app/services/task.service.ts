import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Task, TaskStatus, TaskPriority, TaskFilters } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // In-memory task storage (simulating backend)
  private tasks: Task[] = [
    {
      id: 1,
      title: 'Complete Angular Assessment',
      description: 'Finish the To-Do List application as per requirements',
      assignedTo: 'User 1',
      status: TaskStatus.COMPLETED,
      dueDate: new Date('2025-10-12'),
      priority: TaskPriority.LOW,
      comments: 'This task is good',
      createdAt: new Date('2025-09-01'),
      updatedAt: new Date('2025-09-10')
    },
    {
      id: 2,
      title: 'Review Team Code',
      description: 'Review the code submissions from team members',
      assignedTo: 'User 2',
      status: TaskStatus.IN_PROGRESS,
      dueDate: new Date('2025-09-14'),
      priority: TaskPriority.HIGH,
      comments: 'Need to complete by end of week',
      createdAt: new Date('2025-08-28'),
      updatedAt: new Date('2025-09-05')
    },
    {
      id: 3,
      title: 'Update Documentation',
      description: 'Update project documentation with latest changes',
      assignedTo: 'User 3',
      status: TaskStatus.NOT_STARTED,
      dueDate: new Date('2024-08-18'),
      priority: TaskPriority.LOW,
      comments: 'Document all API endpoints',
      createdAt: new Date('2024-08-15'),
      updatedAt: new Date('2024-08-15')
    },
    {
      id: 4,
      title: 'Team Meeting Preparation',
      description: 'Prepare agenda and materials for weekly team meeting',
      assignedTo: 'User 4',
      status: TaskStatus.IN_PROGRESS,
      dueDate: new Date('2024-06-12'),
      priority: TaskPriority.NORMAL,
      comments: 'This task is good',
      createdAt: new Date('2024-06-01'),
      updatedAt: new Date('2024-06-05')
    }
  ];

  // Available users for assignment
  private availableUsers: string[] = ['User 1', 'User 2', 'User 3', 'User 4'];

  constructor() {
    console.log('TaskService initialized');
  }

  /**
   * Get all available users
   */
  getAvailableUsers(): Observable<string[]> {
    return of([...this.availableUsers]).pipe(delay(100));
  }

  /**
   * Get all tasks with optional filters
   */
  getAllTasks(filters?: TaskFilters): Observable<Task[]> {
    let filteredTasks = [...this.tasks];

    if (filters) {
      if (filters.status) {
        filteredTasks = filteredTasks.filter(task => task.status === filters.status);
      }

      if (filters.priority) {
        filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
      }

      if (filters.assignedTo) {
        filteredTasks = filteredTasks.filter(task => task.assignedTo === filters.assignedTo);
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredTasks = filteredTasks.filter(task =>
          task.title.toLowerCase().includes(searchTerm) ||
          task.description.toLowerCase().includes(searchTerm) ||
          task.comments.toLowerCase().includes(searchTerm)
        );
      }
    }

    return of(filteredTasks).pipe(delay(200));
  }

  /**
   * Get a specific task by ID
   */
  getTaskById(id: number): Observable<Task> {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      return of({ ...task }).pipe(delay(100));
    }
    return throwError(() => new Error(`Task with id ${id} not found`));
  }

  /**
   * Create a new task
   */
  // createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Observable<Task> {
  //   const newTask: Task = {
  //     ...taskData,
  //     id: this.generateId(),
  //     createdAt: new Date(),
  //     updatedAt: new Date()
  //   };

  //   this.tasks.push(newTask);
  //   return of({ ...newTask }).pipe(delay(200));
  // }

  /**
   * Update an existing task
   */
  // updateTask(id: number, taskData: Partial<Task>): Observable<Task> {
  //   const index = this.tasks.findIndex(task => task.id === id);

  //   if (index === -1) {
  //     return throwError(() => new Error(`Task with id ${id} not found`));
  //   }

  //   this.tasks[index] = {
  //     ...this.tasks[index],
  //     ...taskData,
  //     updatedAt: new Date()
  //   };

  //   return of({ ...this.tasks[index] }).pipe(delay(200));
  // }

  /**
   * Delete a task
   */
  deleteTask(id: number): Observable<boolean> {
    const index = this.tasks.findIndex(task => task.id === id);

    if (index === -1) {
      return throwError(() => new Error(`Task with id ${id} not found`));
    }

    this.tasks.splice(index, 1);
    return of(true).pipe(delay(200));
  }

  /**
   * Generate a unique ID for new tasks
   */
  private generateId(): number {
    const maxId = this.tasks.length > 0
      ? Math.max(...this.tasks.map(task => task.id))
      : 0;
    return maxId + 1;
  }

  /**
   * Get tasks statistics
   */
  getTasksStatistics(): Observable<{
    total: number;
    completed: number;
    inProgress: number;
    notStarted: number;
  }> {
    const total = this.tasks.length;
    const completed = this.tasks.filter(task => task.status === TaskStatus.COMPLETED).length;
    const inProgress = this.tasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length;
    const notStarted = this.tasks.filter(task => task.status === TaskStatus.NOT_STARTED).length;

    return of({ total, completed, inProgress, notStarted }).pipe(delay(100));
  }

  /**
 * Create a new task
 */
createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Observable<Task> {
  console.log('Creating task with data:', taskData);



  const newTask: Task = {
    ...taskData,
    id: this.generateId(),
    createdAt: new Date(),
    updatedAt: new Date()
  };



      console.log('Available users after addition:', this.availableUsers);


  console.log('New task object:', newTask);

  this.tasks.push(newTask);
  console.log('Tasks array after creation:', this.tasks);

  return of({ ...newTask }).pipe(delay(200));
}

/**
 * Update an existing task
 */
updateTask(id: number, taskData: Partial<Task>): Observable<Task> {
  console.log(`Updating task ${id} with data:`, taskData);

  const index = this.tasks.findIndex(task => task.id === id);

  if (index === -1) {
    console.error(`Task with id ${id} not found`);
    return throwError(() => new Error(`Task with id ${id} not found`));
  }

  this.tasks[index] = {
    ...this.tasks[index],
    ...taskData,
    updatedAt: new Date()
  };

  console.log('Updated task:', this.tasks[index]);
  console.log('Tasks array after update:', this.tasks);

  return of({ ...this.tasks[index] }).pipe(delay(200));
}
}
