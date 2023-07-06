import { Request, Response } from "express";
import { Db, MongoClient } from "mongodb";
import MongoService from "../service/mongo.service";
import { STATUS } from "../types/constant";

export default class TicketController {
    mongoService: typeof MongoService
    constructor() {
        this.mongoService = MongoService;
    }

    /**
     * Create cinema with N seats
     */
    public create = async (req: Request, res: Response) => {
        let client;
        try {
            const { seats } = req.body;
            const connectionString = process.env.MONGO_URI! as string;
            client = await MongoClient.connect(connectionString);
            const dbo: Db = client.db("cinemaDB");
            console.log("Connected to mongodb...");
            
            const cinemaID =  await this.mongoService.createCinema(seats,dbo);
            let seatsArry:any = [];
            for (let i = 1; i <= seats; i++) {
                seatsArry.push({
                    cinemaID,
                    isBooked: false,
                    seatNo:i
                })
            }
            await this.mongoService.create(seatsArry,dbo);
            res.status(STATUS.OK).send({cinemaID:cinemaID});

        } catch (err) {
            console.error(`Error log ${err}`);
            res.status(STATUS.ERROR).send(err.message);

        }
    }
}