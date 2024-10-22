import { Component, OnInit } from '@angular/core';
import { ReflectionService } from '../../services/reflections/reflection.service';
import { format } from 'date-fns';
import { ActivatedRoute, Router } from '@angular/router';
import { Reflection } from '../../models/reflection.model';
import { DatePipe } from '@angular/common';
import { MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';
import { AuthService } from '../../services/auth/auth.service';


export const MY_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY', // Input format when parsing
  },
  display: {
    dateInput: 'DD/MM/YYYY',  // How it shows in the input field
    monthYearLabel: 'MMM YYYY', // Month and year at the top of the picker
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-reflection',
  templateUrl: './reflection.component.html',
  styleUrls: ['./reflection.component.css'],
  providers: [DatePipe,
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS } // Provide custom date formats
  ]
})
export class ReflectionComponent implements OnInit {
  sectionName!: string;
  currentDate: string = ''; // Formatted as YYYY-MM-DD
  currentHistoryDate: string = ''
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

  constructor(public authService: AuthService, private reflectionService: ReflectionService, private router: Router, 
    private route: ActivatedRoute, private datePipe: DatePipe) {}

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
    this.searchDate = event.value ? event.value : null;
    this.searchReflection();
  }

  async loadCurrentReflection(): Promise<void> {
    this.currentReflection = {
      content: "",
      created: this.currentDate
    };
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

    this.loadNextBatch();
    this.loadPreviousBatch();
  }

  saveReflection() {
    const formattedDate = this.currentDate;
    this.reflectionService.saveReflection(this.sectionName, formattedDate, this.textAreaContent!).subscribe(reflection => {
      this.textAreaContent = reflection.content;
    });
  }

  getReflectionByDate(created: string) {
    //this.currentDate = this.formatDate(new Date(created));
    this.currentHistoryDate = created;
    this.currentDate = created;
    this.textAreaContent = this.historyReflections.find(a => a.created === created)?.content || '';
    this.previousReflections = [];
    this.nextReflections = [];
    this.currentReflection!.created = this.currentDate
    this.currentReflection!.content = this.textAreaContent
    this.loadNextBatch();
    this.loadPreviousBatch();
  }

/*   searchReflection(): void {
    console.log(this.searchDate)
    this.reflectionService.getReflectionByDateSearch(this.sectionName, this.formatDate(this.searchDate!)).subscribe(
      reflection => {
        this.currentReflection = reflection;
        this.currentDate = this.formatDate(new Date(this.searchDate!));
        //this.searchDate = this.currentDate;
        this.previousReflections.reduce
        this.nextReflections.reduce
        this.loadNextBatch();
        this.loadPreviousBatch();
      },
      error => {
        console.error('No reflection found for this date');
      }
    );
  } */

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
        this.textAreaContent = this.historyReflections.find(a => a.created === this.currentDate)?.content || '';
        this.previousReflections.reduce
        this.nextReflections.reduce
        this.loadNextBatch();
        this.loadPreviousBatch();
      },
      error => {
        console.error('No reflection found for this date');
      }
    );
  }

  loadNextBatch(): void {
    if (this.currentReflection) 
      this.lastFetchedDate = this.currentReflection.created;
    else 
      this.lastFetchedDate = this.currentDate

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

  loadPreviousBatch(): void {
    if (this.currentReflection) 
      this.lastFetchedDate = this.currentReflection.created;
    else 
      this.lastFetchedDate = this.currentDate
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

  onNextClick(): void {
    if (this.nextReflections.length > 0) {
      this.previousReflections.unshift(this.currentReflection!); // Save current reflection to previous
      this.currentReflection = this.nextReflections.shift()!;
      if (this.currentReflection) {
        this.textAreaContent = this.currentReflection.content;
        this.currentDate = this.currentReflection.created;
      }
      if (this.nextReflections.length === 0) {
        this.loadNextBatch();
      }
    } else {
      console.log('No more next reflections available');
    }
  }

  onPreviousClick(): void {
    if (this.previousReflections.length > 0) {
      if(this.currentReflection)
        this.nextReflections.unshift(this.currentReflection!);

      this.currentReflection = this.previousReflections.shift()!;
      if (this.currentReflection) {
        this.textAreaContent = this.currentReflection.content;
        this.currentDate = this.currentReflection.created;
      }
      else {
        this.textAreaContent = ''
        this.currentDate = this.formatDate(new Date())
      }
      if (this.previousReflections.length === 0) {
        this.loadPreviousBatch();
        /* if (this.previousReflections.length == 0) {
          this.previousReflections.unshift(this.currentReflection!);
        } */
      }
    } else {
      console.log('No more previous reflections available');
    }
  }

  goToCurrent(): void {
    this.currentDate = this.getFormattedCurrentDate();
    this.currentReflection!.created = this.currentDate
    this.loadCurrentReflection();
    this.previousReflections = [];
    this.nextReflections = []
    this.loadNextBatch();
    this.loadPreviousBatch();
  }

  goToMainPage(): void {
    this.router.navigate([`section/${this.sectionName}`]);
  }

  goToSectionsPage(): void {
    this.router.navigate(['']);
  }
  
  logout(): void {
    this.authService.logout();
  }
}
