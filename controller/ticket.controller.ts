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
            const { seats, cinemaName } = req.body;
            const connectionString = process.env.MONGO_URI! as string;
            client = await MongoClient.connect(connectionString);
            const dbo: Db = client.db("cinemaDB");
            console.log("Connected to mongodb...");

            const cinemaID = await this.mongoService.createCinema(seats, cinemaName, dbo);
            let seatsArry: any = [];
            for (let i = 1; i <= seats; i++) {
                seatsArry.push({
                    cinemaID,
                    isBooked: false,
                    seatNo: i
                })
            }
            await this.mongoService.create(seatsArry, dbo);
            res.status(STATUS.OK).send({ cinemaID: cinemaID });

        } catch (err) {
            console.error(`Error log ${err}`);
            res.status(STATUS.ERROR).send(err.message);

        }
    }

    /**
     * purchase ticket 
     */
    public purchaseTicket = async (req: Request, res: Response) => {
        let client;
        try {
            const { seatNo, cinemaID } = req.body;
            const connectionString = process.env.MONGO_URI! as string;
            client = await MongoClient.connect(connectionString);
            const dbo: Db = client.db("cinemaDB");
            console.log("Connected to mongodb...");

            let isBooked = await this.mongoService.checkTicketAvailable(cinemaID, seatNo, dbo);
            if (isBooked) {
                res.status(STATUS.OK).send({ Message: "Ticket already booked" });
            } else {
                await this.mongoService.update(cinemaID, seatNo, dbo)
                res.status(STATUS.OK).send({ seatNo: seatNo });
            }

        } catch (err) {
            console.error(`Error log ${err}`);
            res.status(STATUS.ERROR).send(err.message);

        }
    }

    /**
     * Purchase consecutive tickets
     */
    public purchaseConsecutive = async (req: Request, res: Response) => {
        let client;
        try {

            const { cinemaID } = req.body,
                connectionString = process.env.MONGO_URI! as string;
            client = await MongoClient.connect(connectionString);
            const dbo: Db = client.db("cinemaDB");
            console.log("Connected to mongodb...");
            let seats = await this.mongoService.findUnbookedTicket(cinemaID, dbo);
            for (let i = 0; i < seats.length - 1; i++) {
                if (seats[i].seatNo + 1 === seats[i + 1].seatNo) {
                    const seat = seats.map(e => e.seatNo);
                    res.status(STATUS.OK).send({ availableSeats: seat });
                    return;
                }
            }
            res.status(STATUS.OK).send({ message: "No consecutive seats available" });

        } catch (err) {
            console.error(`Error log ${err}`);
            res.status(STATUS.ERROR).send(err.message);

        }
    }


}