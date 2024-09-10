import { Component, OnInit } from '@angular/core';
import { ReflectionService } from '../../services/reflections/reflection.service';
import { format } from 'date-fns';
import { ActivatedRoute } from '@angular/router';
import { Reflection } from '../../models/reflection.model';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-reflection',
  templateUrl: './reflection.component.html',
  styleUrls: ['./reflection.component.css'],
  providers: [DatePipe],
})
export class ReflectionComponent implements OnInit {
  sectionName!: string;
  currentDate: string = ''; // Formatted as YYYY-MM-DD
  textAreaContent: string = '';
  currentReflection: Reflection | null = null;
  historyReflections: Reflection[] = [];
  nextReflections: Reflection[] = [];
  previousReflections: Reflection[] = [];
  searchDate: Date | null = null;
  limit = 5;
  lastFetchedDate: string | null = null; // Track last fetched date for batching
  reflectionCount: number = 0;
  currentPage = 0;
  today: Date = new Date();

  constructor(private reflectionService: ReflectionService, private route: ActivatedRoute, private datePipe: DatePipe) {}

  async ngOnInit(): Promise<void> {
    this.sectionName = this.route.snapshot.paramMap.get('name') || '';
    this.currentDate = this.getFormattedCurrentDate();
    await this.loadCurrentReflection();
    this.loadInitialData();
  }

  getFormattedCurrentDate(): string {
    const now = new Date();
    const hours = now.getHours();

    // If the time is before 2 a.m., use the previous day, otherwise use the current day
    if (hours < 2) {
      now.setDate(now.getDate() - 1);
    }
  
    return this.formatDate(now);
  }

  formatDate(date: Date): string {
    return format(date, 'dd-MM-yyyy');
  }

  isActiveDate(reflectionDate: string): boolean {
    // Convert reflectionDate to Date object
    const reflectionDateObj = new Date(reflectionDate);
    // Compare reflectionDate with currentDate
    return this.formatDate(new Date()) === this.formatDate(reflectionDateObj);
  }

  isCurrentDate(): boolean {
    const today = this.formatDate(new Date());
    return this.currentDate === today;
  }

  onDateChange(event: any): void {
    const formattedDate = this.datePipe.transform(event.value, 'dd/MM/yyyy');
    this.searchDate = event.value ? new Date(formattedDate || '') : null;
  }

  async loadCurrentReflection(): Promise<void> {
    return new Promise((resolve, reject) => {
      const formattedDate = this.currentDate;
      this.reflectionService.getReflectionByDate(this.sectionName, formattedDate).subscribe(currentReflection => {
        if (currentReflection) {
          this.textAreaContent = currentReflection.content;
          this.currentReflection = currentReflection;
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
      this.historyReflections = reflections;
    });
  }

  saveReflection() {
    const formattedDate = this.currentDate;
    this.reflectionService.saveReflection(this.sectionName, formattedDate, this.textAreaContent!).subscribe(reflection => {
      this.textAreaContent = reflection.content;
    });
  }

  getReflectionByDate(created: string) {
    //this.currentDate = this.formatDate(new Date(created));
    this.currentDate = created;
    this.textAreaContent = this.historyReflections.find(a => a.created === created)?.content || '';
  }

  onScroll(event: any) {
    if (!this.canLoadMore()) {
      return;
    }
    const element = event.target;
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 1;

    if (atBottom) {
      this.currentPage++;
      this.loadHistoryReflections();
    }
  }

  loadHistoryReflections() {
    this.reflectionService.getReflections(this.sectionName, this.currentPage, 5).subscribe(newReflections => {
      this.historyReflections = [...this.historyReflections, ...newReflections];
    });
  }

  canLoadMore() {
    return this.historyReflections.length !== 0 && this.historyReflections.length < this.reflectionCount - 1;
  }

  contentEmpty(): boolean {
    return this.textAreaContent.trim() === "";
  }

  searchReflection(): void {
    this.reflectionService.getReflectionByDateSearch(this.sectionName, this.formatDate(this.searchDate!)).subscribe(
      reflection => {
        this.currentReflection = reflection;
        this.currentDate = this.formatDate(new Date(this.searchDate!));
        //this.searchDate = this.currentDate;
        this.loadNextBatch();
        this.loadPreviousBatch();
      },
      error => {
        console.error('No reflection found for this date');
      }
    );
  }

  loadNextBatch(): void {
    if (this.currentReflection) {
      this.lastFetchedDate = this.currentReflection.created;
      this.reflectionService.getNextBatch(this.sectionName, this.lastFetchedDate, this.limit).subscribe(
        reflections => {
          if (reflections.length) {
            this.nextReflections = reflections;
          } else {
            console.log('No more next reflections available');
          }
        }
      );
    }
  }

  loadPreviousBatch(): void {
    if (this.currentReflection) {
      this.lastFetchedDate = this.currentReflection.created;
      this.reflectionService.getPreviousBatch(this.sectionName, this.lastFetchedDate, this.limit).subscribe(
        reflections => {
          if (reflections.length) {
            this.previousReflections = reflections;
          } else {
            console.log('No more previous reflections available');
          }
        }
      );
    }
  }

  onNextClick(): void {
    if (this.nextReflections.length > 0) {
      this.previousReflections.unshift(this.currentReflection!); // Save current reflection to previous
      this.currentReflection = this.nextReflections.shift()!;
      if (this.nextReflections.length === 0) {
        this.loadNextBatch();
      }
    } else {
      console.log('No more next reflections available');
    }
  }

  onPreviousClick(): void {
    if (this.previousReflections.length > 0) {
      this.nextReflections.unshift(this.currentReflection!); // Save current reflection to next
      this.currentReflection = this.previousReflections.shift()!;
      if (this.previousReflections.length === 0) {
        this.loadPreviousBatch();
      }
    } else {
      console.log('No more previous reflections available');
    }
  }

  goToCurrent(): void {
    this.currentDate = this.getFormattedCurrentDate();
  }
}
