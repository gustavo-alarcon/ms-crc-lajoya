import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

// ANGULAR MODULES
import { AppRoutingModule } from './/app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { HttpClientModule } from '@angular/common/http';

// ANGULAR PIPES
import { DatePipe } from '@angular/common';


// CRC SERVICES
import { AuthService } from './core/auth.service';
import { DatabaseService } from './core/database.service';
import { SidenavService } from './core/sidenav.service';

// THIRD PARTY PACKAGES
import { TimeAgoPipe } from 'time-ago-pipe';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { PushNotificationsModule } from 'ng-push';
import { Angular2CsvModule } from 'angular2-csv';


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
import { MatChipsModule } from '@angular/material/chips';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';



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
import { SecurityTasksDialogProgressComponent } from './security/security-tasks/security-tasks-dialog-progress/security-tasks-dialog-progress.component';
import { SecurityTasksConfirmSaveComponent } from './security/security-tasks/security-tasks-confirm-save/security-tasks-confirm-save.component';
import { QualityAddInspectionComponent } from './quality/quality-inspections/quality-add-inspection/quality-add-inspection.component';
import { QualityAddObservationToInspectionComponent } from './quality/quality-inspections/quality-add-observation-to-inspection/quality-add-observation-to-inspection.component';
import { QualityInspectionConfirmTerminationComponent } from './quality/quality-inspections/quality-inspection-confirm-termination/quality-inspection-confirm-termination.component';
import { QualityInspectionConfirmDeleteComponent } from './quality/quality-inspections/quality-inspection-confirm-delete/quality-inspection-confirm-delete.component';
import { QualityInspectionObservationConfirmDeleteComponent } from './quality/quality-inspections/quality-inspection-observation-confirm-delete/quality-inspection-observation-confirm-delete.component';
import { MaintenanceRequestsConfirmSaveComponent } from './maintenance/maintenance-requests/maintenance-requests-confirm-save/maintenance-requests-confirm-save.component';
import { MaintenanceRequestsConfirmDeleteComponent } from './maintenance/maintenance-requests/maintenance-requests-confirm-delete/maintenance-requests-confirm-delete.component';
import { MaintenanceRequestsDialogEditComponent } from './maintenance/maintenance-requests/maintenance-requests-dialog-edit/maintenance-requests-dialog-edit.component';
import { MaintenanceRequestsConfirmEditComponent } from './maintenance/maintenance-requests/maintenance-requests-confirm-edit/maintenance-requests-confirm-edit.component';
import { MaintenanceRequestsDialogTaskComponent } from './maintenance/maintenance-requests/maintenance-requests-dialog-task/maintenance-requests-dialog-task.component';
import { MaintenanceRequestsConfirmTaskComponent } from './maintenance/maintenance-requests/maintenance-requests-confirm-task/maintenance-requests-confirm-task.component';
import { SsggRequestsConfirmSaveComponent } from './ssgg/ssgg-requests/ssgg-requests-confirm-save/ssgg-requests-confirm-save.component';
import { SsggRequestsConfirmDeleteComponent } from './ssgg/ssgg-requests/ssgg-requests-confirm-delete/ssgg-requests-confirm-delete.component';
import { SsggRequestsConfirmEditComponent } from './ssgg/ssgg-requests/ssgg-requests-confirm-edit/ssgg-requests-confirm-edit.component';
import { SsggRequestsConfirmTaskComponent } from './ssgg/ssgg-requests/ssgg-requests-confirm-task/ssgg-requests-confirm-task.component';
import { SsggRequestsDialogEditComponent } from './ssgg/ssgg-requests/ssgg-requests-dialog-edit/ssgg-requests-dialog-edit.component';
import { SsggRequestsDialogTaskComponent } from './ssgg/ssgg-requests/ssgg-requests-dialog-task/ssgg-requests-dialog-task.component';
import { QualityRedoReportDialogCreateComponent } from './quality/quality-restorations/quality-redo-report-dialog-create/quality-redo-report-dialog-create.component';
import { QualityRedoReportConfirmCreateComponent } from './quality/quality-restorations/quality-redo-report-confirm-create/quality-redo-report-confirm-create.component';
import { QualityRedoReportDialogEditComponent } from './quality/quality-restorations/quality-redo-report-dialog-edit/quality-redo-report-dialog-edit.component';
import { QualityRedoReportConfirmEditComponent } from './quality/quality-restorations/quality-redo-report-confirm-edit/quality-redo-report-confirm-edit.component';
import { QualityRedoReportConfirmDeleteComponent } from './quality/quality-restorations/quality-redo-report-confirm-delete/quality-redo-report-confirm-delete.component';
import { QualityRedoReportDialogAnalyzeComponent } from './quality/quality-restorations/quality-redo-report-dialog-analyze/quality-redo-report-dialog-analyze.component';
import { QualityRedoReportConfirmAnalyzeComponent } from './quality/quality-restorations/quality-redo-report-confirm-analyze/quality-redo-report-confirm-analyze.component';
import { QualityRedoReportDialogActionsComponent } from './quality/quality-restorations/quality-redo-report-dialog-actions/quality-redo-report-dialog-actions.component';
import { QualityRedoReportConfirmActionsComponent } from './quality/quality-restorations/quality-redo-report-confirm-actions/quality-redo-report-confirm-actions.component';
import { QualityRedoReportConfirmClosedComponent } from './quality/quality-restorations/quality-redo-report-confirm-closed/quality-redo-report-confirm-closed.component';
import { QualityRedoReportDialogClosedComponent } from './quality/quality-restorations/quality-redo-report-dialog-closed/quality-redo-report-dialog-closed.component';
import { QualityRedoAnalyzePicturesComponent } from './quality/quality-restorations/quality-redo-analyze-pictures/quality-redo-analyze-pictures.component';
import { QualityRedoAnalyzeDialogEditComponent } from './quality/quality-restorations/quality-redo-analyze-dialog-edit/quality-redo-analyze-dialog-edit.component';
import { QualityRedoAnalyzeConfirmEditComponent } from './quality/quality-restorations/quality-redo-analyze-confirm-edit/quality-redo-analyze-confirm-edit.component';
import { QualityRedoAnalyzeConfirmDeleteComponent } from './quality/quality-restorations/quality-redo-analyze-confirm-delete/quality-redo-analyze-confirm-delete.component';
import { QualityRedoAnalyzeDialogDeleteComponent } from './quality/quality-restorations/quality-redo-analyze-dialog-delete/quality-redo-analyze-dialog-delete.component';
import { QualityRedoAnalyzeDialogActionsComponent } from './quality/quality-restorations/quality-redo-analyze-dialog-actions/quality-redo-analyze-dialog-actions.component';
import { QualityRedoAnalyzeConfirmActionsComponent } from './quality/quality-restorations/quality-redo-analyze-confirm-actions/quality-redo-analyze-confirm-actions.component';
import { QualityRedoActionsConfirmDeleteActionComponent } from './quality/quality-restorations/quality-redo-actions-confirm-delete-action/quality-redo-actions-confirm-delete-action.component';
import { QualityRedoActionsDialogAddActionsComponent } from './quality/quality-restorations/quality-redo-actions-dialog-add-actions/quality-redo-actions-dialog-add-actions.component';
import { QualityRedoActionsConfirmAddActionsComponent } from './quality/quality-restorations/quality-redo-actions-confirm-add-actions/quality-redo-actions-confirm-add-actions.component';
import { QualityRedoActionsConfirmApproveActionsComponent } from './quality/quality-restorations/quality-redo-actions-confirm-approve-actions/quality-redo-actions-confirm-approve-actions.component';
import { QualityTasksDialogFinalizeComponent } from './quality/quality-tasks/quality-tasks-dialog-finalize/quality-tasks-dialog-finalize.component';
import { QualityTasksConfirmFinalizeComponent } from './quality/quality-tasks/quality-tasks-confirm-finalize/quality-tasks-confirm-finalize.component';
import { QualityRedoActionsConfirmValidateComponent } from './quality/quality-restorations/quality-redo-actions-confirm-validate/quality-redo-actions-confirm-validate.component';
import { QualityRedoActionsConfirmResetComponent } from './quality/quality-restorations/quality-redo-actions-confirm-reset/quality-redo-actions-confirm-reset.component';
import { QualityRedoActionsDialogRequestClosingComponent } from './quality/quality-restorations/quality-redo-actions-dialog-request-closing/quality-redo-actions-dialog-request-closing.component';
import { ConfigSecurityFredComponent } from './configuration/system/config-security-fred/config-security-fred.component';
import { ConfigQualityRedosComponent } from './configuration/system/config-quality-redos/config-quality-redos.component';
import { QualityRedosActionsConfirmRequestClosingComponent } from './quality/quality-restorations/quality-redos-actions-confirm-request-closing/quality-redos-actions-confirm-request-closing.component';
import { QualityRedosActionsConfirmResendComponent } from './quality/quality-restorations/quality-redos-actions-confirm-resend/quality-redos-actions-confirm-resend.component';
import { ConfigurationNotificationsComponent } from './configuration/configuration-notifications/configuration-notifications.component';
import { ConfigNotificationsSecurityComponent } from './configuration/configuration-notifications/config-notifications-security/config-notifications-security.component';
import { ConfigNotificationsQualityComponent } from './configuration/configuration-notifications/config-notifications-quality/config-notifications-quality.component';
import { ConfigNotificationsMaintenanceComponent } from './configuration/configuration-notifications/config-notifications-maintenance/config-notifications-maintenance.component';
import { ConfigNotificationsSsggComponent } from './configuration/configuration-notifications/config-notifications-ssgg/config-notifications-ssgg.component';
import { SystemaGeneralAreaConfirmDeleteComponent } from './configuration/system/system-general-area/systema-general-area-confirm-delete/systema-general-area-confirm-delete.component';
import { QualityRedosClosingConfirmClosingComponent } from './quality/quality-restorations/quality-redos-closing-confirm-closing/quality-redos-closing-confirm-closing.component';
import { UsersDialogAssignAreaComponent } from './configuration/users/users-dialog-assign-area/users-dialog-assign-area.component';
import { UsersPermitConfirmDeleteComponent } from './configuration/users-permit-list/users-permit-confirm-delete/users-permit-confirm-delete.component';
import { UsersPermitDialogEditComponent } from './configuration/users-permit-list/users-permit-dialog-edit/users-permit-dialog-edit.component';
import { UsersPermitConfirmEditComponent } from './configuration/users-permit-list/users-permit-confirm-edit/users-permit-confirm-edit.component';
import { ConfigMaintenanceRequestsComponent } from './configuration/system/config-maintenance-requests/config-maintenance-requests.component';
import { ConfigSsggRequestsComponent } from './configuration/system/config-ssgg-requests/config-ssgg-requests.component';
import { ConfigSecurityInspectionsComponent } from './configuration/system/config-security-inspections/config-security-inspections.component';
import { ConfigEditUserComponent } from './configuration/users/users-list/config-edit-user/config-edit-user.component';
import { ConfigDeleteUserComponent } from './configuration/users/config-delete-user/config-delete-user.component';
import { QualityConfirmAddObservationComponent } from './quality/quality-inspections/quality-confirm-add-observation/quality-confirm-add-observation.component';
import { QualityDialogAddSingleObservationComponent } from './quality/quality-inspections/quality-dialog-add-single-observation/quality-dialog-add-single-observation.component';
import { QualityConfirmAddSingleObservationComponent } from './quality/quality-inspections/quality-confirm-add-single-observation/quality-confirm-add-single-observation.component';
import { QualityConfirmDeleteSingleObservationComponent } from './quality/quality-inspections/quality-confirm-delete-single-observation/quality-confirm-delete-single-observation.component';
import { QualityTasksDialogFinalizeObservationComponent } from './quality/quality-tasks/quality-tasks-dialog-finalize-observation/quality-tasks-dialog-finalize-observation.component';
import { QualityTasksConfirmFinalizeObservationComponent } from './quality/quality-tasks/quality-tasks-confirm-finalize-observation/quality-tasks-confirm-finalize-observation.component';
import { QualityTasksDialogFinalizeInspectionComponent } from './quality/quality-tasks/quality-tasks-dialog-finalize-inspection/quality-tasks-dialog-finalize-inspection.component';
import { QualityTasksConfirmFinalizeInspectionComponent } from './quality/quality-tasks/quality-tasks-confirm-finalize-inspection/quality-tasks-confirm-finalize-inspection.component';
import { ChangePasswordComponent } from './main/change-password/change-password.component';
import { ConfirmChangePasswordComponent } from './main/confirm-change-password/confirm-change-password.component';
import { SystemGeneralAreaDialogEditComponent } from './configuration/system/system-general-area/system-general-area-dialog-edit/system-general-area-dialog-edit.component';
import { SystemGeneralAreaConfirmEditComponent } from './configuration/system/system-general-area/system-general-area-confirm-edit/system-general-area-confirm-edit.component';
import { ConfigCustomerComponent } from './configuration/system/system-general-area/config-customer/config-customer.component';
import { CreateNewCustomerComponent } from './configuration/system/system-general-area/config-customer/create-new-customer/create-new-customer.component';
import { CustomerDialogEditComponent } from './configuration/system/system-general-area/config-customer/customer-dialog-edit/customer-dialog-edit.component';
import { CustomerConfirmDeleteComponent } from './configuration/system/system-general-area/config-customer/customer-confirm-delete/customer-confirm-delete.component';
import { CustomAngularCsvComponent } from './custom-angular-csv/custom-angular-csv.component';






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
    SecurityInspectionConfirmTerminationComponent,
    SecurityTasksDialogProgressComponent,
    SecurityTasksConfirmSaveComponent,
    QualityAddInspectionComponent,
    QualityAddObservationToInspectionComponent,
    QualityInspectionConfirmTerminationComponent,
    QualityInspectionConfirmDeleteComponent,
    QualityInspectionObservationConfirmDeleteComponent,
    MaintenanceRequestsConfirmSaveComponent,
    MaintenanceRequestsConfirmDeleteComponent,
    MaintenanceRequestsDialogEditComponent,
    MaintenanceRequestsConfirmEditComponent,
    MaintenanceRequestsDialogTaskComponent,
    MaintenanceRequestsConfirmTaskComponent,
    SsggRequestsConfirmSaveComponent,
    SsggRequestsConfirmDeleteComponent,
    SsggRequestsConfirmEditComponent,
    SsggRequestsConfirmTaskComponent,
    SsggRequestsDialogEditComponent,
    SsggRequestsDialogTaskComponent,
    QualityRedoReportDialogCreateComponent,
    QualityRedoReportConfirmCreateComponent,
    QualityRedoReportDialogEditComponent,
    QualityRedoReportConfirmEditComponent,
    QualityRedoReportConfirmDeleteComponent,
    QualityRedoReportDialogAnalyzeComponent,
    QualityRedoReportConfirmAnalyzeComponent,
    QualityRedoReportDialogActionsComponent,
    QualityRedoReportConfirmActionsComponent,
    QualityRedoReportConfirmClosedComponent,
    QualityRedoReportDialogClosedComponent,
    QualityRedoAnalyzePicturesComponent,
    QualityRedoAnalyzeDialogEditComponent,
    QualityRedoAnalyzeConfirmEditComponent,
    QualityRedoAnalyzeConfirmDeleteComponent,
    QualityRedoAnalyzeDialogDeleteComponent,
    QualityRedoAnalyzeDialogActionsComponent,
    QualityRedoAnalyzeConfirmActionsComponent,
    QualityRedoActionsConfirmDeleteActionComponent,
    QualityRedoActionsDialogAddActionsComponent,
    QualityRedoActionsConfirmAddActionsComponent,
    QualityRedoActionsConfirmApproveActionsComponent,
    QualityTasksDialogFinalizeComponent,
    QualityTasksConfirmFinalizeComponent,
    QualityRedoActionsConfirmValidateComponent,
    QualityRedoActionsConfirmResetComponent,
    QualityRedoActionsDialogRequestClosingComponent,
    ConfigSecurityFredComponent,
    ConfigQualityRedosComponent,
    QualityRedosActionsConfirmRequestClosingComponent,
    QualityRedosActionsConfirmResendComponent,
    ConfigurationNotificationsComponent,
    ConfigNotificationsSecurityComponent,
    ConfigNotificationsQualityComponent,
    ConfigNotificationsMaintenanceComponent,
    ConfigNotificationsSsggComponent,
    SystemaGeneralAreaConfirmDeleteComponent,
    QualityRedosClosingConfirmClosingComponent,
    UsersDialogAssignAreaComponent,
    UsersPermitConfirmDeleteComponent,
    UsersPermitDialogEditComponent,
    UsersPermitConfirmEditComponent,
    ConfigMaintenanceRequestsComponent,
    ConfigSsggRequestsComponent,
    ConfigSecurityInspectionsComponent,
    ConfigEditUserComponent,
    ConfigDeleteUserComponent,
    QualityConfirmAddObservationComponent,
    QualityDialogAddSingleObservationComponent,
    QualityConfirmAddSingleObservationComponent,
    QualityConfirmDeleteSingleObservationComponent,
    QualityTasksDialogFinalizeObservationComponent,
    QualityTasksConfirmFinalizeObservationComponent,
    QualityTasksDialogFinalizeInspectionComponent,
    QualityTasksConfirmFinalizeInspectionComponent,
    ChangePasswordComponent,
    ConfirmChangePasswordComponent,
    SystemGeneralAreaDialogEditComponent,
    SystemGeneralAreaConfirmEditComponent,
    ConfigCustomerComponent,
    CreateNewCustomerComponent,
    CustomerDialogEditComponent,
    CustomerConfirmDeleteComponent,
    CustomAngularCsvComponent
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    PushNotificationsModule,
    Angular2CsvModule,
    ChartsModule,
    HttpClientModule,
    NgxPageScrollModule,
    NgxPageScrollCoreModule,
    AngularFireModule.initializeApp(environment.firebase, 'ms-crc-lajoya'),
    AngularFirestoreModule.enablePersistence(),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    MatPasswordStrengthModule.forRoot(),
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
    MatSliderModule,
    MatChipsModule,
    MatPasswordStrengthModule
  ],
  providers: [
    AuthService,
    DatabaseService,
    SidenavService,
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true }
    },
    DatePipe
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
    SecurityInspectionConfirmTerminationComponent,
    SecurityTasksDialogProgressComponent,
    SecurityTasksConfirmSaveComponent,
    QualityAddInspectionComponent,
    QualityAddObservationToInspectionComponent,
    QualityInspectionConfirmTerminationComponent,
    QualityInspectionConfirmDeleteComponent,
    QualityInspectionObservationConfirmDeleteComponent,
    MaintenanceRequestsConfirmSaveComponent,
    MaintenanceRequestsConfirmDeleteComponent,
    MaintenanceRequestsDialogEditComponent,
    MaintenanceRequestsConfirmEditComponent,
    MaintenanceRequestsDialogTaskComponent,
    MaintenanceRequestsConfirmTaskComponent,
    SsggRequestsConfirmSaveComponent,
    SsggRequestsConfirmDeleteComponent,
    SsggRequestsConfirmEditComponent,
    SsggRequestsConfirmTaskComponent,
    SsggRequestsDialogEditComponent,
    SsggRequestsDialogTaskComponent,
    QualityRedoReportDialogCreateComponent,
    QualityRedoReportConfirmCreateComponent,
    QualityRedoReportDialogEditComponent,
    QualityRedoReportConfirmEditComponent,
    QualityRedoReportConfirmDeleteComponent,
    QualityRedoReportDialogAnalyzeComponent,
    QualityRedoReportConfirmAnalyzeComponent,
    QualityRedoReportDialogActionsComponent,
    QualityRedoReportConfirmActionsComponent,
    QualityRedoReportConfirmClosedComponent,
    QualityRedoReportDialogClosedComponent,
    QualityRedoAnalyzePicturesComponent,
    QualityRedoAnalyzeDialogEditComponent,
    QualityRedoAnalyzeConfirmDeleteComponent,
    QualityRedoAnalyzeDialogDeleteComponent,
    QualityRedoAnalyzeDialogActionsComponent,
    QualityRedoAnalyzeConfirmActionsComponent,
    QualityRedoActionsConfirmDeleteActionComponent,
    QualityRedoActionsDialogAddActionsComponent,
    QualityRedoActionsConfirmAddActionsComponent,
    QualityRedoActionsConfirmApproveActionsComponent,
    QualityTasksDialogFinalizeComponent,
    QualityTasksConfirmFinalizeComponent,
    QualityRedoActionsConfirmValidateComponent,
    QualityRedoActionsConfirmResetComponent,
    QualityRedoActionsDialogRequestClosingComponent,
    QualityRedosActionsConfirmRequestClosingComponent,
    QualityRedosActionsConfirmResendComponent,
    SystemaGeneralAreaConfirmDeleteComponent,
    QualityRedosClosingConfirmClosingComponent,
    UsersDialogAssignAreaComponent,
    UsersPermitConfirmDeleteComponent,
    UsersPermitDialogEditComponent,
    UsersPermitConfirmEditComponent,
    ConfigEditUserComponent,
    ConfigDeleteUserComponent,
    QualityConfirmAddObservationComponent,
    QualityDialogAddSingleObservationComponent,
    QualityConfirmAddSingleObservationComponent,
    QualityConfirmDeleteSingleObservationComponent,
    QualityTasksDialogFinalizeObservationComponent,
    QualityTasksConfirmFinalizeObservationComponent,
    QualityTasksDialogFinalizeInspectionComponent,
    QualityTasksConfirmFinalizeInspectionComponent,
    ChangePasswordComponent,
    SystemGeneralAreaDialogEditComponent,
    SystemGeneralAreaConfirmEditComponent,
    CreateNewCustomerComponent,
    CustomerDialogEditComponent,
    CustomerConfirmDeleteComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
