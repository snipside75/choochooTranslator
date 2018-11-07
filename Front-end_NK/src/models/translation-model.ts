import { Language } from './language-model';

export class Translation{
    public id: Number;
    public word_id: Number;
    public word: string;
    public description: string;
    public example: string;
    public user: Number;
    public version: Number;
    public language: Language;
    public date_created: Date;
    public date_modified: Date;
    constructor(id: Number, word_id: Number, word: string, description: string, example: string, user: Number, version: Number, language: Language, date_created: Date, date_modified: Date){
        this.id = id;
        this.word_id = word_id;
        this.word = word;
        this.description = description;
        this.example = example;
        this.user = user;
        this.version = version;
        this.language = language;
        this.date_created = date_created;
        this.date_modified = date_modified;
    }
}