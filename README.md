# Overview

used:
  
MongoDB   
Typescript  
Express  

## Created two collection
Cinema: stores cinemas details  
Schema  
{

    _id:ObjectId,

    cinemaName:string,

    seats:number

}  

Seats: store seats details   
Schema  
{

    cinemaID:ObjectId,

    seatNo:number,

    isBooked:boolean

}  







