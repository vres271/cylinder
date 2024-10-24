import { Routes } from '@angular/router';
import { DPKVComponent } from './pages/dpkv/dpkv.component';
import { SettingsComponent } from './pages/settings/settings.component';

export enum RouterPath {
  Settings = 'settings',
  DPKV = 'dpkv',
}

export const routes: Routes = [
  { path: RouterPath.Settings, component: SettingsComponent },
  { path: RouterPath.DPKV, component: DPKVComponent },
];

