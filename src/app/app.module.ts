import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule here
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { SectionComponent } from './components/section/section.component';

const routes: Routes = [
  { path: '', component: MainComponent }, // Main component displayed at "/"
  { path: 'section/:id', component: SectionComponent }, // Section component displayed at "/section/:id"
  { path: '**', redirectTo: '' } // Redirect unknown routes to the main component
];

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SectionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }



