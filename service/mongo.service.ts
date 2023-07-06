import { Db } from "mongodb";


export default class MongoService {
    private static tableName = "cinemas";
    private static seats = "seats";

    public static createCinema = async (
        seats: number,
        dbo: Db
    ) => {
        try {
            const cinema = await dbo.collection(MongoService.tableName).insertOne({ seats: seats });
            return cinema.insertedId.toString() ?? null;
        } catch (err) {
            throw err;
        }
    };

    public static create = async (
        seats: any,
        dbo: Db
    ) => {
        try {
            await dbo.collection(MongoService.seats).insertMany(seats);
        } catch (err) {
            throw err;
        }
    };



}