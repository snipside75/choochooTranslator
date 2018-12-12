export class Word{
    public original: string;
    public word: string;
    public definition: string;

    constructor(original: string, word: string, definition: string){
        this.original = original;
        this.word = word;
        this.definition = definition;
    }
}