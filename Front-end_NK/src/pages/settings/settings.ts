import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, DateTime} from 'ionic-angular';

import { Translation } from '../../models/translation-model';
import { Language } from '../../models/language-model';

@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html'
})
export class SettingsPage {

    constructor(public storage: Storage){
        this.storage = storage;
    }

    //debug method that sets dummy data as the instorage dictionary
    downloadDict(event){
        let debugTranslations = [
            new Translation(1,1,'ajolangan dynaaminen asema','','',1,1,Language.fi,new Date(), new Date()),
            new Translation(2,1,'dynamic contact wire position','','',1,1,Language.en,new Date(), new Date()),
            new Translation(3,1,'dynamishe Fahrdrahtlage','','',1,1,Language.de,new Date(), new Date()),
            new Translation(4,1,'dynamisk kontaktledningsläge','','',1,1,Language.sv,new Date(), new Date()),
            new Translation(5,2,'ajolangan keskiankkurointi','','',1,1,Language.fi,new Date(), new Date()),
            new Translation(6,2,'contact wire mid-point anchor','','',1,1,Language.en,new Date(), new Date()),
            new Translation(7,2,'Fahrdrahtverankerung','','',1,1,Language.de,new Date(), new Date()),
            new Translation(8,2,'kontakttrådsföranking','','',1,1,Language.sv,new Date(), new Date()),
            new Translation(9,3,'ajolangan korkeus','kiskon yläpinnasta','',1,1,Language.fi,new Date(), new Date()),
            new Translation(10,3,'dynamic contact wire height','','',1,1,Language.en,new Date(), new Date()),
            new Translation(11,3,'Fahrdrahthöhe über Schienenoberkante','','',1,1,Language.de,new Date(), new Date()),
            new Translation(12,3,'kontaktledningens höjd över räls överkant','','',1,1,Language.sv,new Date(), new Date()),                        
        ];
        this.storage.set('dictionary',{translations: debugTranslations, version: 1})
        .then(
            () => console.log('Dummy data created'),
            error => console.error('Error storing dummy data', error)
            );
    }

    deleteDict(event){
        this.storage.remove('dictionary').then(
            () => console.log('Dummy data deleted'),
            error => console.error('error deleting dummy data', error)
        );
    }


}