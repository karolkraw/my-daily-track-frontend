import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Section } from '../../models/section.model';
import { SectionService } from '../../services/section/section.service';

@Component({
  selector: 'app-main',
  templateUrl: './section.component.html',
  styleUrl: './section.component.css'
})
export class SectionComponent implements OnInit {
  sections: Section[] = [];
  sectionToAdd: String = "";
  nextId: number = 1;

  constructor(private sectionService: SectionService, private router: Router) {}

  ngOnInit(): void {
    this.loadSections()
  }

  loadSections() {
    this.sectionService.getSections().subscribe(
      (data: Section[]) => {
        this.sections = data;
      },
      error => {
        console.error('Error fetching sections data', error);
      }
    );
  }

  addSection() {
    const newSectionName = this.sectionToAdd.trim();
    if (newSectionName) {
        this.sectionService.addSection({ name: newSectionName }).subscribe(
          (data: Section) => {
            this.sections.push(data);
          },
          error => {
              console.error('Error adding section', error);
          }
        );
        this.sectionToAdd = '';
    }
  }

  viewSection(name: string) {
    this.router.navigate(['/section', name]);
  }
}
