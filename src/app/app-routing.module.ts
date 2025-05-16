import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { routes } from './app.routes';

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

@NgModule({
  imports: [
    // ...otros módulos
    AppRoutingModule
  ],
  // ...otros metadatos
})
export class AppModule {}