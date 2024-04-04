import User from "../models/User";
import * as jwt from "jsonwebtoken";
import Product from "../models/Product";
import Order from "../models/Order";
import UserActivity from "../models/UserActivity";
export class AdminController {


  static addproduct(req,res,next){
      let userProduct = req.body;
      const newProduct = new Product(userProduct)
      newProduct.save().then(data => {
        res.send(data);
      })
  }
  static getAllProducts(req,res,next){
    Product.find({},{ __v: 0}).then(data =>{
      res.send(data);
    })
  }
  
  static editProduct(req,res,next){
    let data = req.body.value;
        Product.findOneAndUpdate({_id: data._id}, { $set: data }, {new: true}).exec().then((data) => {
            res.status(200).send(data);
        }).catch(err => {
            res.status(500).send(err)
        });
}

static  deleteProduct(req,res,next){
  const productId = req.params.id;
  Product.findOne({ _id : productId }).then(data =>{
    if (!data) {
      return res.json({ error: 'Product not found' });
    }
    return data.deleteOne();
  }).then(() => {
    res.json({ message: 'Product deleted successfully' });
  }).catch(err => {
    res.json({ error: err.message });
  });
  }
  static async getCustomersData(req,res,next){
    let userArr = await User.find({});
    let customersData = await Promise.all(
      userArr.map((user: any)=>{
      if(user.type == 'customer'){
        return {email:user.email , first_name: user.first_name,
          last_name: user.last_name,
          wishlist:user.wishlist,
          cart: user.cart,
          address: user.address,
          orders: user.orders,
          userId: user._id
        };
      }
    }))
    let customerData = await customersData.filter((customer: any) => customer );
    res.send(customerData);
  }
  static async getCustomersInfo(req,res,next) {
    let userId = req.params.userId;
    let user = await User.findOne({_id: userId});
    let orderArr = await Promise.all(user.orders.map(async (order: any) =>{
       let data = (await Order.findOne({_id: order._id}));
       return data;
    }))   
    res.send({user,orderArr});
  }

  static async updateOrderStatus(req,res,next){
    let oId = req.body.orderId;
    let oStatus = req.body.orderStatus;
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString('en-US', { timeZone: 'UTC' });
    await Order.findOneAndUpdate({_id: oId},{status:oStatus,final_date: formattedDate},{new:true});
    res.send({msg:"Order Status Updated Successfully"})
  }
  static async getActivity(req,res,next) {
    let userID = req.params.userId;
    let activities = await UserActivity.find({ userID: userID});
    res.send({activities});
  }
}
