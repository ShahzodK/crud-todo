import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CreateTaskModalComponent } from './components/create-task-modal/create-task-modal.component';
import { DeleteTaskModalComponent } from './components/delete-task-modal/delete-task-modal.component';
import { EditTaskModalComponent } from './components/edit-task-modal/edit-task-modal.component';



@NgModule({
  declarations: [
    HomePageComponent,
    CreateTaskModalComponent,
    DeleteTaskModalComponent,
    EditTaskModalComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule
  ]
})
export class HomeModule { }
