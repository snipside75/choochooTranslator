import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController,NavParams, MenuController } from 'ionic-angular';
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
  }

  setItems(){
    this.items = [];
    /*
    this.items = [
      new Word("crossing with movable point","toDo1","toDo1","toDo1"),
      new Word("movable point frog","toDo1","toDo1","toDo1"),
      new Word("common crossing","toDo1","toDo1","toDo1"),
      new Word("frog","toDo1","toDo1","toDo1"),
      new Word("first-class coach","toDo1","toDo1","toDo1"),
      new Word("second-class coach","toDo1","toDo1","toDo1"),
      new Word("obtuse crossing","toDo1","toDo1","toDo1"),
      new Word("short-pitch corrugation","toDo1","toDo1","toDo1")
    ];
    */

  }


  onInput(event){
    console.log('From language: ' + Language[this.fromLang]);
    console.log('To language: ' + Language[this.toLang]);  

    this.setItems();

    //check if we are in offline mode
    this.checkIfOffline().then((state)=>{
      if(state){
        this.getItemsStorage().then(()=>{
          this.filterItems();
        });        
      } else {
        this.getItemsAPI().then().catch(()=>{  //If fetching data from server does not work do offline search
          this.getItemsStorage().then(()=>{
            this.filterItems();
          });
        });
      }
    });




  }

  onCancel(event){

  }


  

  constructor(public navCtrl: NavController, menu: MenuController,public storage: Storage,public http: HttpClient) {
    menu.enable(true);
    
    this.fromLang = 0;
    this.toLang = 1;


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
      
      let url = SERVER_URL + 'translate/get_word/' + this.fromLang + '/' + this.toLang + this.filter;

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
        console.log(translationList);
        this.items = [];
  
        //this is not really efficient. needs to be hashmap?
        translationList.forEach(element => {
          if(element.language == this.fromLang){
            let newWord = new Word('','','','');
            newWord.original = element.word;
  
            //search for corresponding id
            for(let i = 0; i < translationList.length; i++){
              if(translationList[i].language == this.toLang && translationList[i].word_id == element.word_id){
                newWord.word = translationList[i].word;
                newWord.example = translationList[i].example;
                newWord.defintion = translationList[i].description;
  
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
