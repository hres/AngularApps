import { Injectable } from '@angular/core';
import { Navigation, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor(private router: Router) { }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  navigateToWithExtra(path: string, stateData: {[propertyKey: string]: any}) {
    this.router.navigate([path], { state: stateData });
  }

  getStateData<T>(propertyKey: string): T {
    const currentNavigation: Navigation | null = this.router.getCurrentNavigation();
    if (currentNavigation && currentNavigation.extras.state) {
      return currentNavigation.extras.state[propertyKey] as T;
    }
    console.info(`Property '${propertyKey}' not found in state.`);
    return null;
  }
}
