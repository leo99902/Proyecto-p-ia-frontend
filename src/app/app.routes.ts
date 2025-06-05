import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { FormRecordUserPagesComponent } from './pages/form.record.user.pages/form.record.user.pages.component';
import { HomeUserPagesComponent } from './pages/home.user.pages/home.user.pages.component';
import { FormLoginUserPagesComponent } from './pages/form.login.user.pages/form.login.user.pages.component';
import { User404PagesComponent } from './pages/user.404.pages/user.404.pages.component';
import { PatientsPageComponent } from './pages/patients.page/patients.page.component';
import { QuotesPagesComponent } from './pages/quotes.page/quotes.page';
import { authGuard } from './auth/auth.guard/auth.guard';

export const routes: Routes = [
    { path: '', component: FormLoginUserPagesComponent, title: 'Login' },
    { path: 'home', component: HomeUserPagesComponent, title: 'Inicio'},
    { path: 'usuarios', component: FormRecordUserPagesComponent, title: 'Usuarios'},
    { path: 'pacientes', component: PatientsPageComponent, title:'Pacientes' },
    { path: 'citas', component: QuotesPagesComponent, title: 'Citas' },
    { path: '**', component: User404PagesComponent, title: '404' }
];
