import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TitleService {
  private readonly defaultTitle = 'Trackerjs';

  setTitleName(name: string) {
    document.title = name;
  }

  resetTitleName() {
    this.setTitleName(this.defaultTitle);
  }
}
