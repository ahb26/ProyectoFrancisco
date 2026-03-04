import { Component } from '@angular/core';
import { Routes } from '@angular/router';

@Component({
	selector: 'app-ruta-vacia',
	template: '',
})
class RutaVaciaComponent {}

export const routes: Routes = [
	{
		path: '',
		component: RutaVaciaComponent,
	},
	{
		path: '**',
		redirectTo: '',
	},
];
