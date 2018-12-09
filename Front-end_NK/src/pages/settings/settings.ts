import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import {ToastController, LoadingController} from 'ionic-angular';
//import { HTTP } from '@ionic-native/http';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule} from '@angular/common/http';

import { SERVER_URL } from '../../env/env';

import { Translation } from '../../models/translation-model';
import { Language } from '../../models/language-model';

//debug stuff
/*
declare module "vocab.json"
{ const value: any;
  export default value;
}

import * as dictionary from './vocab.json';
*/
@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html'
})
export class SettingsPage {

    public isListLimited: boolean = true;
    public isOffline: boolean = false;//Default value of offline setting

    constructor(public storage: Storage, public http: HttpClient,private toastCtrl: ToastController, private loadingCtrl: LoadingController){
        this.storage = storage;
        this.http = http;
        this.storage.get('isListLimited').then(state=>this.isListLimited = state).catch(()=>{
            this.storage.set('isListLimited',this.isListLimited);
        });
        //check if offline setting has been set in memory. if not create
        this.storage.get('isOffline').then(state=>this.isOffline = state).catch(()=>{
            this.storage.set('isOffline',this.isOffline);
        });
    }

    //method that gets dictionary json from server and saves it in storage
    downloadDict(event){

        let loading = this.loadingCtrl.create({
            content: 'Downloading...'
        });

        loading.present();

        let url = SERVER_URL + 'translate/get_offline'

        this.http.get('/assets/vocab.json').subscribe(res =>{
            let dictionary = res as any;
        

        let debugTranslations = []; 

        
        dictionary.translations.forEach(element => {
            if(element.language == 'fi'){
                element.language = Language.fi;
            } else if(element.language == 'en'){
                element.language = Language.en;
            } else if (element.language == 'sv'){
                element.language = Language.sv;
                console.log(element.language);
            } else if (element.language == 'de'){
                element.language = Language.de;
            }
            debugTranslations.push(new Translation(element.id,element.word_id,element.word,element.description,element.example,element.user,element.version,element.language,element.date_created, element.date_created));
        });
        
        loading.dismiss();
        this.storage.set('dictionary',{translations: debugTranslations, version: 1})
        .then(
            () => {


                const toast = this.toastCtrl.create({
                    message: 'New dictionary downloaded!',
                    duration: 1000,
                    position: 'top'
                });
                toast.present();
        },
            error => {
                console.error('Error storing dummy data', error);
                const toast = this.toastCtrl.create({
                    message: 'Error storing dictionary',
                    duration: 5000,
                    position: 'top'
                });
                toast.present();
            }
            );
        }, err =>{

            loading.dismiss();
            //inform user using toast that connection to the server could not be established
            const toast = this.toastCtrl.create({
                message: 'Could not download dictionary, check Internet your connection!',
                duration: 5000,
                position: 'top'
            });
            toast.present();
        });
    }
    
    deleteDict(event){
        this.storage.remove('dictionary').then(
            () => {
                const toast = this.toastCtrl.create({
                    message: 'Dictionary deleted!',
                    duration: 5000,
                    position: 'top'
                });
                toast.present();
            },
            error => console.error('error deleting dummy data', error)
        );
    }

    toggleListLimited(){
        //saving setting to storage
        this.storage.set('isListLimited',this.isListLimited);
    }
    /**
     * Method that toggles the is Offline setting. When isOffline true the app will only use the downloaded dictionary
     */
    toggleOffline(){
        this.storage.set('isOffline', this.isOffline);

        const toast = this.toastCtrl.create({
            message: 'you are now: ' + this.isOffline,
            duration: 5000,
            position: 'top'
        });
        toast.present();
    }

}