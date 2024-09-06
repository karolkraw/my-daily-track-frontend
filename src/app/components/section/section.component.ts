import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Section } from '../../models/section.model';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css']
})
export class SectionComponent implements OnInit {
  sectionId!: number;
  sections: Section[] = [{id: 1, name: "Streak"}, {id: 2, name: "Reflections"}, {id: 3, name: "Ideas"}, 
                         {id: 4, name: "Goals"}, {id: 5, name: "To Do"}, {id: 6, name: "Planner"},];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.sectionId = +params.get('id')!;
    });
  }

  viewSection(id: number) {
    this.router.navigate(['/section', id]);
  }

}
