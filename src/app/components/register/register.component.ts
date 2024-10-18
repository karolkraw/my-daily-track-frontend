import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  errorMessage: string = '';
  formSubmitted: boolean = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
   /*  if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']); 
    } */
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [
        Validators.required,
        //Validators.minLength(8),
        //(?=.*[a-z]): This is a positive lookahead assertion that checks if there is at least one lowercase letter in the string
        // (?=...) ensures that the enclosed pattern exists somewhere in the string without consuming characters, 
        // meaning the string doesn't move forward when this is checked.
        // +: This quantifier matches one or more of the preceding element (which is . in this case). 
        // Essentially, this ensures that the string must have at least one character.
        //Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).+$')
      ]]
    });
  }

  register(): void {
    this.formSubmitted = true;
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched(); // This will trigger the display of all validation errors
      return;
    }

    const { username, password } = this.registerForm.value;

    const user = { username, password };

    this.http.post('http://localhost:8080/api/register', user).subscribe(
      response => {
        this.router.navigate(['/auth/login']); // Navigate to login on successful registration
      },
      error => {
        this.errorMessage = 'Registration failed. Please try again.';
      }
    );
  }
}