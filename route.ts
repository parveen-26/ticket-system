import { Router } from "express";
import TicketController from "./controller/ticket.controller";
export const router: Router = Router();

const ticketController = new TicketController();

router.post("/ticket", ticketController.create);
router.patch("/purchase-ticket", ticketController.purchaseTicket);
router.get("/purchase-consecutive", ticketController.purchaseConsecutive)
