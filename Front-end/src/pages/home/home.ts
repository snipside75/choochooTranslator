import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController,NavParams, MenuController,ToastController} from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import { SERVER_URL } from '../../env/env';
import { Word } from '../../models/word-model';
import { Translation } from '../../models/translation-model';
import { Language } from '../../models/language-model';
import { ItemPage } from '../item/item';
import { SettingsPage } from '../settings/settings';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items: Array<Word>;
  filter: string;
  fromLang: Language;
  toLang: Language;
  searching: boolean;

  ngOnInit(){
    this.onInput(null);
  }

  filterItems(){
    let filter = this.filter;

    if(filter && filter.trim() !== ""){
      this.items = this.items.filter(function(item){
        return item.original.toLowerCase().includes(filter.toLowerCase());
      });
    }

    this.storage.get('isListLimited').then(value=>{
      if(value){
        this.items = this.items.slice(0,49);
      }
    }).catch();
    this.searching = false;
  }

  setItems(){
    this.items = [];
  }

  /**
   * This method is fetches the words corresponding to the given languages and filter and sets them into the array items
   * @param event the event that called this method
   */
  onInput(event){
    this.searching = true;
    this.setItems();

    //check if we are in offline mode
    this.checkIfOffline().then((state)=>{
      if(state){
        this.getItemsStorage().then(()=>{
          this.filterItems();
        });        
      } else {
        this.getItemsAPI().then().catch(()=>{  //If fetching data from server does not work do offline search
          let toast = this.toastCtrl.create({
            message: 'Could not connect to server, using offline dictionary',
            duration: 5000,
            position: 'top'
          });
          toast.present();
          this.getItemsStorage().then(()=>{
            this.filterItems();
          });
        });
      }
    });




  }

  onCancel(event){

  }


  

  constructor(public navCtrl: NavController, menu: MenuController,public storage: Storage,public http: HttpClient, private toastCtrl: ToastController) {
    menu.enable(true);
    
    this.fromLang = 0;
    this.toLang = 1;
    this.searching = false;


  }

  itemSelected($event, item){
    this.navCtrl.push(ItemPage, {
      item: item
    });
  }

  openSettings(event){
    this.navCtrl.push(SettingsPage);
  }

  private checkIfOffline(){
    let promise = new Promise((resolve,reject)=>{
      this.storage.get('isOffline').then((state)=>{
        resolve(state);
      }).catch(()=>{
        //offline value not set in memory, setting to false as default
        this.storage.set('isOffline',false);
        resolve(false);
      });
    });
    return promise;
  }

  /**
   * fetches items that match filter from API and stets this.items as them
   */
  private getItemsAPI(){
    let promise = new Promise((resolve,reject)=>{
      
      let url = SERVER_URL + 'translate/get_suggest/' + Language[this.fromLang] + '/' + Language[this.toLang] + '/' + (this.filter == undefined ? '': this.filter);
      this.http.get(url).subscribe((res)=>{

        this.items = res as Array<Word>;

      },(err)=>{reject()});
    });
    return promise;
  }

  /**
   * sets this.items variable as list fetched from on device storage
   */
  private getItemsStorage(){
    let promise = new Promise((resolve,reject)=>{
      this.storage.get('dictionary').then((value)=>{
        let translationList: Array<Translation>;
        translationList = value.translations;
        this.items = [];
  
        //this is not really efficient. needs to be hashmap?
        translationList.forEach(element => {
          if(element.language == this.fromLang){
            let newWord = new Word('','','');
            newWord.original = element.word;
  
            //search for corresponding id
            for(let i = 0; i < translationList.length; i++){
              if(translationList[i].language == this.toLang && translationList[i].word_id == element.word_id){
                newWord.word = translationList[i].word;
                newWord.definition = translationList[i].description;
  
                //translation found now we can stop the loop
                break;
              }
            }
            this.items.push(newWord);
          }
        });
        resolve();
      }).catch((value)=>{
        resolve();
      });
    });
    return promise;
  }


}
