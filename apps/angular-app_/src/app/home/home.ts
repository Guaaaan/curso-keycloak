import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Keycloak from 'keycloak-js';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private keycloak = inject(Keycloak);

  private http = inject(HttpClient);
  apiResponse: any = null;
  apiError: any = null;



callBackend() {

  const token = this.keycloak.token;

  if (!token) {
    this.apiError = 'No token available';
    return;
  }

  this.http.get('https://congenial-acorn-rx7v9q5w4wcw7vx-3000.app.github.dev/protected', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).subscribe({
    next: (res) => {
      this.apiResponse = res;
      this.apiError = null;
    },
    error: (err) => {
      this.apiError = err.error;
      this.apiResponse = null;
    }
  });
}

}
