import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SectionComponent } from './components/section/section.component';
import { SectionAreaComponent } from './components/section-area/section-area.component';
import { StreakComponent } from './components/streak/streak.component';
import { ReflectionComponent } from './components/reflections/reflection.component';


const routes: Routes = [
  { path: '', component: SectionComponent },
  { path: 'section/:name', component: SectionAreaComponent },
  { path: 'section/:name/streak', component: StreakComponent },
  { path: 'section/:name/reflections', component: ReflectionComponent },
  { path: 'section', component: SectionComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  declarations: [
    AppComponent,
    SectionComponent,
    SectionAreaComponent,
    StreakComponent,
    ReflectionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }



