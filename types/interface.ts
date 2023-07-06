import { ObjectId } from "mongodb";

export interface ISeats  {
    seatNo: number,
    cinemaID: ObjectId,
    isBooked: boolean
}

export interface ResponseInterFace {
    success: boolean,
    status: number,
    message: string,
    data: any
}