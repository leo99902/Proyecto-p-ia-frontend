import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { FormRecordUserPagesComponent } from './pages/form.record.user.pages/form.record.user.pages.component';
import { HomeUserPagesComponent } from './pages/home.user.pages/home.user.pages.component';
import { FormLoginUserPagesComponent } from './pages/form.login.user.pages/form.login.user.pages.component';
import { User404PagesComponent } from './pages/user.404.pages/user.404.pages.component';
import { PatientsPageComponent } from './pages/patients.page/patients.page.component';
import { QuotesPagesComponent } from './pages/quotes.page/quotes.page';
// Importa el guard
import { authGuard } from './auth/auth.guard/auth.guard';
import { GamesPatientsPageComponent } from './pages/games.patients.page/games.patients.page.component';

export const routes: Routes = [
    { path: '', component: FormLoginUserPagesComponent, title: 'ATI' },
    { path: 'home', component: HomeUserPagesComponent, title: 'ATI', canActivate: [authGuard] },
    { path: 'usuarios', component: FormRecordUserPagesComponent, title: 'ATI', canActivate: [authGuard] },
    { path: 'pacientes', component: PatientsPageComponent, title: 'ATI', canActivate: [authGuard] },
    { path: 'citas', component: QuotesPagesComponent, title: 'ATI', canActivate: [authGuard] },
    { path: 'juegos', component: GamesPatientsPageComponent, title: 'ATI', canActivate: [authGuard] },
    { path: '**', component: User404PagesComponent, title: 'ATI' }
];