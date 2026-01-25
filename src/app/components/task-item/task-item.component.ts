import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task, TaskStatus, TaskPriority } from '../../models/task.model';

@Component({
  standalone: false,
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Input() showCheckbox: boolean = true;
  @Input() showActions: boolean = true;

  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<number>();
  @Output() view = new EventEmitter<Task>();
  @Output() statusChange = new EventEmitter<{task: Task, newStatus: TaskStatus}>();
  @Output() priorityChange = new EventEmitter<{task: Task, newPriority: TaskPriority}>();

  TaskStatus = TaskStatus;
  TaskPriority = TaskPriority;

  // Status options for dropdown
  statusOptions = Object.values(TaskStatus);

  // Priority options for dropdown
  priorityOptions = Object.values(TaskPriority);

  // Toggle task selection
  @Input() selected: boolean = false;
  @Output() selectedChange = new EventEmitter<boolean>();

  // Calculate days remaining
  get daysRemaining(): number {
    const today = new Date();
    const dueDate = new Date(this.task.dueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Get status badge class
  getStatusClass(): string {
    switch (this.task.status) {
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

  // Get priority badge class
  getPriorityClass(): string {
    switch (this.task.priority) {
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

  // Get status icon
  getStatusIcon(): string {
    switch (this.task.status) {
      case TaskStatus.COMPLETED:
        return '✓';
      case TaskStatus.IN_PROGRESS:
        return '⟳';
      case TaskStatus.NOT_STARTED:
        return '○';
      default:
        return '○';
    }
  }

  // Check if task is overdue
  get isOverdue(): boolean {
    const today = new Date();
    const dueDate = new Date(this.task.dueDate);
    return dueDate < today && this.task.status !== TaskStatus.COMPLETED;
  }

  // Format due date
  get formattedDueDate(): string {
    const date = new Date(this.task.dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  }

  // Get due date color
  get dueDateColor(): string {
    if (this.task.status === TaskStatus.COMPLETED) {
      return 'text-success';
    }

    const days = this.daysRemaining;

    if (days < 0) return 'text-danger'; // Overdue
    if (days === 0) return 'text-warning'; // Today
    if (days <= 3) return 'text-warning'; // Within 3 days
    return 'text-muted'; // More than 3 days
  }

  // Emit edit event
  onEdit(): void {
    this.edit.emit(this.task);
  }

  // Emit delete event
  onDelete(): void {
    if (confirm(`Are you sure you want to delete task: "${this.task.title}"?`)) {
      this.delete.emit(this.task.id);
    }
  }

  // Emit view event
  onView(): void {
    this.view.emit(this.task);
  }

  // Handle status change
  onStatusChange(newStatus: TaskStatus): void {
    this.statusChange.emit({ task: this.task, newStatus });
  }

  // Handle priority change
  onPriorityChange(newPriority: TaskPriority): void {
    this.priorityChange.emit({ task: this.task, newPriority });
  }

  // Toggle selection
  onSelectionChange(): void {
    this.selectedChange.emit(this.selected);
  }

  // Get priority color code
  getPriorityColorCode(): string {
    switch (this.task.priority) {
      case TaskPriority.HIGH:
        return '#dc3545'; // Red
      case TaskPriority.NORMAL:
        return '#ffc107'; // Yellow
      case TaskPriority.LOW:
        return '#28a745'; // Green
      default:
        return '#6c757d'; // Gray
    }
  }

  // Get task progress percentage
  getProgressPercentage(): number {
    switch (this.task.status) {
      case TaskStatus.NOT_STARTED:
        return 0;
      case TaskStatus.IN_PROGRESS:
        return 50;
      case TaskStatus.COMPLETED:
        return 100;
      default:
        return 0;
    }
  }
}
