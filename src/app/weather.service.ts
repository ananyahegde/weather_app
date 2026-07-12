import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) { }

  getForecast(): Observable<any> {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=12.97&longitude=77.59&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto';
    return this.http.get(url);
  }
}
