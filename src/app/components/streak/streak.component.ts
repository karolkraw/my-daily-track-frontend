import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StreakService } from '../../services/streak/streak.service';
import { Streak } from '../../models/streak.model';

@Component({
  selector: 'app-streak',
  templateUrl: './streak.component.html',
  styleUrls: ['./streak.component.css']
})
export class StreakComponent implements OnInit {
  streaks: Streak[] = [];  // Array to hold multiple streaks
  sectionName!: string;
  newStreakName: string = '';  // Bind this to input for the streak's name
  newStreakDays: number = 0;  // Bind this to the input for streak days
  newStreakStartDate: string = new Date().toISOString().split('T')[0];  // Default to current date, but allow selection
  loading = false;

  constructor(private streakService: StreakService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Extract section name from the route parameters
    this.sectionName = this.route.snapshot.paramMap.get('name') || '';

    // Load existing streaks from service
    this.loadStreaks();
  }

  // Method to fetch existing streaks
  loadStreaks(): void {
    this.loading = true;
    this.streakService.getStreaks(this.sectionName).subscribe(
      (data: Streak[]) => {
        this.streaks = data;
        this.loading = false;
      },
      error => {
        console.error('Error fetching streak data', error);
        this.loading = false;
      }
    );
  }

  // Method to add a new streak
  addStreak(): void {
    if (this.newStreakName && this.newStreakDays > 0) {
      const newStreak: Streak = {
        name: this.newStreakName,
        days: this.newStreakDays,
        startDate: this.newStreakStartDate
      };

      // Add the new streak to the streaks array
      this.streaks.push(newStreak);

      // Optionally, you could call a backend service to save the new streak as well
      // this.streakService.addStreak(newStreak).subscribe();

      // Reset form fields after adding
      this.newStreakName = '';
      this.newStreakDays = 0;
      this.newStreakStartDate = new Date().toISOString().split('T')[0];  // Reset to current date
    } else {
      console.error('Please enter valid streak details.');
    }
  }
}
