import { Request, Response, response } from "express";
import { Db, MongoClient, ObjectId } from "mongodb";
import MongoService from "../service/mongo.service";
import { STATUS } from "../constans/status";
import { ISeats, ResponseInterFace } from "../types/interface";
import { MESSAGE } from "../constans/message";

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
            let seatsArry: Array<ISeats> = [];
            for (let i = 1; i <= seats; i++) {
                seatsArry.push({
                    cinemaID: cinemaID,
                    isBooked: false,
                    seatNo: i
                })
            }
            await this.mongoService.create(seatsArry, dbo);
            res.status(STATUS.OK).send({ status: STATUS.OK, success: true, message: MESSAGE.CREATE, data: { cinemaID: cinemaID.toString() } });

        } catch (err) {
            console.error(`Error log ${err}`);
            res.status(STATUS.ERROR).send({ status: STATUS.ERROR, success: false, message: MESSAGE.ERROR, data: err.message });

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

            let isBooked = await this.mongoService.checkTicketAvailable(new ObjectId(cinemaID), seatNo, dbo);
            if (isBooked) {
                res.status(STATUS.OK).send({ status: STATUS.OK, success: true, message: MESSAGE.TICKETBOOK, data: {} });
            } else {
                await this.mongoService.update(new ObjectId(cinemaID), seatNo, dbo)
                res.status(STATUS.OK).send({ status: STATUS.OK, success: true, data: { seatNo: seatNo } });
            }

        } catch (err) {
            console.error(`Error log ${err}`);
            res.status(STATUS.ERROR).send({ status: STATUS.ERROR, success: false, message: MESSAGE.ERROR, data: err.message });

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
            let seats = await this.mongoService.findUnbookedTicket(new ObjectId(cinemaID), dbo);
            for (let i = 0; i < seats.length - 1; i++) {
                if (seats[i].seatNo + 1 === seats[i + 1].seatNo) {
                    const availableSeat = seats.map(e => e.seatNo);
                    res.status(STATUS.OK).send({ status: STATUS.OK, success: true, data: { availableSeat: availableSeat } });
                    return;
                }
            }
            res.status(STATUS.OK).send({ status: STATUS.OK, success: true, message: MESSAGE.CONSECUTIVE, data: {} });
        } catch (err) {
            console.error(`Error log ${err}`);
            res.status(STATUS.ERROR).send({ status: STATUS.ERROR, success: false, message: MESSAGE.ERROR, data: err.message });

        }
    }


    public ResponseFunc = async (code: number, success: boolean, msg: string, data: any) => {
        return { code: code, success: success, message: msg, data: data };

    }

}