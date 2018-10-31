import { Component } from '@angular/core';
import { NavController,NavParams, MenuController } from 'ionic-angular';
import { Word } from '../../models/word-model';
import { ItemPage } from '../item/item';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items: Array<Word>;

  ngOnInit(){
    this.setItems();
  }

  setItems(){
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
  }


  onInput(event){
    this.setItems();
    let filter = event.target.value;

    if(filter && filter.trim() !== ""){
      this.items = this.items.filter(function(item){
        return item.original.toLowerCase().includes(filter.toLowerCase());
      });
    }
  }

  onCancel(event){

  }

  

  constructor(public navCtrl: NavController, menu: MenuController) {
    menu.enable(true);
  }
  itemSelected($event, item){
    this.navCtrl.push(ItemPage, {
      item: item
    });
  }

}
