import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Section } from '../../models/section.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  sections: Section[] = [];
  sectionToAdd: String = "";
  nextId: number = 1;

  constructor(private router: Router) {
    this.loadFromLocalStorage();
  }

  addSection() {
    if (this.sectionToAdd.trim()) {
      this.sections.push({ id: this.nextId++, name: this.sectionToAdd.trim() });
      this.sectionToAdd = '';
      this.saveToLocalStorage()
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('sections', JSON.stringify(this.sections));
  }

  private loadFromLocalStorage(): void {
    const savedSections = localStorage.getItem('sections');
    if (savedSections) {
      this.sections = JSON.parse(savedSections);
    }
  }

  viewSection(id: number) {
    this.router.navigate(['/section', id]);
  }
}
