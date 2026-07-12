import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather.html',
  styleUrl: './weather.css'
})
export class Weather implements OnInit {
  private weatherService = inject(WeatherService);

  forecasts = signal<any[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.fetchWeather();
  }

  fetchWeather(): void {
    this.loading.set(true);
    this.error.set(null);

    this.weatherService.getForecast().subscribe({
      next: (data: any) => {
        const days = data.daily.time;
        const tempsC = data.daily.temperature_2m_max;
        const codes = data.daily.weathercode;

        const mapped = days.map((date: string, i: number) => {
          const tempC = tempsC[i];
          const tempF = (tempC * 9) / 5 + 32;
          return {
            date: date,
            tempC: tempC,
            tempF: Math.round(tempF * 10) / 10,
            summary: this.mapWeatherCode(codes[i])
          };
        });

        this.forecasts.set(mapped);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load weather data.');
        this.loading.set(false);
      }
    });
  }

  private mapWeatherCode(code: number): string {
    const map: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      51: 'Light drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      80: 'Rain showers',
      95: 'Thunderstorm'
    };
    return map[code] || 'Unknown';
  }

  refresh(): void {
    this.fetchWeather();
  }
}
