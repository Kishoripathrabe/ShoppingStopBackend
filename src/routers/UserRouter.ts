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
        this.router.patch('/add/tocart',auth, UserController.addToCart);
        this.router.patch('/decrease/product/quantity',auth, UserController.decreaseQuantity);
        this.router.patch('/increase/product/quantity',auth, UserController.increaseQuantity);
        this.router.patch('/delete/product/cart',auth, UserController.deleteFromCart);
        this.router.patch('/update/me',auth,UserController.updateMe)
        this.router.patch('/edit/address', auth, UserController.editAddress);
        this.router.patch('/delete/address', auth, UserController.deleteAddress);

    }
    postRoutes() {
        this.router.post('/signup',UserController.signup);
        this.router.post('/create/address',auth,UserController.addAddress);
        this.router.post('/place/order',auth,UserController.placeOrder);
        this.router.post('/post/rating', auth,UserController.postRating );
        this.router.post('/add/activity', auth, UserController.addActivity);
    }
    getRoutes() {
        this.router.get('/login',UserController.login);
        this.router.get('/get/all/products',auth, UserController.getAllProducts);
        this.router.get('/get/wishlist',auth, UserController.getWishlist);
        this.router.get('/get/cart/products',auth, UserController.getCartProducts);
        this.router.get('/get/fetchme',auth,UserController.fetchMe)
        this.router.get('/get/productbyid/:prodId',auth,UserController.getProductById);
        this.router.get('/get/address', auth,UserController.getAddresses );
        this.router.get('/get/addressbyid/:addId', auth,UserController.getAddressesById );
        this.router.get('/get/orderhistory', auth,UserController.getOrders );
        this.router.get('/get/search/item', auth, UserController.getSearchItem);
        this.router.get('/get/search/count', auth, UserController.getSearchCount);
        this.router.get('/get/myrating/:prodId', auth,UserController.getMyRating );
        this.router.get('/get/avg/product/rating/:prodId', auth,UserController.getAvgProductRating );
        this.router.get('/get/isproduct/delivered/:prodId', auth,UserController.getIsProductDelivered );  
        this.router.get('/get/isproduct/delivered/:prodId', auth,UserController.getIsProductDelivered );    

    }
}

export default new UserRouter().router;