import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StreakService } from '../../services/streak/streak.service';
import { Streak } from '../../models/streak.model';
import { AuthService } from '../../services/auth/auth.service';

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
  today = new Date().toISOString().split('T')[0];

  constructor(public authService: AuthService, private streakService: StreakService,
    private router: Router, private route: ActivatedRoute) {}

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
      const newStreak: Streak = {
        name: this.newStreakName,
        days: 1,
        startDate: this.today
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
    const isConfirmed = window.confirm(`Are you sure you want to delete the streak: "${name}"?`);
    if (isConfirmed) {
      this.streakService.deleteStreak(name, this.sectionName).subscribe(
        () => {
          this.streaks = this.streaks.filter(streak => streak.name !== name);
          this.loading = false;
        },
        error => {
          console.error('Error while deleting streak', error);
          this.loading = false;
        }
      );
    }
  }

  resetStreak(streakName: string): void {
    const isConfirmed = window.confirm(`Are you sure you want to reset the streak: "${streakName}"?`);
    if (isConfirmed) {
      const streak = this.streaks.find(s => s.name === streakName);
      this.streakService.resetStreak(streak!, this.sectionName).subscribe(
        () => {
          if (streak) {
            streak.days = 0;
            streak.startDate = this.today
          }
        }
      );
    }
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