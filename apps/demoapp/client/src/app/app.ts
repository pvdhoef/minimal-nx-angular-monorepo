import { Component, Input, forwardRef } from '@angular/core';
import { RouterModule } from '@angular/router';

import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';

@Component({
    imports: [
        RouterModule,
        MatIconModule,
        MatDividerModule,
        MatButtonModule,
        forwardRef(() => GreetingComponent)
    ],
    selector: 'app-root',
    templateUrl: './app.html',
    styleUrl: './app.sass',
})
export class App {
    protected title = 'demoapp';

    // readonly i18nMessage = $localize`Nederlands is de taal van de toekomst!`;
    readonly i18nMessage = "Dit wordt *NIET* vertaald!";
}

@Component({
    selector: 'app-greeting',
    template: `<p>{{ message }}</p>`,
})
export class GreetingComponent {
    @Input({required: true}) message!: string;
}
