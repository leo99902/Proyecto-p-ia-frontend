import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { FormRecordUserPagesComponent } from './pages/form.record.user.pages/form.record.user.pages.component';
import { HomeUserPagesComponent } from './pages/home.user.pages/home.user.pages.component';

export const routes: Routes = [
    { path: 'home', component: HomeUserPagesComponent },
    { path: 'usuarios', component: FormRecordUserPagesComponent}
];
