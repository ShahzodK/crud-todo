import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { TaskRes } from '../../models/tasksRes.model';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(public homeService: HomeService) {}

  public tasks!: TaskRes;
  public tasksLoaded = false;

  ngOnInit(): void {
      this.homeService.getTasks().subscribe((data) => {
        this.tasks = data;
        this.tasksLoaded = true;
      })
  }
}
