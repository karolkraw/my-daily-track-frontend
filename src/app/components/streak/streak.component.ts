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
  streaks: Streak[] = [];
  sectionName!: string;
  newStreakName: string = '';
  loading = false;

  constructor(private streakService: StreakService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.sectionName = this.route.snapshot.paramMap.get('name') || '';
    this.loadStreaks();
  }

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

  createStreak(): void {
    if (this.newStreakName) {
      const today = new Date().toISOString().split('T')[0];

      const newStreak: Streak = {
        name: this.newStreakName,
        days: 1,
        startDate: today
      };

      this.streakService.createStreak(newStreak, this.sectionName).subscribe(
        (data: Streak) => {
          this.streaks.push(data);
          this.loading = false;
          this.newStreakName = '';
        },
        error => {
          console.error('Error creating streak', error);
          this.loading = false;
        }
      );   
      this.newStreakName = '';
    } else {
      console.error('Please enter a valid streak name.');
    }
  }

  deleteStreak(name: string): void {
    this.streakService.deleteStreak(name).subscribe(
      () => {
        this.streaks = this.streaks.filter(streak => streak.name !== name);
        this.loading = false;
      },
      error => {
        console.error('Error dele streak', error);
        this.loading = false;
      }
    );
  }
}