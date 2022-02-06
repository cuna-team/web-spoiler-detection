import * as tfn from '@tensorflow/tfjs-node';
import * as fs from 'fs';
import * as path from 'path';
import { singleton } from 'tsyringe';

@singleton()
export default class Model{

    private dictionary : any = null 
    private graphModel : any = null

    constructor(private urlModel: string, private urlDictionary:string){
    }

    public async initialize() {
      
      this.graphModel = await tfn.loadLayersModel(tfn.io.fileSystem(this.urlModel))     
      return new Promise<void>( resolve => {
        fs.readFile(path.resolve(this.urlDictionary), (err, data) => {
            if (err) throw err;
            this.dictionary = JSON.parse(data.toString())
            resolve() 
          });
        })
    }



    async predict(rawSentences: string[]): Promise<[number, string][]>{
        const maxLength: number = 200;
        const cleanSentences = rawSentences.map(rawSentence => rawSentence.toLocaleLowerCase().replace(/s*[^a-z0-9]s*/g, ' ').replace(/  /g,' ').trim())
        let vectorizedSentences = cleanSentences.map(sentence => 
            {
            const vectorizedSentence: number[] = []
            sentence.split(' ').forEach(word =>{
                if (this.dictionary.vocab2int[word] !== undefined)
                    vectorizedSentence.push(this.dictionary.vocab2int[word])
            })
            return vectorizedSentence
        })

        vectorizedSentences = vectorizedSentences.map(vectorizedSentence => vectorizedSentence.concat(Array(maxLength).fill(0)).slice(0,maxLength))
     
        const results = this.graphModel.predict(tfn.tensor2d(vectorizedSentences, [vectorizedSentences.length, maxLength])).arraySync();
        return rawSentences.map<[number, string]>((r:string, i:number) => [results[i][1], r]).filter(element=> element[0] >= 0.5)
    }
}
