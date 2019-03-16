import { Injectable } from '@angular/core';
import { Router } from "@angular/router";

import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "@angular/fire/firestore";

import { Observable, BehaviorSubject } from "rxjs";
import { User } from "./user";

import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // *********** USER PERMITS - (START) ***************************
  // -------------------------- USERS --------------------------------------
  public permitsDocument: AngularFirestoreDocument<any>;
  public permits: Array<any> = [];

  public dataPermits = new BehaviorSubject<any[]>([]);
  public currentDataPermits = this.dataPermits.asObservable();

  // *********** NOTIFICATIONS - (START) ***************************
  notificationsCollection: AngularFirestoreCollection<any[]>;
  notifications: Array<any> = [];

  public dataNotifications = new BehaviorSubject<any[]>([]);
  currentDataNotifications = this.dataNotifications.asObservable();
  
  // *********** NOTIFICATIONS - (START) ***************************
  notificationsCompleteCollection: AngularFirestoreCollection<any[]>;
  notificationsComplete: Array<any> = [];

  public dataNotificationsComplete = new BehaviorSubject<any[]>([]);
  currentDataNotificationsComplete = this.dataNotificationsComplete.asObservable();
  // ************************************************************************* //

  user: Observable<User>;
  userCRC: User = {
    uid: ''
  };
  authLoader: boolean = false;
  now = new Date();

  audio = new Audio();
  

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    public snackbar: MatSnackBar
  ) { 
    // AUDIO SETTINGS
    this.audio.src = "../../../assets/audio/to-the-point.mp3";
    this.audio.load();

    // NOTIFICATION COUNTER DECLARATION
    let notificationsCounter = 0;

    // USER PERSISTENCE VALIDATION
    this.afAuth.authState.subscribe( user => {
      if(user){
        this.afs.doc<User>(`users/${user.uid}`).valueChanges().subscribe(user => {
          this.userCRC = user;

          this.permitsDocument = this.afs.doc(`db/systemConfigurations/permits/${this.userCRC.permit.id}`);
          this.permitsDocument.valueChanges().subscribe( res => {
            this.permits = res;
            this.dataPermits.next(res);
          });

          this.notificationsCollection = this.afs.collection(`users/${this.userCRC.uid}/notifications`, ref => ref.where('status','==','unseen'));
          this.notificationsCollection.valueChanges().subscribe( res => {
            let sorted = res.sort((a,b)=>b['regDate']-a['regDate'])
            this.notifications = sorted;
            this.dataNotifications.next(sorted);
            if(this.notifications.length > notificationsCounter){
              this.playNotification();
            }
            notificationsCounter = this.notifications.length;
          });

          this.notificationsCompleteCollection = this.afs.collection(`users/${this.userCRC.uid}/notifications`, ref => ref.orderBy('regDate','desc'));
          this.notificationsCompleteCollection.valueChanges().subscribe(res => {
            this.notificationsComplete = res;
            this.dataNotificationsComplete.next(res);
          });

        })
      }else{
        this.router.navigateByUrl('/login');
      }
    })

  }

  // ************* NOTIFICATIONS
  // Play notification Sound
  playNotification(): void{
    this.audio.play();
  }

  // Change status of notification to seen
  notificationSeen(id): void{
    this.notificationsCollection.doc(`${id}`).update({
      status: 'seen'
    });
  }

  // Change state of notification to unseen
  notificationUnseen(id): void{
    this.notificationsCollection.doc(`${id}`).update({
      status: 'unseen'
    });
  }

  // ********* EMAIL LOGIN

  emailLogin(email: string, password: string) {
    this.authLoader = true;
    return this.afAuth.auth.signInWithEmailAndPassword(email,password)
      .then(credential => {
        if(credential){
          this.authLoader = false;
          this.router.navigateByUrl('/main');
        }
      })
      .catch(error => this.handleError(error));
  }

  // ******** SIGN OUT

  signOut() {
    this.userCRC = {
      uid: ''
    }

    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/']);
    })
  }

  // ********** ERROR HANDLING

  private handleError(error) {

    let message = "";

    switch (error.code) {
      case "auth/invalid-email":
        message = "Error: El formato del correo es incorrecto";
        break;

      case "auth/wrong-password":
        message = "Error: El password es incorrecto o el usuario no tiene un password";
        break;
    
      case "auth/user-disabled":
        message = "Error: El usuario esta deshabilitado";
        break;

      case "auth/user-not-found":
        message = "Error: El usuario no está registrado";
        break;

      default:
        message = "Hmmm esto es nuevo ..." + error.code;
        break;
    }
    this.snackbar.open(message, "Cerrar", {
      duration: 6000,
    });

    this.authLoader = false;
  }

  


}
