var fs = require('fs');
var parse = require('csv-parse');
var async = require('async');

var inputFile='railway_vocab.csv';

var fileData = {
    translations:[]
}

var addToData = function(obj){
    fileData.translations.push(obj);
}

var writeJSON = function(){
    var json = JSON.stringify(fileData);
    fs.writeFile('vocab.json',json, 'utf-8',function(){
        console.log('Writing done!');
    });
}

var parser = parse({delimiter: ';'}, function (err, data) {

    console.log(data.length);

    for(line in data){
        parseLine(data[line]);
    }
    writeJSON();
    /*async.eachSeries(data, function (line, callback) {
        console.log(line);
      // do something with the line
      parseLine(line).then(function() {
        // when processing finishes invoke the callback to move to the next one
        writeJSON();
      });
    })*/

  });

var parseLine = function(line){

        var translation1 = {
            id: '',
            word_id: 0,
            word: '',
            description: '',
            example: '',
            user: '',
            version: 1,
            language: '',
            date_created: new Date(),
            date_modified: new Date()
        }

        var translation2 = {
            id: '',
            word_id: 0,
            word: '',
            description: '',
            example: '',
            user: '',
            version: 1,
            language: '',
            date_created: new Date(),
            date_modified: new Date()
        }

        var translation3 = {
            id: '',
            word_id: 0,
            word: '',
            description: '',
            example: '',
            user: '',
            version: 1,
            language: '',
            date_created: new Date(),
            date_modified: new Date()
        }

        var translation4 = {
            id: '',
            word_id: 0,
            word: '',
            description: '',
            example: '',
            user: '',
            version: 1,
            language: '',
            date_created: new Date(),
            date_modified: new Date()
        }
        console.log(line);
        if( line[0].indexOf('RailLexicID') === -1 && line[0].indexOf('ID') > -1 && line[1].length > 0 && line[3].length > 0 && line[5].length > 0 && line[7].length > 0){
            console.log('adding word');
        
            translation1.id = line[0];
            translation1.word_id = line[14];
            translation1.word = line[1];
            translation1.description = line[2];
            translation1.language = 'fi';

            addToData(translation1);

            translation2.id = line[0];
            translation2.word_id = line[14];
            translation2.word = line[3];
            translation2.description = line[4];
            translation2.language = 'en';

            addToData(translation2);

            translation3.id = line[0];
            translation3.word_id = line[14];
            translation3.word = line[5];
            translation3.description = line[6];
            translation3.language = 'de';

            addToData(translation3);

            translation4.id = line[0];
            translation4.word_id = line[14];
            translation4.word = line[7];
            translation4.description = line[8];
            translation4.language = 'sv';

            addToData(translation4);
        }

  };
  fs.createReadStream(inputFile).pipe(parser);