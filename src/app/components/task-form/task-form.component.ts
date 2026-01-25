import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task, TaskStatus, TaskPriority } from '../../models/task.model';

@Component({
  standalone: false,
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  // Form properties
  taskForm: FormGroup;
  isEditMode: boolean = false;
  isSubmitting: boolean = false;
  taskId?: number;
  pageTitle: string = 'Create New Task';
  submitButtonText: string = 'Create Task';

  // Available options
  availableUsers: string[] = [];
  statusOptions = Object.values(TaskStatus);
  priorityOptions = Object.values(TaskPriority);

  // Min and max dates for date picker
  minDate: string;
  maxDate: string;

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Initialize form
    this.taskForm = this.initializeForm();

    // Set date limits
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() + 1);
    this.maxDate = maxDate.toISOString().split('T')[0];
  }

  /**
   * Initialize component
   */
  ngOnInit(): void {
    this.loadAvailableUsers();
    this.checkEditMode();
  }

  /**
   * Initialize the task form
   */
  private initializeForm(): FormGroup {
    return this.formBuilder.group({
      title: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500)
      ]],
      assignedTo: ['', Validators.required],
      status: [TaskStatus.NOT_STARTED, Validators.required],
      dueDate: ['', Validators.required],
      priority: [TaskPriority.NORMAL, Validators.required],
      comments: ['', Validators.maxLength(200)]
    });
  }

  /**
   * Load available users
   */
  private loadAvailableUsers(): void {
    this.taskService.getAvailableUsers().subscribe({
      next: (users) => {
        this.availableUsers = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.availableUsers = ['User 1', 'User 2', 'User 3', 'User 4'];
      }
    });
  }

  /**
   * Check if we're in edit mode
   */
  private checkEditMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.taskId = +params['id'];
        this.pageTitle = 'Edit Task';
        this.submitButtonText = 'Update Task';
        this.loadTaskForEdit(this.taskId);
      }
    });
  }

  /**
   * Load task data for editing
   */
  private loadTaskForEdit(id: number): void {
    this.isSubmitting = true;

    this.taskService.getTaskById(id).subscribe({
      next: (task) => {
        // Format date for input field
        const dueDate = new Date(task.dueDate);
        const formattedDate = dueDate.toISOString().split('T')[0];

        // Patch form values
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          assignedTo: task.assignedTo,
          status: task.status,
          dueDate: formattedDate,
          priority: task.priority,
          comments: task.comments
        });

        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error loading task:', error);
        alert('Error loading task data. Please try again.');
        this.isSubmitting = false;
        this.router.navigate(['/tasks']);
      }
    });
  }

  /**
   * Handle form submission
   */
  // onSubmit(): void {
  //   if (this.taskForm.invalid) {
  //     this.markAllFieldsAsTouched();
  //     return;
  //   }

  //   this.isSubmitting = true;

  //   const formData = this.taskForm.value;
  //   const taskData = {
  //     ...formData,
  //     dueDate: new Date(formData.dueDate)
  //   };

  //   if (this.isEditMode && this.taskId) {
  //     // Update existing task
  //     this.taskService.updateTask(this.taskId, taskData).subscribe({
  //       next: () => {
  //         this.handleSuccess('Task updated successfully!');
  //       },
  //       error: (error) => {
  //         this.handleError(error, 'Error updating task. Please try again.');
  //       }
  //     });
  //   } else {
  //     // Create new task
  //     this.taskService.createTask(taskData).subscribe({
  //       next: () => {
  //         this.handleSuccess('Task created successfully!');
  //       },
  //       error: (error) => {
  //         this.handleError(error, 'Error creating task. Please try again.');
  //       }
  //     });
  //   }
  // }

  /**
   * Handle successful operation
   */
  private handleSuccess(message: string): void {
    alert(message);
    this.isSubmitting = false;
    this.router.navigate(['/tasks']);
  }

  /**
   * Handle error operation
   */
  private handleError(error: any, message: string): void {
    console.error('Operation error:', error);
    alert(message);
    this.isSubmitting = false;
  }

  /**
   * Mark all form fields as touched to show validation errors
   */
  private markAllFieldsAsTouched(): void {
    Object.keys(this.taskForm.controls).forEach(field => {
      const control = this.taskForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  /**
   * Reset the form
   */
  onReset(): void {
    if (this.isEditMode) {
      this.loadTaskForEdit(this.taskId!);
    } else {
      this.taskForm.reset({
        status: TaskStatus.NOT_STARTED,
        priority: TaskPriority.NORMAL
      });
    }
  }

  /**
   * Cancel and go back
   */
  onCancel(): void {
    if (this.taskForm.dirty) {
      const confirmLeave = confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmLeave) return;
    }
    this.router.navigate(['/tasks']);
  }

  /**
   * Form control getters for template
   */
  get title() { return this.taskForm.get('title'); }
  get description() { return this.taskForm.get('description'); }
  get assignedTo() { return this.taskForm.get('assignedTo'); }
  get status() { return this.taskForm.get('status'); }
  get dueDate() { return this.taskForm.get('dueDate'); }
  get priority() { return this.taskForm.get('priority'); }
  get comments() { return this.taskForm.get('comments'); }

  /**
   * Get validation error message for a field
   */
  getErrorMessage(fieldName: string): string {
    const control = this.taskForm.get(fieldName);

    if (control?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }

    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} must be at least ${requiredLength} characters`;
    }

    if (control?.hasError('maxlength')) {
      const requiredLength = control.errors?.['maxlength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} must not exceed ${requiredLength} characters`;
    }

    return 'Invalid value';
  }

  /**
   * Get field label for error messages
   */
  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'title': 'Title',
      'description': 'Description',
      'assignedTo': 'Assigned To',
      'status': 'Status',
      'dueDate': 'Due Date',
      'priority': 'Priority',
      'comments': 'Comments'
    };

    return labels[fieldName] || fieldName;
  }

  /**
   * Check if field has error and is touched
   */
  hasError(fieldName: string): boolean {
    const control = this.taskForm.get(fieldName);
    return control ? (control.invalid && control.touched) : false;
  }

  /**
   * Set due date to today
   */
  setDueDateToday(): void {
    const today = new Date().toISOString().split('T')[0];
    this.taskForm.patchValue({ dueDate: today });
  }

  /**
   * Set due date to tomorrow
   */
  setDueDateTomorrow(): void {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    this.taskForm.patchValue({ dueDate: tomorrowStr });
  }


 onSubmit(): void {
  if (this.taskForm.invalid) {
    this.markAllFieldsAsTouched();
    return;
  }

  this.isSubmitting = true;

  const formData = this.taskForm.value;

  // Format the data exactly like your task structure
  const taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
    title: formData.title,
    description: formData.description,
    assignedTo: formData.assignedTo,
    status: formData.status as TaskStatus,
    dueDate: new Date(formData.dueDate),
    priority: formData.priority as TaskPriority,
    comments: formData.comments || ''
  };

  console.log('Submitting task data:', taskData); // For debugging

  if (this.isEditMode && this.taskId) {
    // Update existing task
    this.taskService.updateTask(this.taskId, taskData).subscribe({
      next: (updatedTask) => {
        console.log('Task updated:', updatedTask);
        this.handleSuccess('Task updated successfully!');
      },
      error: (error) => {
        console.error('Update error:', error);
        this.handleError(error, 'Error updating task. Please try again.');
      }
    });
  } else {
    // Create new task
    this.taskService.createTask(taskData).subscribe({
      next: (createdTask) => {
        console.log('Task created:', createdTask);
        this.handleSuccess('Task created successfully!');
      },
      error: (error) => {
        console.error('Create error:', error);
        this.handleError(error, 'Error creating task. Please try again.');
      }
    });
  }
}
}
