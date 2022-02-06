import { Router, Request, Response } from 'express';
import Model from './model';
import chowdown from 'chowdown'
import { container } from 'tsyringe';
const router = Router();
router.post('/', ( req: Request, res: Response  ) => {
    const model = container.resolve<Model>("Model")
    getSentences(req.body).then(r => model.predict(r).then(s => res.send(s)))
});

async function  getSentences( rawText: string): Promise<string[]>{
     const bodyText:string = await chowdown.body(rawText).execute(chowdown.query.string('body'));
     return  bodyText.replace(/\. /gm, '\n').split('\n').filter(line => line !== '' && !line.match(/^\s+$/)).map(phrase => phrase.trim())
}

export default router;