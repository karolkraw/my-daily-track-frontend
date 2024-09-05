import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Section } from '../../models/section.model'; // Adjust path as needed

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css']
})
export class SectionComponent implements OnInit {
  sectionId!: number;
  section!: Section; // Define a section variable

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.sectionId = +params.get('id')!;
      // Fetch section details based on ID and assign to this.section
    });
  }
}
