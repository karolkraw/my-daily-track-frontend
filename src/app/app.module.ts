import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { AppComponent } from './app.component';
import { SectionComponent } from './components/section/section.component';
import { SectionAreaComponent } from './components/section-area/section-area.component';
import { StreakComponent } from './components/streak/streak.component';
import { ReflectionComponent } from './components/reflections/reflection.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TaskManagerComponent } from './components/task-manager/task-manager.component';
import { LoginComponent } from './components/login/login.component';
import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component';
import { UnauthenticatedGuard } from './guards/unauthenticated.guard';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { TokenInterceptor } from './interceptors/token.interceptor';


const routes: Routes = [
   {
    path: 'auth',
    component: AuthLayoutComponent,
    //canActivate: [UnauthenticatedGuard], // Protect these routes
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' } // No guard needed here
    ]
  }, 
  { path: '', component: SectionComponent },
  { path: 'section', component: SectionComponent, canActivate: [AuthGuard] },
  { path: 'section/:name', component: SectionAreaComponent, canActivate: [AuthGuard] },
  { path: 'section/:name/streak', component: StreakComponent, canActivate: [AuthGuard] },
  { path: 'section/:name/reflections', component: ReflectionComponent, canActivate: [AuthGuard] },
  { path: 'section/:name/goals', component: TaskManagerComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }, 
];

@NgModule({
  declarations: [
    AppComponent,
    SectionComponent,
    SectionAreaComponent,
    StreakComponent,
    ReflectionComponent,
    TaskManagerComponent,
    LoginComponent,
    AuthLayoutComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideAnimationsAsync(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }



