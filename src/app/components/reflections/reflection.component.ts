import { Component, OnInit } from '@angular/core';
import { ReflectionService } from '../../services/reflections/reflection.service';
import { format } from 'date-fns';
import { ActivatedRoute } from '@angular/router';
import { Reflection } from '../../models/reflection.model';


@Component({
  selector: 'app-reflection',
  templateUrl: './reflection.component.html',
  styleUrls: ['./reflection.component.css']
})
export class ReflectionComponent implements OnInit {
  sectionName!: string;
  currentDate: string = '';
  currentReflectionContent: string = '';
  previousReflections: Reflection[] = [];
  reflectionCount: number = 0;
  currentPage = 0;

  constructor(private reflectionService: ReflectionService, private route: ActivatedRoute) {}

  async ngOnInit(): Promise<void> {
    this.sectionName = this.route.snapshot.paramMap.get('name') || '';
    this.currentDate = this.getDisplayDate();
    await this.loadCurrentReflection();
    this.loadInitialData();
  }

  getDisplayDate(): string {
    const now = new Date();
    const hours = now.getHours();
  
    // If the time is before 2 a.m., use the previous day, otherwise use the current day (so I can edit after midnight)
    if (hours < 2) {
      now.setDate(now.getDate() - 1);
    }
    return this.formatDate(now);
  }

  formatDate(date: Date): string {
    return format(date, 'dd-MM-yyyy');
  }

  async loadCurrentReflection(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.reflectionService.getReflectionByDate(this.sectionName, this.currentDate).subscribe(currentReflection => {
        if (currentReflection) {
          this.currentReflectionContent = currentReflection.content;
        }
        resolve(); // Resolve after the HTTP call completes
      }, reject); // Reject in case of an error
    });
}

   loadInitialData(): void {
    this.reflectionService.getReflectionCount(this.sectionName).subscribe(reflectionCount => {
      this.reflectionCount = reflectionCount;
    });

    this.reflectionService.getReflections(this.sectionName, 0, 10).subscribe(reflections => {
      this.currentPage++;
      this.previousReflections = reflections.filter(reflection => reflection.created !== this.formatDate(new Date()))
    });
  }

  saveReflection() {
    this.reflectionService.saveReflection(this.sectionName, this.currentDate, this.currentReflectionContent!).subscribe(reflection => {
      this.currentReflectionContent = reflection.content;
    });
  }

  getReflectionByDate(created: string) {
    this.currentDate = created;
    this.currentReflectionContent = this.previousReflections?.find(a => a.created === created)?.content || '';
  }

 /*  loadMoreReflections(): void {
    if (this.loading || this.previousReflections.length >= this.totalReflections) {
      return;
    }

    this.loading = true;
    this.reflectionService.getPreviousDates(this.currentPage).subscribe(newDates => {
      this.previousDates = [...this.previousDates, ...newDates];
      this.currentPage++;
      this.loading = false;
    });
  } */

  onScroll(event: any) {
    if (!this.canLoadMore()) {
      return;
    }
    const element = event.target;
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 1;
  
    if (atBottom) {
      this.currentPage++;
      this.loadPreviousReflections();
    }
  }

  loadPreviousReflections() {
    this.reflectionService.getReflections(this.sectionName, this.currentPage, 5).subscribe(newReflections => {
      this.previousReflections = [...this.previousReflections, ...newReflections];
    });
  }

  canLoadMore() {
    return this.previousReflections.length !== 0 && this.previousReflections.length < this.reflectionCount - 1;
  }

  isCurrentDate(): boolean {
    const today = this.formatDate(new Date());
    return this.currentDate === today;
  }

  contentEmpty(): boolean {
    return this.currentReflectionContent.trim() === ""
  }
}
