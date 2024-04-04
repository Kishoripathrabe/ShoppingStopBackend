import { Router } from "express";
import { AdminController } from "../controllers/AdminController";
import { adminauth, auth } from "../middleware";

export class AdminRouter {
    public router: Router ;
    constructor() {
        this.router = Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }
    deleteRoutes() {
        this.router.delete('/delete/product/:id', adminauth, AdminController.deleteProduct);
    }
    patchRoutes() {
        this.router.patch('/edit/product',adminauth,AdminController.editProduct);
        this.router.patch('/update/orderstatus',adminauth,AdminController.updateOrderStatus);

    }
    postRoutes() {
        this.router.post('/add/product',adminauth,AdminController.addproduct);
    }
    getRoutes() {
        this.router.get('/get/all/products',adminauth,AdminController.getAllProducts);
        this.router.get('/get/customer/data', adminauth, AdminController.getCustomersData);
        this.router.get('/get/customer/info/:userId', adminauth, AdminController.getCustomersInfo);
        this.router.get('/get/activity/:userId', auth,AdminController.getActivity );
    }
}

export default new AdminRouter().router;