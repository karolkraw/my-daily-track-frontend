import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  sections: String[] = [];
  sectionToAdd: String = "";

  constructor() {
    this.loadFromLocalStorage();
  }

  addSection() {
    this.sections.push(this.sectionToAdd);
    this.saveToLocalStorage();
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
}
