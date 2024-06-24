import { Router } from "express";
import { adminauth, auth } from "../middleware";
import { DemoController } from "../controllers/DemoController";

export class DemoRouter {
    public router: Router ;
    constructor() {
        this.router = Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }
    deleteRoutes() {
    }
    patchRoutes() {
    }
    postRoutes() {
        this.router.post('/add/demo_customer', DemoController.addDemoCustomer);
        this.router.post('/add/demo_order', DemoController.addDemoOrder)
        this.router.post('/add/demo_product', DemoController.addDemoProduct)
       }
    getRoutes() {
        this.router.get('/get/demo_q1', DemoController.getDemoQ1)
    }
}

export default new DemoRouter().router;