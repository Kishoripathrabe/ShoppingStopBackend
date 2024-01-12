import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { auth } from "../middleware";

export class UserRouter {
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
        this.router.patch('/add/wishlist',auth, UserController.addToWishlist);

    }
    postRoutes() {
        this.router.post('/signup',UserController.signup);
    }
    getRoutes() {
        this.router.get('/login',UserController.login);
        this.router.get('/get/all/products',auth, UserController.getAllProducts);

    }
}

export default new UserRouter().router;