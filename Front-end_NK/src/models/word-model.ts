export class Word{
    public original: string;
    public word: string;
    public defintion: string;
    public example: string;

    constructor(original: string, word: string, defination: string, example: string){
        this.original = original;
        this.word = word;
        this.defintion = defination;
        this.example = example;
    }
}