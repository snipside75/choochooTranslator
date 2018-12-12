import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { Word } from '../../models/word-model';

@Component({
    selector: 'page-item',
    templateUrl: 'item.html'
})
export class ItemPage {
    item: Word;

    ngOnInti(){
        
    }

    constructor(public navCtrl: NavController, public navParams: NavParams, menu: MenuController){
       this.item =  navParams.get('item');
    }
}