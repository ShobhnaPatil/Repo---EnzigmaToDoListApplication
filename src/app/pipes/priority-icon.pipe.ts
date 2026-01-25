// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//   name: 'priorityIcon',
//   standalone: false
// })
// export class PriorityIconPipe implements PipeTransform {

//   transform(value: unknown, ...args: unknown[]): unknown {
//     return null;
//   }

// }



import { Pipe, PipeTransform } from '@angular/core';
import { TaskPriority } from '../models/task.model';

@Pipe({
  name: 'priorityClass'
})
export class PriorityClassPipe implements PipeTransform {
  // Transform priority value to CSS class
  transform(priority: TaskPriority): string {
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
}

@Pipe({
  name: 'priorityIcon'
})
export class PriorityIconPipe implements PipeTransform {
  // Transform priority value to icon class
  transform(priority: TaskPriority): string {
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
}

@Pipe({
  name: 'statusClass'
})
export class StatusClassPipe implements PipeTransform {
  // Transform status value to CSS class
  transform(status: string): string {
    switch (status) {
      case 'Completed':
        return 'status-completed';
      case 'In Progress':
        return 'status-in-progress';
      case 'Not Started':
        return 'status-not-started';
      default:
        return 'status-not-started';
    }
  }
}

@Pipe({
  name: 'statusIcon'
})
export class StatusIconPipe implements PipeTransform {
  // Transform status value to icon class
  transform(status: string): string {
    switch (status) {
      case 'Completed':
        return 'fas fa-check-circle text-success';
      case 'In Progress':
        return 'fas fa-spinner fa-spin text-warning';
      case 'Not Started':
        return 'fas fa-clock text-secondary';
      default:
        return 'fas fa-circle text-muted';
    }
  }
}

@Pipe({
  name: 'dateFormat',
  standalone: false,
})
export class DateFormatPipe implements PipeTransform {
  // Format date to display format
  transform(date: Date): string {
    if (!date) return '';

    const taskDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Check if date is today
    if (taskDate.toDateString() === today.toDateString()) {
      return 'Today';
    }

    // Check if date is tomorrow
    if (taskDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }

    // Format as dd/mm/yyyy
    const day = taskDate.getDate().toString().padStart(2, '0');
    const month = (taskDate.getMonth() + 1).toString().padStart(2, '0');
    const year = taskDate.getFullYear();

    return `${day}/${month}/${year}`;
  }
}

@Pipe({
  name: 'filterTasks'
})
export class FilterTasksPipe implements PipeTransform {
  // Filter tasks based on criteria
  transform(tasks: any[], filterText: string, filterBy: string): any[] {
    if (!tasks) return [];
    if (!filterText) return tasks;

    filterText = filterText.toLowerCase();

    return tasks.filter(task => {
      switch (filterBy) {
        case 'title':
          return task.title.toLowerCase().includes(filterText);
        case 'assignedTo':
          return task.assignedTo.toLowerCase().includes(filterText);
        case 'status':
          return task.status.toLowerCase().includes(filterText);
        case 'priority':
          return task.priority.toLowerCase().includes(filterText);
        case 'comments':
          return task.comments.toLowerCase().includes(filterText);
        default:
          return (
            task.title.toLowerCase().includes(filterText) ||
            task.description.toLowerCase().includes(filterText) ||
            task.assignedTo.toLowerCase().includes(filterText) ||
            task.comments.toLowerCase().includes(filterText)
          );
      }
    });
  }
}
