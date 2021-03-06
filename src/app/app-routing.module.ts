import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./core/auth.guard";
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SecurityDashboardComponent } from './security/security-dashboard/security-dashboard.component';
import { SecurityFredComponent } from './security/security-fred/security-fred.component';
import { SecurityInspectionsComponent } from './security/security-inspections/security-inspections.component';
import { SecurityTasksComponent } from './security/security-tasks/security-tasks.component';
import { QualityDashboardComponent } from './quality/quality-dashboard/quality-dashboard.component';
import { QualityInspectionsComponent } from './quality/quality-inspections/quality-inspections.component';
import { QualityRestorationsComponent } from './quality/quality-restorations/quality-restorations.component';
import { QualityUpgradesComponent } from './quality/quality-upgrades/quality-upgrades.component';
import { QualityTasksComponent } from './quality/quality-tasks/quality-tasks.component';
import { MaintenanceDashboardComponent } from './maintenance/maintenance-dashboard/maintenance-dashboard.component';
import { SsggDashboardComponent } from './ssgg/ssgg-dashboard/ssgg-dashboard.component';
import { MaintenanceRequestsComponent } from './maintenance/maintenance-requests/maintenance-requests.component';
import { SsggRequestsComponent } from './ssgg/ssgg-requests/ssgg-requests.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { SystemGeneralAreaComponent } from './configuration/system/system-general-area/system-general-area.component';
import { UsersListComponent } from './configuration/users/users-list/users-list.component';
import { UsersComponent } from './configuration/users/users.component';
import { SystemComponent } from './configuration/system/system.component';
import { UsersPermitListComponent } from './configuration/users/users-permit-list/users-permit-list.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ConfigSecurityFredComponent } from './configuration/system/config-security-fred/config-security-fred.component';
import { ConfigQualityRedosComponent } from './configuration/system/config-quality-redos/config-quality-redos.component';
import { ConfigMaintenanceRequestsComponent } from './configuration/system/config-maintenance-requests/config-maintenance-requests.component';
import { ConfigSsggRequestsComponent } from './configuration/system/config-ssgg-requests/config-ssgg-requests.component';
import { ConfigurationNotificationsComponent } from './configuration/configuration-notifications/configuration-notifications.component';
import { ConfigNotificationsSecurityComponent } from './configuration/configuration-notifications/config-notifications-security/config-notifications-security.component';
import { ConfigNotificationsQualityComponent } from './configuration/configuration-notifications/config-notifications-quality/config-notifications-quality.component';
import { ConfigNotificationsMaintenanceComponent } from './configuration/configuration-notifications/config-notifications-maintenance/config-notifications-maintenance.component';
import { ConfigNotificationsSsggComponent } from './configuration/configuration-notifications/config-notifications-ssgg/config-notifications-ssgg.component';
import { ConfigSecurityInspectionsComponent } from './configuration/system/config-security-inspections/config-security-inspections.component';
import { ConfigCustomerComponent } from './configuration/system/system-general-area/config-customer/config-customer.component';

const routes: Routes = [
  
  { path: 'main', component: MainComponent, canActivate: [AuthGuard],
    children: [
      {
        path: '', redirectTo: '/main/dashboard', pathMatch: 'full'
      },
      {
        path: 'dashboard', component: DashboardComponent
      },
      {
        path: 'security/dashboard', component: SecurityDashboardComponent
      },
      {
        path: 'security/fred', component: SecurityFredComponent
      },
      {
        path: 'security/inspections', component: SecurityInspectionsComponent
      },
      {
        path: 'security/tasks', component: SecurityTasksComponent
      },
      {
        path: 'quality/dashboard', component: QualityDashboardComponent
      },
      {
        path: 'quality/inspections', component: QualityInspectionsComponent
      },
      {
        path: 'quality/restorations', component: QualityRestorationsComponent
      },
      {
        path: 'quality/upgrades', component: QualityUpgradesComponent
      },
      {
        path: 'quality/tasks', component: QualityTasksComponent
      },
      {
        path: 'maintenance/dashboard', component: MaintenanceDashboardComponent
      },
      {
        path: 'maintenance/requests', component: MaintenanceRequestsComponent
      },
      {
        path: 'ssgg/dashboard', component: SsggDashboardComponent
      },
      {
        path: 'ssgg/requests', component: SsggRequestsComponent
      },
      {
        path: 'configuration', component: ConfigurationComponent,
        children:[
          {
            path: '', component: UsersComponent
          },
          {
            path: 'users', component: UsersComponent,
            children:[
              {
                path: '', component: UsersListComponent
              },
              {
                path: 'list', component: UsersListComponent
              },
              {
                path: 'permits', component: UsersPermitListComponent
              },
            ]
          },
          {
            path: 'system', component: SystemComponent,
            children:[
              {
                path: '', component: SystemGeneralAreaComponent
              },
              {
                path: 'areas', component: SystemGeneralAreaComponent
              },
              {
                path: 'customers', component: ConfigCustomerComponent
              },
              {
                path: 'config-security-fred', component: ConfigSecurityFredComponent,
              },
              {
                path: 'config-security-inspections', component: ConfigSecurityInspectionsComponent,
              },
              {
                path: 'config-quality-redos', component: ConfigQualityRedosComponent,
              },
              {
                path: 'config-maintenance-requests', component: ConfigMaintenanceRequestsComponent,
              },
              {
                path: 'config-ssgg-requests', component: ConfigSsggRequestsComponent,
              }
            ]
          },
          {
            path: 'notifications', component: ConfigurationNotificationsComponent,
            children:[
              {
                path: '', component: ConfigNotificationsSecurityComponent
              },
              {
                path: 'config-notifications-security', component: ConfigNotificationsSecurityComponent,
              },
              {
                path: 'config-notifications-quality', component: ConfigNotificationsQualityComponent,
              },
              {
                path: 'config-notifications-maintenance', component: ConfigNotificationsMaintenanceComponent,
              },
              {
                path: 'config-notifications-ssgg', component: ConfigNotificationsSsggComponent,
              }
            ]
          }
        ]
      },
      {
        path: 'notifications', component: NotificationsComponent
      }
    ] 
  },
  { path: 'login', component: LoginComponent},
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: LoginComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
