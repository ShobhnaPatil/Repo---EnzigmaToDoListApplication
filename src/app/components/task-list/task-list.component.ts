import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task, TaskStatus, TaskPriority, TaskFilters } from '../../models/task.model';

@Component({
  standalone: false,
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  // Component properties
  tasks: Task[] = [];
  filteredTasks: Task[] = []; // ADD THIS BACK
  isLoading: boolean = true;
  selectedTask: Task | null = null;

  // Search and filter properties
  searchTerm: string = '';
  selectedStatus: string = 'all';
  selectedPriority: string = 'all';
  selectedUser: string = 'all';

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 4;
  totalRecords: number = 0;

  // Available filters
  statusOptions: string[] = ['Completed', 'In Progress', 'Not Started'];
  priorityOptions: string[] = ['High', 'Normal', 'Low'];
  userOptions: string[] = ['User 1', 'User 2', 'User 3', 'User 4'];

  // Statistics
  statistics = {
    total: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0
  };

  constructor(
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  // loadTasks(): void {
  //   this.isLoading = true;

  //   // Build filters object
  //   const filters: TaskFilters = {};

  //   if (this.selectedStatus !== 'all') {
  //     filters.status = this.selectedStatus as TaskStatus;
  //   }

  //   if (this.selectedPriority !== 'all') {
  //     filters.priority = this.selectedPriority as TaskPriority;
  //   }

  //   if (this.selectedUser !== 'all') {
  //     filters.assignedTo = this.selectedUser;
  //   }

  //   if (this.searchTerm) {
  //     filters.search = this.searchTerm;
  //   }

  //   this.taskService.getAllTasks(filters).subscribe({
  //     next: (tasks) => {
  //       this.tasks = tasks;
  //       this.filteredTasks = [...tasks]; // UPDATE THIS
  //       this.totalRecords = tasks.length;
  //       this.updateStatistics();
  //       this.isLoading = false;
  //     },
  //     error: (error) => {
  //       console.error('Error loading tasks:', error);
  //       this.isLoading = false;
  //     }
  //   });
  // }


  // In the loadTasks method, update the filtering logic:
loadTasks(): void {
  this.isLoading = true;

  // Get all tasks first
  this.taskService.getAllTasks().subscribe({
    next: (allTasks) => {
      // Apply client-side filtering
      let filtered = [...allTasks];

      // Apply search filter
      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase();
        filtered = filtered.filter(task =>
          task.assignedTo.toLowerCase().includes(searchLower) ||
          task.comments.toLowerCase().includes(searchLower) ||
          task.status.toLowerCase().includes(searchLower) ||
          task.priority.toLowerCase().includes(searchLower)
        );
      }

      // Apply status filter
      if (this.selectedStatus !== 'all') {
        filtered = filtered.filter(task => task.status === this.selectedStatus);
      }

      // Apply priority filter
      if (this.selectedPriority !== 'all') {
        filtered = filtered.filter(task => task.priority === this.selectedPriority);
      }

      // Apply user filter
      if (this.selectedUser !== 'all') {
        filtered = filtered.filter(task => task.assignedTo === this.selectedUser);
      }

      this.tasks = allTasks;
      this.filteredTasks = filtered;
      this.totalRecords = filtered.length;
      this.updateStatistics();
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Error loading tasks:', error);
      this.isLoading = false;
    }
  });
}
  updateStatistics(): void {
    this.statistics = {
      total: this.tasks.length,
      completed: this.tasks.filter(t => t.status === 'Completed').length,
      inProgress: this.tasks.filter(t => t.status === 'In Progress').length,
      notStarted: this.tasks.filter(t => t.status === 'Not Started').length
    };
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadTasks();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadTasks();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = 'all';
    this.selectedPriority = 'all';
    this.selectedUser = 'all';
    this.currentPage = 1;
    this.loadTasks();
  }

  refreshTasks(): void {
    this.loadTasks();
  }

  createNewTask(): void {
    this.router.navigate(['/tasks/new']);
  }

  editTask(taskId: number): void {
    this.router.navigate(['/tasks/edit', taskId]);
  }

  // NEW: View task details method
  viewTaskDetails(task: Task): void {
    // You can implement a modal or navigate to details page
    // For now, let's show an alert with task details
    alert(`Task Details:\n
      Assigned To: ${task.assignedTo}\n
      Status: ${task.status}\n
      Due Date: ${this.formatDate(task.dueDate)}\n
      Priority: ${task.priority}\n
      Comments: ${task.comments || 'No comments'}
    `);
  }

  deleteTask(taskId: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          this.loadTasks();
          alert('Task deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          alert('Error deleting task. Please try again.');
        }
      });
    }
  }

  get paginatedTasks(): Task[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredTasks.slice(startIndex, startIndex + this.itemsPerPage); // UPDATE THIS
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.itemsPerPage);
  }

  get paginationEnd(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalRecords);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  isOverdue(task: Task): boolean {
    return (
      new Date(task.dueDate) < new Date() &&
      task.status !== 'Completed'
    );
  }

  isDueToday(task: Task): boolean {
    return (
      new Date(task.dueDate).toDateString() === new Date().toDateString()
    );
  }

  // NEW: Get date CSS class for styling
  getDateClass(task: Task): string {
    if (this.isOverdue(task)) {
      return 'text-danger';
    } else if (this.isDueToday(task)) {
      return 'text-warning';
    }
    return '';
  }

  // NEW: Get date icon based on task status
  getDateIcon(task: Task): string {
    if (this.isOverdue(task)) {
      return 'fas fa-exclamation-triangle';
    } else if (this.isDueToday(task)) {
      return 'fas fa-calendar-day';
    }
    return 'fas fa-calendar';
  }

  // UPDATED: Return Bootstrap badge classes
  getStatusClass(status: string): string {
    switch (status) {
      case 'Completed':
        return 'bg-success text-white';
      case 'In Progress':
        return 'bg-warning text-dark';
      case 'Not Started':
        return 'bg-secondary text-white';
      default:
        return 'bg-light text-dark';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Completed':
        return 'fas fa-check-circle';
      case 'In Progress':
        return 'fas fa-spinner fa-spin';
      case 'Not Started':
        return 'fas fa-clock';
      default:
        return 'fas fa-circle';
    }
  }

  // UPDATED: Return Bootstrap badge classes for priority
  getPriorityClass(priority: string): string {
    switch (priority?.toUpperCase()) {
      case 'HIGH':
        return 'bg-danger text-white';
      case 'NORMAL':
        return 'bg-warning text-dark';
      case 'LOW':
        return 'bg-success text-white';
      default:
        return 'bg-light text-dark';
    }
  }

  getPriorityIcon(priority: string): string {
    switch (priority?.toUpperCase()) {
      case 'HIGH':
        return 'fas fa-exclamation-triangle';
      case 'NORMAL':
        return 'fas fa-exclamation-circle';
      case 'LOW':
        return 'fas fa-check-circle';
      default:
        return 'fas fa-circle';
    }
  }

  formatDate(date: Date | string): string {
    if (!date) return '';

    const taskDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (taskDate.toDateString() === today.toDateString()) {
      return 'Today';
    }

    if (taskDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }

    const day = taskDate.getDate().toString().padStart(2, '0');
    const month = (taskDate.getMonth() + 1).toString().padStart(2, '0');
    const year = taskDate.getFullYear();

    return `${day}/${month}/${year}`;
  }

  getDisplayPages(): (number | string)[] {
  const pages: (number | string)[] = [];
  const maxPagesToShow = 5;

  if (this.totalPages <= maxPagesToShow) {
    // Show all pages
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    // Calculate start and end
    let start = Math.max(2, this.currentPage - 1);
    let end = Math.min(this.totalPages - 1, this.currentPage + 1);

    // Adjust if we're at the beginning
    if (this.currentPage <= 3) {
      end = 4;
    }

    // Adjust if we're at the end
    if (this.currentPage >= this.totalPages - 2) {
      start = this.totalPages - 3;
    }

    // Add ellipsis after first page if needed
    if (start > 2) {
      pages.push('...');
    }

    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (end < this.totalPages - 1) {
      pages.push('...');
    }

    // Always show last page
    pages.push(this.totalPages);
  }

  return pages;
}

}
