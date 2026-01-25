import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskDetailComponent } from './components/task-detail/task-detail.component';

const routes: Routes = [
  // Default route - Task List
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },

  // Task List
  { path: 'tasks', component: TaskListComponent },

  // Create New Task
  { path: 'new-task', component: TaskFormComponent },

  // Edit Task
  { path: 'tasks/edit/:id', component: TaskFormComponent },

  // Task Details
  { path: 'tasks/:id', component: TaskDetailComponent },

  // Wildcard route - redirect to tasks
  { path: '**', redirectTo: 'tasks' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
