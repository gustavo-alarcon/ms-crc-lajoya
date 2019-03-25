import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from "@angular/fire/firestore";
import { Observable, BehaviorSubject} from "rxjs";
import { AuthService } from "./auth.service";
import { map, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  // *********** DATA BASE COLLECTIONS - (START) ***************************

  // ************************** USERS **************************************
  // -------------------------- USERS --------------------------------------
  public usersCollection: AngularFirestoreCollection<any>;
  public users: Array<any> = [];

  public dataUsers = new BehaviorSubject<any[]>([]);
  public currentDataUsers = this.dataUsers.asObservable();

  // -------------------------- USERS --------------------------------------
  public permitsCollection: AngularFirestoreCollection<any>;
  public permits: Array<any> = [];

  public dataPermits = new BehaviorSubject<any[]>([]);
  public currentDataPermits = this.dataPermits.asObservable();

  // ************************** SECURITY ***********************************
  // -------------------------- FREDS --------------------------------------
  public securityFredsCollection: AngularFirestoreCollection<any>;
  public securityFreds: Array<any> = [];

  public dataSecurityFreds = new BehaviorSubject<any[]>([]);
  public currentDataSecurityFreds = this.dataSecurityFreds.asObservable();

  // -------------------------- SUBSTANDARD ACT FREDS --------------------------------------
  public securitySubstandardActFredsCollection: AngularFirestoreCollection<any>;
  public securitySubstandardActFreds: Array<any> = [];

  public dataSecuritySubstandardActFreds = new BehaviorSubject<any[]>([]);
  public currentDataSecuritySubstandardActFreds = this.dataSecuritySubstandardActFreds.asObservable();

  // -------------------------- SUBSTANDARD CONDITION FREDS --------------------------------------
  public securitySubstandardConditionFredsCollection: AngularFirestoreCollection<any>;
  public securitySubstandardConditionFreds: Array<any> = [];

  public dataSecuritySubstandardConditionFreds = new BehaviorSubject<any[]>([]);
  public currentDataSecuritySubstandardConditionFreds = this.dataSecuritySubstandardConditionFreds.asObservable();

  // -------------------------- REMARKABLE ACT FREDS --------------------------------------
  public securityRemarkableActFredsCollection: AngularFirestoreCollection<any>;
  public securityRemarkableActFreds: Array<any> = [];

  public dataSecurityRemarkableActFreds = new BehaviorSubject<any[]>([]);
  public currentDataSecurityRemarkableActFreds = this.dataSecurityRemarkableActFreds.asObservable();

  // -------------------------- INSPECTIONS -------------------------------
  public securityInspectionsCollection: AngularFirestoreCollection<any>;
  public securityInspections: Array<any> = [];

  public dataSecurityInspections = new BehaviorSubject<any[]>([]);
  public currentDataSecurityInspections = this.dataSecurityInspections.asObservable();

  // -------------------------- INSPECTION OBSERVATIONS -------------------------------
  public securityInspectionObservationsCollection: AngularFirestoreCollection<any>;
  public securityInspectionObservations: Array<any> = [];

  public dataSecurityInspectionObservations = new BehaviorSubject<any[]>([]);
  public currentDataSecurityInspectionObservations = this.dataSecurityInspectionObservations.asObservable();

  // -------------------------- TASKS BY FREDS -------------------------------
  public securityFredTasksCollection: AngularFirestoreCollection<any>;
  public securityFredTasks: Array<any> = [];

  public dataSecurityFredTasks = new BehaviorSubject<any[]>([]);
  public currentDataSecurityFredTasks = this.dataSecurityFredTasks.asObservable();

  // -------------------------- TASKS BY INSPECTIONS -------------------------------
  public securityInspectionTasksCollection: AngularFirestoreCollection<any>;
  public securityInspectionTasks: Array<any> = [];

  public dataSecurityInspectionTasks = new BehaviorSubject<any[]>([]);
  public currentDataSecurityInspectionTasks = this.dataSecurityInspectionTasks.asObservable();

  // -------------------------- TASKS -------------------------------
  public securityTasksCollection: AngularFirestoreCollection<any>;
  public securityTasks: Array<any> = [];

  public dataSecurityTasks = new BehaviorSubject<any[]>([]);
  public currentDataSecurityTasks = this.dataSecurityTasks.asObservable();


  // ************************** QUALITY *****************************
  // -------------------------- REDOS -------------------------------
  public qualityRedosCollection: AngularFirestoreCollection<any>;
  public qualityRedos: Array<any> = [];

  public dataQualityRedos = new BehaviorSubject<any[]>([]);
  public currentDataQualityRedos = this.dataQualityRedos.asObservable();

  // -------------------------- REDOS - REPORTS -------------------------------
  public qualityRedosReports: Array<any> = [];

  public dataQualityRedosReports = new BehaviorSubject<any[]>([]);
  public currentDataQualityRedosReports = this.dataQualityRedosReports.asObservable();

  // -------------------------- REDOS - ANALYZE -------------------------------
  public qualityRedosAnalyze: Array<any> = [];

  public dataQualityRedosAnalyze = new BehaviorSubject<any[]>([]);
  public currentDataQualityRedosAnalyze = this.dataQualityRedosAnalyze.asObservable();

  // -------------------------- REDOS - ACTIONS -------------------------------
  public qualityRedosActions: Array<any> = [];

  public dataQualityRedosActions = new BehaviorSubject<any[]>([]);
  public currentDataQualityRedosActions = this.dataQualityRedosActions.asObservable();

  // -------------------------- REDOS - CLOSED -------------------------------
  public qualityRedosClosed: Array<any> = [];

  public dataQualityRedosClosed = new BehaviorSubject<any[]>([]);
  public currentDataQualityRedosClosed = this.dataQualityRedosClosed.asObservable();

  // -------------------------- COMPONENTS------------------------------
  public qualityComponentsCollection: AngularFirestoreCollection<any>;
  public qualityComponents: Array<any> = [];

  public dataQualityComponents = new BehaviorSubject<any[]>([]);
  public currentDataQualityComponents = this.dataQualityComponents.asObservable();

  // -------------------------- REDO TYPES------------------------------
  public qualityRedoTypesCollection: AngularFirestoreCollection<any>;
  public qualityRedoTypes: Array<any> = [];

  public dataQualityRedoTypes = new BehaviorSubject<any[]>([]);
  public currentDataQualityRedoTypes = this.dataQualityRedoTypes.asObservable();

  // -------------------------- COMPONENT MODELS------------------------------
  public qualityComponentModelsCollection: AngularFirestoreCollection<any>;
  public qualityComponentModels: Array<any> = [];

  public dataQualityComponentModels = new BehaviorSubject<any[]>([]);
  public currentDataQualityComponentModels = this.dataQualityComponentModels.asObservable();

  // -------------------------- REPAIR TYPES------------------------------
  public qualityRepairTypesCollection: AngularFirestoreCollection<any>;
  public qualityRepairTypes: Array<any> = [];

  public dataQualityRepairTypes = new BehaviorSubject<any[]>([]);
  public currentDataQualityRepairTypes = this.dataQualityRepairTypes.asObservable();

  // -------------------------- ROOT CAUSES------------------------------
  public qualityRootCausesCollection: AngularFirestoreCollection<any>;
  public qualityRootCauses: Array<any> = [];

  public dataQualityRootCauses = new BehaviorSubject<any[]>([]);
  public currentDataQualityRootCauses = this.dataQualityRootCauses.asObservable();

  // -------------------------- CAUSE CLASSIFICATIONS------------------------------
  public qualityCauseClassificationsCollection: AngularFirestoreCollection<any>;
  public qualityCauseClassifications: Array<any> = [];

  public dataQualityCauseClassifications = new BehaviorSubject<any[]>([]);
  public currentDataQualityCauseClassifications = this.dataQualityCauseClassifications.asObservable();


  // -------------------------- INSPECTIONS -------------------------------
  public qualityInspectionsCollection: AngularFirestoreCollection<any>;
  public qualityInspections: Array<any> = [];

  public dataQualityInspections = new BehaviorSubject<any[]>([]);
  public currentDataQualityInspections = this.dataQualityInspections.asObservable();

  // -------------------------- OBSERVATIONS -------------------------------
  public qualityInspectionObservationsCollection: AngularFirestoreCollection<any>;
  public qualityInspectionObservations: Array<any> = [];

  public dataQualityInspectionObservations = new BehaviorSubject<any[]>([]);
  public currentDataQualityInspectionObservations = this.dataQualityInspectionObservations.asObservable();

  // ************************* MAINTENANCE ***************************
  // ------------------------- EQUIPMENTS ----------------------------
  public maintenanceEquipmentsCollection: AngularFirestoreCollection<any>;
  public maintenanceEquipments: Array<any> = [];

  public dataMaintenanceEquipments = new BehaviorSubject<any[]>([]);
  public currentDataMaintenanceEquipments = this.dataMaintenanceEquipments.asObservable();

  // ------------------------- PRIORITIES ----------------------------
  public maintenancePrioritiesCollection: AngularFirestoreCollection<any>;
  public maintenancePriorities: Array<any> = [];

  public dataMaintenancePriorities = new BehaviorSubject<any[]>([]);
  public currentDataMaintenancePriorities = this.dataMaintenancePriorities.asObservable();

  // ------------------------- REQUESTS ----------------------------
  public maintenanceRequestsCollection: AngularFirestoreCollection<any>;
  public maintenanceRequests: Array<any> = [];

  public dataMaintenanceRequests = new BehaviorSubject<any[]>([]);
  public currentDataMaintenanceRequests = this.dataMaintenanceRequests.asObservable();

  // ************************* SSGG ***************************
  // ------------------------- TYPES ----------------------------
  public ssggTypesCollection: AngularFirestoreCollection<any>;
  public ssggTypes: Array<any> = [];

  public dataSsggTypes = new BehaviorSubject<any[]>([]);
  public currentDataSsggTypes = this.dataSsggTypes.asObservable();

  // ------------------------- PRIORITIES ----------------------------
  public ssggPrioritiesCollection: AngularFirestoreCollection<any>;
  public ssggPriorities: Array<any> = [];

  public dataSsggPriorities = new BehaviorSubject<any[]>([]);
  public currentDataSsggPriorities = this.dataSsggPriorities.asObservable();

  // ------------------------- REQUESTS ----------------------------
  public ssggRequestsCollection: AngularFirestoreCollection<any>;
  public ssggRequests: Array<any> = [];

  public dataSsggRequests = new BehaviorSubject<any[]>([]);
  public currentDataSsggRequests = this.dataSsggRequests.asObservable();


  // *********** SYSTEM CONFIGURATION COLLECTIONS - (START) ***************************

  // *********
  // -------------------------- AREAS -------------------------------
  public areasCollection: AngularFirestoreCollection<any>;
  public areas: Array<any> = [];

  public dataAreas = new BehaviorSubject<any[]>([]);
  public currentDataAreas = this.dataAreas.asObservable();

  // *********
  // -------------------------- KIND OF DANGER -------------------------------
  public kindOfDangerCollection: AngularFirestoreCollection<any>;
  public kindOfDanger: Array<any> = [];

  public dataKindOfDanger = new BehaviorSubject<any[]>([]);
  public currentDataKindOfDanger = this.dataKindOfDanger.asObservable();

  // *********
  // -------------------------- KIND OF OBSERVATION -------------------------------
  public kindOfObservationCollection: AngularFirestoreCollection<any>;
  public kindOfObservation: Array<any> = [];

  public dataKindOfObservation = new BehaviorSubject<any[]>([]);
  public currentDataKindOfObservation = this.dataKindOfObservation.asObservable();

  // *********
  // -------------------------- CAUSES -------------------------------
  public causesCollection: AngularFirestoreCollection<any>;
  public causes: Array<any> = [];

  public dataCauses = new BehaviorSubject<any[]>([]);
  public currentDataCauses = this.dataCauses.asObservable();

  // *********
  // -------------------------- SUBSTANDARD-1 -------------------------------
  public substandard1Collection: AngularFirestoreCollection<any>;
  public substandard1: Array<any> = [];

  public dataSubstandard1 = new BehaviorSubject<any[]>([]);
  public currentDataSubstandard1 = this.dataSubstandard1.asObservable();

  // *********
  // -------------------------- SUBSTANDARD-2 -------------------------------
  public substandard2Collection: AngularFirestoreCollection<any>;
  public substandard2: Array<any> = [];

  public dataSubstandard2 = new BehaviorSubject<any[]>([]);
  public currentDataSubstandard2 = this.dataSubstandard2.asObservable();

  // *********
  // -------------------------- SUBSTANDARD-3 -------------------------------
  public substandard3Collection: AngularFirestoreCollection<any>;
  public substandard3: Array<any> = [];

  public dataSubstandard3 = new BehaviorSubject<any[]>([]);
  public currentDataSubstandard3 = this.dataSubstandard3.asObservable();

  // *********
  // -------------------------- SUBSTANDARD-4 -------------------------------
  public substandard4Collection: AngularFirestoreCollection<any>;
  public substandard4: Array<any> = [];

  public dataSubstandard4 = new BehaviorSubject<any[]>([]);
  public currentDataSubstandard4 = this.dataSubstandard4.asObservable();

  // *********
  // -------------------------- SUBSTANDARD-5 -------------------------------
  public substandard5Collection: AngularFirestoreCollection<any>;
  public substandard5: Array<any> = [];

  public dataSubstandard5 = new BehaviorSubject<any[]>([]);
  public currentDataSubstandard5 = this.dataSubstandard5.asObservable();

  // -------------------------- CUSTOMERS------------------------------
  public customersCollection: AngularFirestoreCollection<any>;
  public customers: Array<any> = [];

  public dataCustomers = new BehaviorSubject<any[]>([]);
  public currentDataCustomers = this.dataCustomers.asObservable();


  constructor(
    private afs: AngularFirestore,
    public auth: AuthService,
    private snackbar: MatSnackBar
  ) {

    let date = new Date();
    let fromMonth = date.getMonth();
    let fromYear = date.getFullYear();

    let actualFromDate = new Date(fromYear,fromMonth,1);

    let toMonth = (fromMonth + 1) % 12;
    let toYear = fromYear;

    if(fromMonth + 1 >= 13){
      toYear ++;
    }

    let toDate = new Date(toYear,toMonth,1);

    // ************ PERMITS
    this.auth.currentDataPermits.subscribe( permits => {
      // SECURITY - FRED
      if(permits['securitySection'] && permits['securityFred']){
        this.getAreas();
        this.getSubActs1();
        this.getSubActs2();
        this.getSubActs3();
        this.getSubActs4();
        this.getSubActs5();

        this.getFredReference();
        this.getSecuritySubstandardActFreds(actualFromDate.valueOf(), toDate.valueOf());
        this.getSecuritySubstandardConditionFreds(actualFromDate.valueOf(), toDate.valueOf());
        this.getSecurityRemarkableActFreds(actualFromDate.valueOf(), toDate.valueOf());
      }

      // SECURITY - TASKS
      if(permits['securitySection'] && permits['securityTasks']){
        this.getTasks(actualFromDate.valueOf(), toDate.valueOf());
        this.getFredTasks(actualFromDate.valueOf(), toDate.valueOf());
        this.getInspectionTasks(actualFromDate.valueOf(), toDate.valueOf());
      }
    

      // SECURITY - INSPECTIONS
      if(permits['securitySection'] && permits['securityInspections']){
        this.getSecurityInspections(false, actualFromDate.valueOf(), toDate.valueOf());
        this.getKindOfDanger();
        this.getKindOfObsevation();
        this.getCauses();
      }

      // QUALITY - REDOS
      if(permits['qualitySection'] && permits['qualityRedos']){
        this.getQualityRedoTypes();
        this.getQualityComponents();
        this.getQualityComponentModels();
        this.getQualityRepairTypes();
        this.getQualityRootCauses();
        this.getQualityCauseClassifications();
        this.getQualityRedos();
        this.getSecurityInspections(false, actualFromDate.valueOf(), toDate.valueOf());
      }

      // MAINTENANCE - REQUESTS
      if(permits['maintenanceSection'] && permits['maintenanceRequests']){
        this.getMaintenanceEquipments();
        this.getMaintenancePriorities();
        this.getMaintenanceRequests(false, actualFromDate.valueOf(), toDate.valueOf());
      }

      // SSGG - REQUESTS
      if(permits['ssggSection'] && permits['ssggRequests']){
        this.getSsggTypes();
        this.getSsggPriorities();
        this.getSsggRequests(false, actualFromDate.valueOf(), toDate.valueOf());
      }

    });

    // SYSTEM
    this.getPermits();
    this.getUsers();
    this.getCustomers();
  }

  // *************** USERS
  getUsers(): void{
    this.usersCollection = this.afs.collection(`users`, ref => ref.orderBy('name','asc'));
    this.usersCollection.valueChanges().subscribe(res => {
      this.users = res;
      this.dataUsers.next(res);
    })
  }

  addUser(data): Promise<any>{
    return this.usersCollection.doc(data['uid']).set(data);
  }

  getPermits(): void{
    this.permitsCollection = this.afs.collection(`db/systemConfigurations/permits`, ref => ref.orderBy('regDate','asc'));
    this.permitsCollection.valueChanges().subscribe(res => {
      this.permits = res;
      this.dataPermits.next(res);
    })
  }

  // *************** SYSTEM CONFIGURATION METHODS
  getAreas(): void{
    this.areasCollection = this.afs.collection(`db/systemConfigurations/areas`, ref => ref.orderBy('name','asc'));
    this.areasCollection.valueChanges().subscribe(res => {
      this.areas = res;
      this.dataAreas.next(res);
    })
  }

  getKindOfDanger(): void{
    this.kindOfDangerCollection = this.afs.collection(`db/systemConfigurations/kindOfDanger`, ref => ref.orderBy('name','asc'));
    this.kindOfDangerCollection.valueChanges().subscribe(res => {
      this.kindOfDanger = res;
      this.dataKindOfDanger.next(res);
    })
  }

  getKindOfObsevation(): void{
    this.kindOfObservationCollection = this.afs.collection(`db/systemConfigurations/kindOfObservation`, ref => ref.orderBy('name','asc'));
    this.kindOfObservationCollection.valueChanges().subscribe(res => {
      this.kindOfObservation = res;
      this.dataKindOfObservation.next(res);
    })
  }

  getCauses(): void{
    this.causesCollection = this.afs.collection(`db/systemConfigurations/causes`, ref => ref.orderBy('name','asc'));
    this.causesCollection.valueChanges().subscribe(res => {
      this.causes = res;
      this.dataCauses.next(res);
    })
  }

  getSubActs1(): void{
    this.substandard1Collection = this.afs.collection(`db/systemConfigurations/subAct1`, ref => ref.orderBy('name','asc'));
    this.substandard1Collection.valueChanges().subscribe(res => {
      this.substandard1 = res;
      this.dataSubstandard1.next(res);
    })
  }

  getSubActs2(): void{
    this.substandard2Collection = this.afs.collection(`db/systemConfigurations/subAct2`, ref => ref.orderBy('name','asc'));
    this.substandard2Collection.valueChanges().subscribe(res => {
      this.substandard2 = res;
      this.dataSubstandard2.next(res);
    })
  }

  getSubActs3(): void{
    this.substandard3Collection = this.afs.collection(`db/systemConfigurations/subAct3`, ref => ref.orderBy('name','asc'));
    this.substandard3Collection.valueChanges().subscribe(res => {
      this.substandard3 = res;
      this.dataSubstandard3.next(res);
    })
  }

  getSubActs4(): void{
    this.substandard4Collection = this.afs.collection(`db/systemConfigurations/subAct4`, ref => ref.orderBy('name','asc'));
    this.substandard4Collection.valueChanges().subscribe(res => {
      this.substandard4 = res;
      this.dataSubstandard4.next(res);
    })
  }

  getSubActs5(): void{
    this.substandard5Collection = this.afs.collection(`db/systemConfigurations/subAct5`, ref => ref.orderBy('name','asc'));
    this.substandard5Collection.valueChanges().subscribe(res => {
      this.substandard5 = res;
      this.dataSubstandard5.next(res);
    })
  }

  getCustomers(): void{
    this.customersCollection = this.afs.collection(`db/systemConfigurations/customers`, ref => ref.orderBy('regDate','asc'));
    this.customersCollection.valueChanges().subscribe(res => {
      this.customers = res;
      this.dataCustomers.next(res);
    });
  }

  // *************** SECURITY METHODS
  getFredReference(): void{
    this.securityFredsCollection = this.afs.collection(`db/crcLaJoya/securityFreds`);
  }

  getSecuritySubstandardActFreds(from, to): void{
    if(this.auth.permits['securityFredGeneralList']){
      this.securitySubstandardActFredsCollection = this.afs.collection(`db/crcLaJoya/securityFreds`, ref => ref.where('regDate','>=',from).where('regDate','<=',to));
    }else{
      this.securitySubstandardActFredsCollection = this.afs.collection(`db/crcLaJoya/securityFreds`, ref => ref.where('uid','==',this.auth.userCRC.uid).where('regDate','>=',from).where('regDate','<=',to));
    }
    
    this.securitySubstandardActFredsCollection.valueChanges()
      .pipe(
        map(res => {
          let fredArray = [];
          res.forEach(element => {
            if(element['type'] === 'Acto sub-estandar'){
              fredArray.push(element);
            }
          });
          return fredArray;
        }),
        map(res => {
          return res.sort((a,b)=>b['regDate']-a['regDate']);
        })
      )
      .subscribe(res => {
        this.securitySubstandardActFreds = res;
        this.dataSecuritySubstandardActFreds.next(res);
      })
  }

  getSecuritySubstandardConditionFreds(from, to): void{
    if(this.auth.permits['securityFredGeneralList']){
      this.securitySubstandardConditionFredsCollection = this.afs.collection(`db/crcLaJoya/securityFreds`, ref => ref.where('regDate','>=',from).where('regDate','<=',to));
    }else{
      this.securitySubstandardConditionFredsCollection = this.afs.collection(`db/crcLaJoya/securityFreds`, ref => ref.where('uid','==',this.auth.userCRC.uid).where('regDate','>=',from).where('regDate','<=',to));
    }
    
    this.securitySubstandardConditionFredsCollection.valueChanges()
      .pipe(
        map(res => {
          let fredArray = [];
          res.forEach(element => {
            if(element['type'] === 'Condición sub-estandar'){
              fredArray.push(element);
            }
          });
          return fredArray;
        }),
        map(res => {
          return res.sort((a,b)=>b['regDate']-a['regDate']);
        })
      )
      .subscribe(res => {
        this.securitySubstandardConditionFreds = res;
        this.dataSecuritySubstandardConditionFreds.next(res);
      })
  }

  getSecurityRemarkableActFreds(from, to): void{
    if(this.auth.permits['securityFredGeneralList']){
      this.securityRemarkableActFredsCollection = this.afs.collection(`db/crcLaJoya/securityFreds`, ref => ref.where('regDate','>=',from).where('regDate','<=',to));
    }else{
      this.securityRemarkableActFredsCollection = this.afs.collection(`db/crcLaJoya/securityFreds`, ref => ref.where('uid','==',this.auth.userCRC.uid).where('regDate','>=',from).where('regDate','<=',to));
    }
    
    this.securityRemarkableActFredsCollection.valueChanges()
      .pipe(
        map(res => {
          let fredArray = [];
          res.forEach(element => {
            if(element['type'] === 'Acto destacable'){
              fredArray.push(element);
            }
          });
          return fredArray;
        }),
        map(res => {
          return res.sort((a,b)=>b['regDate']-a['regDate']);
        })
      )
      .subscribe(res => {
        this.securityRemarkableActFreds = res;
        this.dataSecurityRemarkableActFreds.next(res);
      })
  }

  getTasks(from,to): void{
    
    this.securityTasksCollection = this.afs.collection(`users/${this.auth.userCRC.uid}/tasks`, ref => ref.where('regDate','>=',from).where('regDate','<=',to));

    this.securityTasksCollection.valueChanges()
      .pipe(
        map(res => {
          let tasksArray = [];
          res.forEach(element => {
            if(element['solved'] === false){
              tasksArray.push(element);
            }
          });
          return tasksArray;
        }),
        map(res => {
          return res.sort((a,b)=>b['regDate']-a['regDate']);
        })
      )
      .subscribe(res => {
        this.securityTasks = res;
        this.dataSecurityTasks.next(res);
      })
  }

  // NOT IN USE
  getFredTasks(from?,to?): void{
    if(this.auth.permits['securityTasksGeneralList']){
      this.securityFredTasksCollection = this.afs.collection(`db/crcLaJoya/securityFreds`, ref => ref.where('regDate','>=',from).where('regDate','<=',to));
    }else{
      this.securityFredTasksCollection = this.afs.collection(`db/crcLaJoya/securityFreds`, ref => ref.where('uidStaff','==', this.auth.userCRC.uid).where('regDate','>=',from).where('regDate','<=',to));
    }
    
    this.securityFredTasksCollection.valueChanges()
      .pipe(
        map(res => {
          let filteredResult = [];

          res.forEach(element => {
            if(element['solved'] === false){
              filteredResult.push(element);
            }
          })
          return filteredResult;
        }),
        
      )
      .subscribe(res => {
        this.securityFredTasks = res;
        this.dataSecurityFredTasks.next(res);
      })
  }

  // NOT IN USE
  getInspectionTasks(from?,to?): void{
    if(this.auth.permits['securityTasksGeneralList']){
      this.securityInspectionTasksCollection = this.afs.collection(`db/crcLaJoya/securityInspections`, ref => ref.where('regDate','>=',from).where('regDate','<=',to));
    }else{
      this.securityInspectionTasksCollection = this.afs.collection(`db/crcLaJoya/securityInspections`, ref => ref.where('uidStaff','==', this.auth.userCRC.uid).where('regDate','>=',from).where('regDate','<=',to));
    }
    
    this.securityInspectionTasksCollection.valueChanges()
      .pipe(
        map(res => {
          let filteredResult = [];

          res.forEach(element => {
            if(element['solved'] === false){
              filteredResult.push(element);
            }
          })
          return filteredResult;
        }),
        map(res => {
          return res.sort((a,b)=>b['regDate']-a['regDate']);
        })
      )
      .subscribe(res => {
        this.securityInspectionTasks = res;
        this.dataSecurityInspectionTasks.next(res);
      })
  }

  getSecurityInspections(justActualMonth?,from?,to?): void{
    if(this.auth.permits['securityInspectionsGeneralList']){
      if(justActualMonth){
        this.securityInspectionsCollection = this.afs.collection(`db/crcLaJoya/securityInspections`, ref => ref.where('estimatedTerminationDate','>=',from));
      }else{
        this.securityInspectionsCollection = this.afs.collection(`db/crcLaJoya/securityInspections`, ref => ref.where('estimatedTerminationDate','>=',from).where('estimatedTerminationDate','<=',to));
      }
    }else{
      if(justActualMonth){
        this.securityInspectionsCollection = this.afs.collection(`db/crcLaJoya/securityInspections`, ref => ref.where('uidStaff','==', this.auth.userCRC.uid).where('estimatedTerminationDate','>=',from));
      }else{
        this.securityInspectionsCollection = this.afs.collection(`db/crcLaJoya/securityInspections`, ref => ref.where('uidStaff','==', this.auth.userCRC.uid).where('estimatedTerminationDate','>=',from).where('estimatedTerminationDate','<=',to));
      }
    }

    this.securityInspectionsCollection.valueChanges()
      .pipe(
        map(res => {
          return res.sort((a,b)=>b['regDate']-a['regDate']);
        })
      )
      .subscribe(res => {
        this.securityInspections = res;
        this.dataSecurityInspections.next(res);
      })
  }

  getInspectionObservations(id): void{
    this.securityInspectionObservationsCollection = this.securityInspectionsCollection.doc(id).collection(`/observations`, ref => ref.orderBy('regDate','asc'));
    this.securityInspectionObservationsCollection.valueChanges().subscribe(res => {
      this.securityInspectionObservations = res;
      this.dataSecurityInspectionObservations.next(res);
    })
  }

  addInspection(data): Promise<any>{
    return this.securityInspectionsCollection.add(data);
  }

  addInspectionLog(id, data): Promise<any>{
    return this.securityInspectionsCollection.doc(id).collection(`log`).add(data);
  }

  addFredLog(id, data): Promise<any>{
    return this.securityFredsCollection.doc(id).collection(`log`).add(data);
  }

  // *************** QUALITY METHODS
  getQualityComponents(): void{
    this.qualityComponentsCollection = this.afs.collection(`db/systemConfigurations/qualityComponents`, ref => ref.orderBy('regDate','asc'));
    this.qualityComponentsCollection.valueChanges().subscribe(res => {
      this.qualityComponents = res;
      this.dataQualityComponents.next(res);
    });
  }

  getQualityRedoTypes(): void{
    this.qualityRedoTypesCollection = this.afs.collection(`db/systemConfigurations/qualityRedoTypes`, ref => ref.orderBy('regDate','asc'));
    this.qualityRedoTypesCollection.valueChanges().subscribe(res => {
      this.qualityRedoTypes = res;
      this.dataQualityRedoTypes.next(res);
    });
  }

  getQualityComponentModels(): void{
    this.qualityComponentModelsCollection = this.afs.collection(`db/systemConfigurations/qualityComponentModels`, ref => ref.orderBy('regDate','asc'));
    this.qualityComponentModelsCollection.valueChanges().subscribe(res => {
      this.qualityComponentModels = res;
      this.dataQualityComponentModels.next(res);
    });
  }

  getQualityRepairTypes(): void{
    this.qualityRepairTypesCollection = this.afs.collection(`db/systemConfigurations/qualityRepairTypes`, ref => ref.orderBy('regDate','asc'));
    this.qualityRepairTypesCollection.valueChanges().subscribe(res => {
      this.qualityRepairTypes = res;
      this.dataQualityRepairTypes.next(res);
    });
  }

  getQualityRootCauses(): void{
    this.qualityRootCausesCollection = this.afs.collection(`db/systemConfigurations/qualityRootCauses`, ref => ref.orderBy('regDate','asc'));
    this.qualityRootCausesCollection.valueChanges().subscribe(res => {
      this.qualityRootCauses = res;
      this.dataQualityRootCauses.next(res);
    });
  }

  getQualityCauseClassifications(): void{
    this.qualityCauseClassificationsCollection = this.afs.collection(`db/systemConfigurations/qualityCauseClassifications`, ref => ref.orderBy('regDate','asc'));
    this.qualityCauseClassificationsCollection.valueChanges().subscribe(res => {
      this.qualityCauseClassifications = res;
      this.dataQualityCauseClassifications.next(res);
    });
  }

  getQualityRedos(): void{
    this.qualityRedosCollection = this.afs.collection(`db/crcLaJoya/qualityRedos`, ref => ref.orderBy('regDate', 'desc'));
    this.qualityRedosCollection.valueChanges()
    .pipe(
      tap(res => {
        let reportList = [];
        let analyzeList = [];

        res.forEach(element => {

          if(element['stage'] === 'Reporte' && (element['uidSupervisor'] === this.auth.userCRC.uid || element['uidCreator'] === this.auth.userCRC.uid)){
            reportList.push(element);
          }

          if(element['stage'] === 'Análisis'){
            element['involvedAreas'].forEach(area => {
              if(area['supervisor']['uid'] === this.auth.userCRC.uid){
                analyzeList.push(element);
              }
            })

            element['responsibleStaff'].forEach(staff => {
              if(staff['uid'] === this.auth.userCRC.uid){
                analyzeList.push(element);
              }
            })
          }

        });
        
        this.qualityRedosReports = reportList;
        this.dataQualityRedosReports.next(reportList);

        this.qualityRedosAnalyze = analyzeList;
        this.dataQualityRedosAnalyze.next(analyzeList);
      }),
    )
    .subscribe(res => {
      this.qualityRedos = res;
      this.dataQualityRedos.next(res); 
    })
  }

  addQualityRedoLog(id, data): Promise<any>{
    return this.qualityRedosCollection.doc(id).collection(`log`).add(data);
  }

  getQualityInspections(justActualMonth?,from?,to?): void{
    if(this.auth.permits['qualityInspectionsGeneralList']){
      if(justActualMonth){
        this.qualityInspectionsCollection = this.afs.collection(`db/crcLaJoya/qualityInspections`, ref => ref.where('estimatedTerminationDate','>=',from));
      }else{
        this.qualityInspectionsCollection = this.afs.collection(`db/crcLaJoya/qualityInspections`, ref => ref.where('estimatedTerminationDate','>=',from).where('estimatedTerminationDate','<=',to));
      }
    }else{
      if(justActualMonth){
        this.qualityInspectionsCollection = this.afs.collection(`db/crcLaJoya/qualityInspections`, ref => ref.where('uidStaff','==', this.auth.userCRC.uid).where('estimatedTerminationDate','>=',from));
      }else{
        this.qualityInspectionsCollection = this.afs.collection(`db/crcLaJoya/qualityInspections`, ref => ref.where('uidStaff','==', this.auth.userCRC.uid).where('estimatedTerminationDate','>=',from).where('estimatedTerminationDate','<=',to));
      }
    }

    this.qualityInspectionsCollection.valueChanges()
      .pipe(
        map(res => {
          return res.sort((a,b)=>b['regDate']-a['regDate']);
        })
      )
      .subscribe(res => {
        this.qualityInspections = res;
        this.dataQualityInspections.next(res);
      })
  }

  // ********************** MAINTENANCE METHODS
  getMaintenanceEquipments(): void{
    this.maintenanceEquipmentsCollection = this.afs.collection(`db/systemConfigurations/maintenanceEquipments`, ref => ref.orderBy('regDate','asc'));
    this.maintenanceEquipmentsCollection.valueChanges().subscribe(res => {
      this.maintenanceEquipments = res;
      this.dataMaintenanceEquipments.next(res);
    });
  }

  getMaintenancePriorities(): void{
    this.maintenancePrioritiesCollection = this.afs.collection(`db/systemConfigurations/maintenancePriorities`, ref => ref.orderBy('regDate','asc'));
    this.maintenancePrioritiesCollection.valueChanges().subscribe(res => {
      this.maintenancePriorities = res;
      this.dataMaintenancePriorities.next(res);
    });
  }

  getMaintenanceRequests(justActualMonth?,from?,to?): void{
    
    if(justActualMonth){
      this.maintenanceRequestsCollection = this.afs.collection(`db/crcLaJoya/maintenanceRequests`, ref => ref.where('regDate','>=',from));
    }else{
      this.maintenanceRequestsCollection = this.afs.collection(`db/crcLaJoya/maintenanceRequests`, ref => ref.where('regDate','>=',from).where('regDate','<=',to));
    }

    this.maintenanceRequestsCollection.valueChanges()
      .pipe(
        map(res => {
          if(this.auth.permits['maintenanceRequestsPersonalList']){
            let filteredResults = [];
            res.forEach(element => {
              if(element['uid'] === this.auth.userCRC.uid || element['uidSupervisor'] === this.auth.userCRC.uid){
                filteredResults.push(element);
              }
            });

            return filteredResults;
          }else{
            return res;
          }
        }),
        map(res => {
          return res.sort((a,b)=>b['regDate']-a['regDate']);
        })
      )
      .subscribe(res => {
        this.maintenanceRequests = res;
        this.dataMaintenanceRequests.next(res);
      })
  }

  addMaintenanceRequestLog(id, data): Promise<any>{
    return this.maintenanceRequestsCollection.doc(id).collection(`log`).add(data);
  }

  // ********************** MAINTENANCE METHODS
  getSsggTypes(): void{
    this.ssggTypesCollection = this.afs.collection(`db/systemConfigurations/ssggTypes`, ref => ref.orderBy('regDate','asc'));
    this.ssggTypesCollection.valueChanges().subscribe(res => {
      this.ssggTypes = res;
      this.dataSsggTypes.next(res);
    });
  }

  getSsggPriorities(): void{
    this.ssggPrioritiesCollection = this.afs.collection(`db/systemConfigurations/ssggPriorities`, ref => ref.orderBy('regDate','asc'));
    this.ssggPrioritiesCollection.valueChanges().subscribe(res => {
      this.ssggPriorities = res;
      this.dataSsggPriorities.next(res);
    });
  }

  getSsggRequests(justActualMonth?,from?,to?): void{
    
    if(justActualMonth){
      this.ssggRequestsCollection = this.afs.collection(`db/crcLaJoya/ssggRequests`, ref => ref.where('regDate','>=',from));
    }else{
      this.ssggRequestsCollection = this.afs.collection(`db/crcLaJoya/ssggRequests`, ref => ref.where('regDate','>=',from).where('regDate','<=',to));
    }

    this.ssggRequestsCollection.valueChanges()
      .pipe(
        map(res => {
          if(this.auth.permits['ssggRequestsPersonalList']){
            let filteredResults = [];
            res.forEach(element => {

              if(element['uid'] === this.auth.userCRC.uid){
                filteredResults.push(element);
              }

              element['involvedAreas'].forEach(area => {
                if(area['supervisor']['uid'] === this.auth.userCRC.uid && area['supervisor']['uid'] != element['uid']){
                  filteredResults.push(area);
                }
              });

            });

            return filteredResults;
          }else{
            return res;
          }
        }),
        map(res => {
          return res.sort((a,b)=>b['regDate']-a['regDate']);
        })
      )
      .subscribe(res => {
        this.ssggRequests = res;
        this.dataSsggRequests.next(res);
      })
  }

  addSsggRequestLog(id, data): Promise<any>{
    return this.maintenanceRequestsCollection.doc(id).collection(`log`).add(data);
  }

}
