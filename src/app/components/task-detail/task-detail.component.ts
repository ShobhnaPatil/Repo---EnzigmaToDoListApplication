import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task, TaskStatus, TaskPriority } from '../../models/task.model';

@Component({
  standalone: false,
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  // Component properties
  task: Task | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  // Status and priority options
  statusOptions = Object.values(TaskStatus);
  priorityOptions = Object.values(TaskPriority);

  // Edit mode
  isEditing: boolean = false;
  editFormData: Partial<Task> = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {}

  /**
   * Initialize component
   */
  ngOnInit(): void {
    this.loadTaskDetails();
  }

  /**
   * Load task details
   */
  loadTaskDetails(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.route.params.subscribe(params => {
      const taskId = +params['id'];

      if (isNaN(taskId)) {
        this.errorMessage = 'Invalid task ID';
        this.isLoading = false;
        return;
      }

      this.taskService.getTaskById(taskId).subscribe({
        next: (task) => {
          this.task = task;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading task details:', error);
          this.errorMessage = 'Task not found or error loading task details';
          this.isLoading = false;
        }
      });
    });
  }

  /**
   * Enable edit mode
   */
  enableEditMode(): void {
    if (this.task) {
      this.isEditing = true;
      this.editFormData = { ...this.task };
    }
  }

  /**
   * Cancel edit mode
   */
  cancelEdit(): void {
    this.isEditing = false;
    this.editFormData = {};
  }

  /**
   * Save task updates
   */
  saveTask(): void {
    if (!this.task || !this.editFormData) return;

    this.isLoading = true;

    this.taskService.updateTask(this.task.id, this.editFormData).subscribe({
      next: (updatedTask) => {
        this.task = updatedTask;
        this.isEditing = false;
        this.editFormData = {};
        this.isLoading = false;
        alert('Task updated successfully!');
      },
      error: (error) => {
        console.error('Error updating task:', error);
        this.isLoading = false;
        alert('Error updating task. Please try again.');
      }
    });
  }

  /**
   * Delete current task
   */
  deleteTask(): void {
    if (!this.task) return;

    const confirmDelete = confirm(`Are you sure you want to delete task: "${this.task.title}"?`);

    if (confirmDelete) {
      this.isLoading = true;

      this.taskService.deleteTask(this.task.id).subscribe({
        next: () => {
          alert('Task deleted successfully!');
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          this.isLoading = false;
          alert('Error deleting task. Please try again.');
        }
      });
    }
  }

  /**
   * Navigate back to task list
   */
  goBack(): void {
    this.router.navigate(['/tasks']);
  }

  /**
   * Navigate to edit task form
   */
  navigateToEdit(): void {
    if (this.task) {
      this.router.navigate(['/tasks/edit', this.task.id]);
    }
  }

  /**
   * Update task status
   */
  updateStatus(newStatus: TaskStatus): void {
    if (!this.task) return;

    this.taskService.updateTask(this.task.id, { status: newStatus }).subscribe({
      next: (updatedTask) => {
        this.task = updatedTask;
        alert('Status updated successfully!');
      },
      error: (error) => {
        console.error('Error updating status:', error);
        alert('Error updating status. Please try again.');
      }
    });
  }

  /**
   * Update task priority
   */
  updatePriority(newPriority: TaskPriority): void {
    if (!this.task) return;

    this.taskService.updateTask(this.task.id, { priority: newPriority }).subscribe({
      next: (updatedTask) => {
        this.task = updatedTask;
        alert('Priority updated successfully!');
      },
      error: (error) => {
        console.error('Error updating priority:', error);
        alert('Error updating priority. Please try again.');
      }
    });
  }

  /**
   * Get status badge class
   */
  getStatusClass(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.COMPLETED:
        return 'status-completed';
      case TaskStatus.IN_PROGRESS:
        return 'status-in-progress';
      case TaskStatus.NOT_STARTED:
        return 'status-not-started';
      default:
        return 'status-not-started';
    }
  }

  /**
   * Get priority badge class
   */
  getPriorityClass(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.LOW:
        return 'priority-low';
      case TaskPriority.NORMAL:
        return 'priority-normal';
      case TaskPriority.HIGH:
        return 'priority-high';
      default:
        return 'priority-normal';
    }
  }

  /**
   * Get status icon
   */
  getStatusIcon(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.COMPLETED:
        return 'fas fa-check-circle text-success';
      case TaskStatus.IN_PROGRESS:
        return 'fas fa-spinner fa-spin text-warning';
      case TaskStatus.NOT_STARTED:
        return 'fas fa-clock text-secondary';
      default:
        return 'fas fa-circle text-muted';
    }
  }

  /**
   * Get priority icon
   */
  getPriorityIcon(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.HIGH:
        return 'fas fa-exclamation-triangle text-danger';
      case TaskPriority.NORMAL:
        return 'fas fa-exclamation-circle text-warning';
      case TaskPriority.LOW:
        return 'fas fa-check-circle text-success';
      default:
        return 'fas fa-circle text-muted';
    }
  }

  /**
   * Calculate days remaining
   */
  getDaysRemaining(): number | null {
    if (!this.task) return null;

    const today = new Date();
    const dueDate = new Date(this.task.dueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }


  get daysRemainingText(): string | null {
  if (!this.task) return null;

  const today = new Date();
  const dueDate = new Date(this.task.dueDate);
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays >= 0) {
    return `${diffDays} days left`;
  }

  return `${Math.abs(diffDays)} days overdue`;
}

  /**
   * Check if task is overdue
   */
  get isOverdue(): boolean {
    if (!this.task) return false;

    const today = new Date();
    const dueDate = new Date(this.task.dueDate);

    return dueDate < today && this.task.status !== TaskStatus.COMPLETED;
  }

  /**
   * Get task age in days
   */
  getTaskAgeInDays(): number {
    if (!this.task) return 0;

    const today = new Date();
    const createdDate = new Date(this.task.createdAt);
    const diffTime = today.getTime() - createdDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }
}
