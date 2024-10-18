import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Area } from '../../models/area.model';

@Component({
  selector: 'app-section',
  templateUrl: './section-area.component.html',
  styleUrls: ['./section-area.component.css']
})
export class SectionAreaComponent implements OnInit {
  activeArea = false;
  sectionId!: number;
  areas: Area[] = [
    { id: 1, name: "Streak" },
    { id: 2, name: "Reflections" },
    //{ id: 3, name: "Ideas" },
    { id: 4, name: "Goals" },
    //{ id: 5, name: "To Do" },
    //{ id: 6, name: "Planner" }
  ];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.sectionId = +params.get('id')!;
    });
  }

  viewArea(areaName: string): void {
    this.router.navigate([areaName.toLowerCase()], { relativeTo: this.route });
  }

  goToSections(): void {
    this.router.navigate(['']);
  }
}
