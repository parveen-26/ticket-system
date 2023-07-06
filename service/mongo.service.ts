import { Db, ObjectId } from "mongodb";
import { ISeats } from "../types/interface";


export default class MongoService {
    private static tableName = "cinemas";
    private static seats = "seats";

    public static createCinema = async (
        seats: number,
        cinemaName: string,
        dbo: Db
    ) => {
        try {
            const cinema = await dbo.collection(MongoService.tableName).insertOne({ seats, cinemaName, createdAt:new Date().toISOString() });
            return cinema.insertedId; //.toString();
        } catch (err) {
            throw err;
        }
    };

    public static create = async (
        seats: ISeats[],
        dbo: Db
    ) => {
        try {
            await dbo.collection(MongoService.seats).insertMany(seats);
        } catch (err) {
            throw err;
        }
    };

    public static update = async (
        cinemaID: ObjectId,
        seatNo: number,
        dbo: Db
    ) => {
        try {
            await dbo.collection(MongoService.seats).updateOne({ cinemaID, seatNo },  {
                "$set": {
                    "isBooked":true 
                }
            });
        } catch (err) {
            throw err;
        }
    };

    public static checkTicketAvailable = async (
        cinemaID: ObjectId,
        seatNo: number,
        dbo: Db
    ) => {
        try {
           const ticket =  await dbo.collection(MongoService.seats).findOne({ cinemaID, seatNo, isBooked : true });
           return ticket ?? null;
        } catch (err) {
            throw err;
        }
    };

    public static findUnbookedTicket = async (
        cinemaID: ObjectId,
        dbo: Db
    ) => {
        try {
           const ticket =  await dbo.collection(MongoService.seats).find({ cinemaID, isBooked : false }).sort({seatNo:1}).toArray();
           return ticket ?? null;
        } catch (err) {
            throw err;
        }
    };



}