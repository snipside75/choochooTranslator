import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, DateTime} from 'ionic-angular';
//import { HTTP } from '@ionic-native/http';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule} from '@angular/common/http';
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

    constructor(public storage: Storage, public http: HttpClient){
        this.storage = storage;
        this.http = http;
        this.storage.get('isListLimited').then(state=>this.isListLimited = state).catch(()=>{
            this.storage.set('isListLimited',this.isListLimited);
        });
    }

    //debug method that sets dummy data as the instorage dictionary
    downloadDict(event){
        /*let debugTranslations = [
            new Translation('1',1,'ajolangan dynaaminen asema','','',1,1,Language.fi,new Date(), new Date()),
            new Translation('2',1,'dynamic contact wire position','','',1,1,Language.en,new Date(), new Date()),
            new Translation('3',1,'dynamishe Fahrdrahtlage','','',1,1,Language.de,new Date(), new Date()),
            new Translation('4',1,'dynamisk kontaktledningsläge','','',1,1,Language.sv,new Date(), new Date()),
            new Translation('5',2,'ajolangan keskiankkurointi','','',1,1,Language.fi,new Date(), new Date()),
            new Translation('6',2,'contact wire mid-point anchor','','',1,1,Language.en,new Date(), new Date()),
            new Translation('7',2,'Fahrdrahtverankerung','','',1,1,Language.de,new Date(), new Date()),
            new Translation('8',2,'kontakttrådsföranking','','',1,1,Language.sv,new Date(), new Date()),
            new Translation('9',3,'ajolangan korkeus','kiskon yläpinnasta','',1,1,Language.fi,new Date(), new Date()),
            new Translation('10',3,'dynamic contact wire height','','',1,1,Language.en,new Date(), new Date()),
            new Translation('11',3,'Fahrdrahthöhe über Schienenoberkante','','',1,1,Language.de,new Date(), new Date()),
            new Translation('12',3,'kontaktledningens höjd över räls överkant','','',1,1,Language.sv,new Date(), new Date()),                        
        ];*/
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


        this.storage.set('dictionary',{translations: debugTranslations, version: 1})
        .then(
            () => console.log('Dummy data created'),
            error => console.error('Error storing dummy data', error)
            );
        });
    }

    deleteDict(event){
        this.storage.remove('dictionary').then(
            () => console.log('Dummy data deleted'),
            error => console.error('error deleting dummy data', error)
        );
    }

    toggleListLimited(){
        //saving setting to storage
        this.storage.set('isListLimited',this.isListLimited);
        console.log("setting List limited to: " + this.isListLimited);
    }

}