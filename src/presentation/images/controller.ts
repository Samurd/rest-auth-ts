import path from "path";
import fs from "fs";
import { Request, Response } from "express";

export class ImagesController {
    constructor(){}

    getImage = (req: Request, res: Response) => {
        const {type = "", img = ""} = req.params;
        
        const imagePath = path.resolve(__dirname, `../../../uploads/${type}/${img}`);

        if(!fs.existsSync(imagePath)){
            return res.status(400).send("Image not found");
        }

        res.sendFile(imagePath);
    }
}