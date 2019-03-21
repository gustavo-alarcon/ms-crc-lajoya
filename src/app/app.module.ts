import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

// ANGULAR MODULES
import { AppRoutingModule } from './/app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { HttpClientModule } from '@angular/common/http';


// CRC SERVICES
import { AuthService } from './core/auth.service';
import { DatabaseService } from './core/database.service';

// THIRD PARTY PACKAGES
import { TimeAgoPipe } from 'time-ago-pipe';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';


// FIREBASE MODULES
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule, StorageBucket } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

// MATERIAL DESIGN COMPONENTS
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion'
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatStepperModule } from '@angular/material/stepper';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';


// ANGULAR COMPONENTS
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { environment } from 'src/environments/environment';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SecurityDashboardComponent } from './security/security-dashboard/security-dashboard.component';
import { SecurityFredComponent } from './security/security-fred/security-fred.component';
import { SecurityInspectionsComponent } from './security/security-inspections/security-inspections.component';
import { SecurityTasksComponent } from './security/security-tasks/security-tasks.component';
import { QualityDashboardComponent } from './quality/quality-dashboard/quality-dashboard.component';
import { QualityRestorationsComponent } from './quality/quality-restorations/quality-restorations.component';
import { QualityUpgradesComponent } from './quality/quality-upgrades/quality-upgrades.component';
import { QualityInspectionsComponent } from './quality/quality-inspections/quality-inspections.component';
import { QualityTasksComponent } from './quality/quality-tasks/quality-tasks.component';
import { MaintenanceDashboardComponent } from './maintenance/maintenance-dashboard/maintenance-dashboard.component';
import { MaintenanceRequestsComponent } from './maintenance/maintenance-requests/maintenance-requests.component';
import { SsggDashboardComponent } from './ssgg/ssgg-dashboard/ssgg-dashboard.component';
import { SsggRequestsComponent } from './ssgg/ssgg-requests/ssgg-requests.component';
import { ShowNotificationsComponent } from './notifications/show-notifications/show-notifications.component';
import { SaveFredAsTaskComponent } from './security/security-fred/save-fred-as-task/save-fred-as-task.component';
import { FredConfirmSaveComponent } from './security/security-fred/fred-confirm-save/fred-confirm-save.component';
import { RestorationConfirmSaveComponent } from './quality/quality-restorations/restoration-confirm-save/restoration-confirm-save.component';
import { SaveRestorationAsTaskComponent } from './quality/quality-restorations/save-restoration-as-task/save-restoration-as-task.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { SystemGeneralAreaComponent } from './configuration/system/system-general-area/system-general-area.component';
import { UsersListComponent } from './configuration/users/users-list/users-list.component';
import { UsersPermitListComponent } from './configuration/users/users-permit-list/users-permit-list.component';
import { UsersComponent } from './configuration/users/users.component';
import { SystemComponent } from './configuration/system/system.component';
import { CreateNewUserComponent } from './configuration/users/users-list/create-new-user/create-new-user.component';
import { CreateNewAreaComponent } from './configuration/system/system-general-area/create-new-area/create-new-area.component';
import { FredListComponent } from './security/security-fred/fred-list/fred-list.component';
import { CreateNewPermitComponent } from './configuration/users/users-permit-list/create-new-permit/create-new-permit.component';
import { AddInspectionComponent } from './security/security-inspections/add-inspection/add-inspection.component';
import { AddObservationToInspectionComponent } from './security/security-inspections/add-observation-to-inspection/add-observation-to-inspection.component';
import { InspectionObservationConfirmSaveComponent } from './security/security-inspections/add-observation-to-inspection/inspection-observation-confirm-save/inspection-observation-confirm-save.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { FredConfirmDeleteComponent } from './security/security-fred/fred-confirm-delete/fred-confirm-delete.component';
import { FredEditDialogComponent } from './security/security-fred/fred-edit-dialog/fred-edit-dialog.component';
import { FredConfirmEditComponent } from './security/security-fred/fred-confirm-edit/fred-confirm-edit.component';
import { SecurityInspectionConfirmDeleteComponent } from './security/security-inspections/security-inspection-confirm-delete/security-inspection-confirm-delete.component';
import { SecurityInspectionObservationConfirmDeleteComponent } from './security/security-inspections/security-inspection-observation-confirm-delete/security-inspection-observation-confirm-delete.component';
import { SecurityInspectionConfirmTerminationComponent } from './security/security-inspections/security-inspection-confirm-termination/security-inspection-confirm-termination.component';





@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    DashboardComponent,
    SecurityDashboardComponent,
    SecurityFredComponent,
    SecurityInspectionsComponent,
    SecurityTasksComponent,
    QualityDashboardComponent,
    QualityRestorationsComponent,
    QualityUpgradesComponent,
    QualityInspectionsComponent,
    QualityTasksComponent,
    MaintenanceDashboardComponent,
    MaintenanceRequestsComponent,
    SsggDashboardComponent,
    SsggRequestsComponent,
    ShowNotificationsComponent,
    SaveFredAsTaskComponent,
    FredConfirmSaveComponent,
    RestorationConfirmSaveComponent,
    SaveRestorationAsTaskComponent,
    ConfigurationComponent,
    SystemGeneralAreaComponent,
    UsersListComponent,
    UsersPermitListComponent,
    UsersComponent,
    SystemComponent,
    CreateNewUserComponent,
    CreateNewAreaComponent,
    FredListComponent,
    CreateNewPermitComponent,
    AddInspectionComponent,
    AddObservationToInspectionComponent,
    InspectionObservationConfirmSaveComponent,
    TimeAgoPipe,
    NotificationsComponent,
    FredConfirmDeleteComponent,
    FredEditDialogComponent,
    FredConfirmEditComponent,
    SecurityInspectionConfirmDeleteComponent,
    SecurityInspectionObservationConfirmDeleteComponent,
    SecurityInspectionConfirmTerminationComponent
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ChartsModule,
    HttpClientModule,
    NgxPageScrollModule,
    NgxPageScrollCoreModule,
    AngularFireModule.initializeApp(environment.firebase, 'ms-crc-lajoya'),
    AngularFirestoreModule.enablePersistence(),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    MatProgressBarModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatBadgeModule,
    MatSidenavModule,
    MatExpansionModule,
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatListModule,
    MatRippleModule,
    MatTooltipModule,
    MatStepperModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatTabsModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCardModule,
    MatSliderModule
  ],
  providers: [
    AuthService,
    DatabaseService,
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true }
    }
  ],
  entryComponents: [
    ShowNotificationsComponent,
    FredConfirmSaveComponent,
    SaveFredAsTaskComponent,
    RestorationConfirmSaveComponent,
    SaveRestorationAsTaskComponent,
    CreateNewUserComponent,
    CreateNewAreaComponent,
    CreateNewPermitComponent,
    AddInspectionComponent,
    AddObservationToInspectionComponent,
    InspectionObservationConfirmSaveComponent,
    FredConfirmDeleteComponent,
    FredEditDialogComponent,
    FredConfirmEditComponent,
    SecurityInspectionConfirmDeleteComponent,
    SecurityInspectionObservationConfirmDeleteComponent,
    SecurityInspectionConfirmTerminationComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
