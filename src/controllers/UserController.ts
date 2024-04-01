import User from "../models/User";
import * as jwt from "jsonwebtoken";
import Product from "../models/Product";
import Cart from "../models/Cart";
import Address from "../models/Address";
import Order from "../models/Order";
import Rating from "../models/Rating";
import {ObjectId} from 'mongodb'
import mongoose from "mongoose";
export class UserController {
  static async signup(req, res) {
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
    });
    let newUser = await user.save();
    const newCart = new Cart({ products: [] });
    // Save the cart to the database
    await newCart.save();
    // Update the user's cart reference with the new cart's ObjectId using findOneAndUpdate
    await User.findOneAndUpdate(
      { _id: newUser._id },
      { $set: { cart: newCart._id } }
    );
    return res.send(newUser);
  }

  static async login(req, res) {
    let userEmail = req.query.email;
    let userPassword = req.query.password;
    let data: any = await User.find({ email: userEmail });
    let user = data[0];
    if (user) {
      if (user.password === userPassword) {
        const token = jwt.sign(
          {
            email: user.email,
            userID: user._id,
            type: user.type,
          },
          "secret"
        );
        res.send({
          token,
          type: user.type,
          msg: "Logged in Successfully",
          statusCode: "200",
        });
      } else {
        return res.status(500).json({
          msg: "Error: Wrong Password",
          status_code: "500",
        });
      }
    } else {
      return res.status(500).json({
        msg: "Error: User Not Found",
        status_code: "500",
      });
    }
  }
  static async getSearchItem(req, res, next) {
    try {
      let searchvalue = req.query.searchvalue;
      let currentPage = req.query.currentPage;
      let pageSize = req.query.pageSize;
      const userID = req.userData.userID;
  
      const pipeline = [
        {
          $match: {

            $or: [
          
              { name: { $regex: '', $options: 'i' } }
          
            ]
          
          }
        },
        {
          $skip: (parseInt(currentPage) - 1) * parseInt(pageSize)
        },
        {
          $limit: parseInt(pageSize)
        },

        {
          $addFields:{UserId:  new ObjectId(userID)} 
        },


        {
          $lookup: {
            from: "users",
            localField: "UserId",
            foreignField: "_id",
            as: "user"
          }
        },
        {
          $unwind: "$user"
        },
        {
          $project:    {
            name: 1,
            price: 1,
            desc:1,
            _id:1,
            picUrl:1,
            user:1,
            inWishlist: { $in: ['$_id', '$user.wishlist']  }
          }
        },
        {
          $lookup: {
            from: "carts",
            localField: "user.cart",
            foreignField: "_id",
            as: "cartval"
            }
        },
        {
          $unwind : "$cartval"
        },
        {
          $project: {
            name: 1,
            price: 1,
            picUrl: 1,
            desc: 1,
            inWishlist: { $in: ['$_id', '$user.wishlist'] },
            inCart: {
              $cond: { if: "$cartval", then: { $in: ['$_id', '$cartval.products.productId'] }, else: false }
            }
          }
        }
      ];
  
      const modifiedData = await Product.aggregate(pipeline);
      res.send(modifiedData);
    } catch (error) {
      console.error("Error processing promises:", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }
  
  // static async getSearchItem(req, res, next) {
    
  //   let searchvalue = req.query.searchvalue;
  //   let currentPage = req.query.currentPage;
  //   let pageSize = req.query.pageSize;
   
   
  //   const data = await Product.find({
  //     $or: [
  //       { name: { $regex: searchvalue, $options: 'i' } }      ],
  //   }).skip((currentPage-1)*pageSize).limit(pageSize);
  //   const promises = data.map(async (prod: any) => {
  //     const userID = req.userData.userID;
  //     const user = await User.findOne({ _id: userID });

  //     // wishlist
  //     let wishlistProductIds = user.wishlist.map((data) => data.toString());
  //     if (wishlistProductIds.includes(prod._id.toString())) {
  //       prod.inWishlist = true;
  //     }
  //     // cart
  //     let cartProducts = await Cart.findOne({ _id: user.cart });
  //     let cartIdsArr = cartProducts.products.map((data) => {
  //       return data.productId.toString();
  //     });
  //     if (cartIdsArr.includes(prod._id.toString())) {
  //       prod.inCart = true;
  //     }
  //     return prod; // Return the modified product
  //   });

  //   // Wait for all promises to resolve before sending the response
  //   Promise.all(promises)
  //     .then((modifiedData) => {
  //       res.send(modifiedData);
  //     })
  //     .catch((error) => {
  //       console.error("Error processing promises:", error);
  //       res.status(500).send({ error: "Internal Server Error" });
  //     });
  // }
  static async getSearchCount(req,res,next) {
    let searchvalue = req.query.searchvalue;
    const data = await Product.find({
      $or: [
        { name: { $regex: searchvalue, $options: 'i' } }
      ],
    }).countDocuments();
   res.send({data:data});
  }
  
  // static async getAllProducts(req, res, next) {
  //   Product.find({}, { __v: 0 })
  //     .then(async (data: any) => {
  //       // Create an array of promises for each product
  //       const promises = data.map(async (prod: any) => {
  //         const userID = req.userData.userID;
  //         const user = await User.findOne({ _id: userID });

  //         // wishlist
  //         let wishlistProductIds = user.wishlist.map((data) => data.toString());
  //         if (wishlistProductIds.includes(prod._id.toString())) {
  //           prod.inWishlist = true;
  //         }
  //         // cart
  //         let cartProducts = await Cart.findOne({ _id: user.cart });
  //         let cartIdsArr = cartProducts.products.map((data) => {
  //           return data.productId.toString();
  //         });
  //         if (cartIdsArr.includes(prod._id.toString())) {
  //           prod.inCart = true;
  //         }
  //         return prod; // Return the modified product
  //       });

  //       // Wait for all promises to resolve before sending the response
  //       Promise.all(promises)
  //         .then((modifiedData) => {
  //           res.send(modifiedData);
  //         })
  //         .catch((error) => {
  //           console.error("Error processing promises:", error);
  //           res.status(500).send({ error: "Internal Server Error" });
  //         });
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching products:", error);
  //       res.status(500).send({ error: "Internal Server Error" });
  //     });
  // }
  static async getAllProducts(req, res, next) {
    try {
      const userID = req.userData.userID;
      const pipeline = [
        {
          $lookup: {
            from: "users",
            localField: "userID",
            foreignField: "_id",
            as: "user"
          }
        },
        {
          $unwind: "$user" // Unwind to handle the array created by $lookup
        },
        {
          $lookup: {
            from: "carts",
            localField: "user.cart",
            foreignField: "_id",
            as: "cart"
          }
        },
        {
          $unwind: {
            path: "$cart",
            preserveNullAndEmptyArrays: true // Preserve documents if user has no cart
          }
        },
        {
          $project: {
            name: 1,
            price: 1,
            inWishlist: {
              $in: ['$_id', '$user.wishlist']
            },
            inCart: {
              $cond: { if: "$cart", then: { $in: ['$_id', '$cart.products.productId'] }, else: false }
            }
          }
        }
      ];
  
      const modifiedData = await Product.aggregate(pipeline);
      res.send(modifiedData);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }

  static addToWishlist(req, res, next) {
    let userID = req.userData.userID;
    let pid = req.body.pid;
    let isAdded = true;
    let updatedData: any;
    User.find({ _id: userID }).then(async (data) => {
      let arr = data[0].wishlist;
      if (!arr.includes(pid)) {
        isAdded = true;
        updatedData = await User.findOneAndUpdate(
          { _id: userID },
          { $push: { wishlist: pid } },
          { new: true }
        );
      } else {
        isAdded = false;
        updatedData = await User.findOneAndUpdate(
          { _id: userID },
          { $pull: { wishlist: pid } },
          { new: true }
        );
      }
      let frontendData = {
        msg: isAdded ? "Added to Wishlist" : "Removed from wishlist",
        isAdded,
      };
      res.send(frontendData);
    });
  }
  // static async getWishlist(req, res, next) {
  //   try {
  //     const userID = req.userData.userID;
  //     const user = await User.findOne({ _id: userID });

  //     if (!user) {
  //       return res.status(404).json({ error: "User not found" });
  //     }

  //     const wishlistProductIds = user.wishlist;

  //     // Use Promise.all to wait for all product queries to complete
  //     let Products = await Promise.all(
  //       wishlistProductIds.map(async (productId) => {
  //         const singleProduct = await Product.findOne({ _id: productId });
  //         return singleProduct;
  //       })
  //     );

  //     const cartId = user.cart;

  //     let cartData=await Cart.findOne({_id:cartId})
  //     let cartArr=cartData.products;
  //     let cartIdArr=cartArr.map((prod:any)=>{
  //       return prod.productId.toString()
  //     })
  //     Products= await Promise.all(Products.map(data=>{
  //       if(cartIdArr.includes(data._id.toString())){
  //         data.inCart =true;
  //       }
  //       return data
  //     }))
  //     res.json(Products);
  //   } catch (error) {
  //     console.error("Error fetching wishlist:", error);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
    
  // }
  static async getWishlist(req,res,next) {
    try {
      const userID = req.userData.userID;
      const pipeline = [
        {
          $match:{
            _id: new ObjectId(userID)
          }
        },
      {
        $unwind: "$wishlist"
      },
      {
        $lookup:{
          from: "products",
          localField: "wishlist",
          foreignField: "_id",
          as: "product",
        }
      },
      {
        $unwind:{
          path: "$product",
        }
      },
      {
        $project:{
          _id: "$product._id",
          name: "$product.name",
          desc: "$product.desc",
          price: "$product.price",
          picUrl: "$product.picUrl",
          wishlist: 1,
          cart: 1
        }
      },
      {
        $lookup:{
         from: "carts",
         localField: "cart",
         foreignField: "_id",
         as: "cartval",
       }
      },
      {
        $unwind:{
          path: "$cartval",
        }
      },
      {
        $addFields:{
          inWishlist: true,
        }
      },
      {
        $project:{
          _id: 1,
          name: 1,
          desc: 1,
          price: 1,
          picUrl: 1,
          inWishlist: 1,
          inCart:{
            $in: ["$_id","$cartval.products.productId"],
          }
        }
      }
      ]
      const modifiedData = await User.aggregate(pipeline);      
      res.send(modifiedData);

    } catch (error) {
          console.error("Error fetching wishlist:", error);
          res.status(500).json({ error: "Internal Server Error" });
    }
    
  }

  static addToCart(req, res, next) {
    let prodId = req.body.pid;
    let userID = req.userData.userID;
    let updatedCart: any;

    User.find({ _id: userID }).then(async (data) => {
      let cartId = data[0].cart;
      let incartalready = false;
      let orgCart = await Cart.findOne({ _id: cartId });
      let pidArr = orgCart.products.map((data) => data.productId.toString());
      if (pidArr.includes(prodId.toString())) {
        incartalready = true;
        res.send({ msg: "Product Already in cart ", incartalready });
      } else {
        let item = { productId: prodId, quantity: 1 };
        updatedCart = await Cart.findOneAndUpdate(
          { _id: cartId },
          { $push: { products: item } },
          { new: true }
        );
        res.send({ msg: "Product is added to your cart", incartalready });
      }
    });
  }
  // static getCartProducts(req, res, next) {
  //   let userID = req.userData.userID;
  //   let updatedCart: any = [];
  //   User.findOne({ _id: userID }).then(async (userData) => {
  //     let cartId = userData.cart;
  //     let orgCart = await Cart.findOne({ _id: cartId });
  //     let oldproducts = orgCart.products;
  //     let newproducts = await Promise.all(
  //       oldproducts.map(async (oldp) => {
  //         let prodId = oldp.productId;
  //         let prodQ = oldp.quantity;
  //         let productdetails = await Product.findOne({ _id: prodId });
  //         let newObj = {
  //           _id: prodId,
  //           quantity: prodQ,
  //           orgProduct: productdetails,
  //         };
  //         return newObj;
  //       })
  //     );
  //     res.send(newproducts);
  //   });
  // }
  static async getCartProducts(req, res, next) {
    let userID = req.userData.userID;
    const pipeline =  [
      {
        '$match': {
          '_id': new ObjectId(userID)
        }
      }, {
        '$lookup': {
          'from': 'carts', 
          'localField': 'cart', 
          'foreignField': '_id', 
          'as': 'orgCart'
        }
      }, {
        '$unwind': {
          'path': '$orgCart'
        }
      }, {
        '$project': {
          'products': '$orgCart.products'
        }
      }, {
        '$unwind': {
          'path': '$products'
        }
      }, {
        '$project': {
          '_id': '$products.productId', 
          'quantity': '$products.quantity'
        }
      }, {
        '$lookup': {
          'from': 'products', 
          'localField': '_id', 
          'foreignField': '_id', 
          'as': 'orgProduct'
        }
      }, {
        '$unwind': {
          'path': '$orgProduct'
        }
      }
    ]
    const cartProducts = await User.aggregate(pipeline);            
    res.send(cartProducts); 
  }
  static decreaseQuantity(req,res,next) {
    let productId = req.body.prodId;
    let userID = req.userData.userID;
    User.findOne({_id : userID}).then(async (userData) =>{
      let cartId = userData.cart;
      let orgCart = await Cart.findOne({ _id: cartId });

      let oldproducts = orgCart.products;
      let newproducts=await Promise.all(oldproducts.map(prod=>{
        if(prod.productId.toString()==productId.toString()){
            prod.quantity=prod.quantity-1;
        }
        return prod
      }))
      await Cart.findOneAndUpdate({ _id: cartId},{$set:{products:newproducts}},{new:true});
      res.send({msg:"done"});
    })
  }
  static increaseQuantity(req,res,next) {
    let productId = req.body.prodId;
    let userID = req.userData.userID;
    User.findOne({_id : userID}).then(async (userData) =>{
      let cartId = userData.cart;
      let orgCart = await Cart.findOne({ _id: cartId });

      let oldproducts = orgCart.products;
      let newproducts=await Promise.all(oldproducts.map(prod=>{
        if(prod.productId.toString()==productId.toString()){
            prod.quantity=prod.quantity+1;
        }
        return prod
      }))
      await Cart.findOneAndUpdate({ _id: cartId},{$set:{products:newproducts}},{new:true});
      // let singleOldProd=oldproducts.filter(data=>{
      //     return data.productId==productId
      // })[0]
      // await Cart.findOneAndUpdate({_id: cartId}, {$pull : {products : singleOldProd}}, { new: true})
      // singleOldProd.quantity +=1;
      // await Cart.findOneAndUpdate({_id: cartId}, {$push : {products : singleOldProd}}, { new: true})

      res.send({msg:"done"});
    })
  }

  static deleteFromCart(req,res,next) {
    let productId = req.body.prodId;
    let userID = req.userData.userID;
    User.findOne({_id : userID}).then(async (userData) =>{
      let cartId = userData.cart;
      let orgCart = await Cart.findOne({ _id: cartId });

      let oldproducts = orgCart.products;
      let newproducts=await Promise.all(oldproducts.filter(prod=>{
       return (prod.productId.toString()!=productId.toString())
      }))
      await Cart.findOneAndUpdate({ _id: cartId},{$set:{products:newproducts}},{new:true});
      // let singleOldProd=oldproducts.filter(data=>{
      //     return data.productId==productId
      // })[0]
      // await Cart.findOneAndUpdate({_id: cartId}, {$pull : {products : singleOldProd}}, { new: true})
      // singleOldProd.quantity +=1;
      // await Cart.findOneAndUpdate({_id: cartId}, {$push : {products : singleOldProd}}, { new: true})

      res.send({msg:"done"});
    })
  }

  static async fetchMe(req,res,next){
    let user=await User.findOne({_id:req.userData.userID})
    res.send(user);
  }
  static async updateMe(req,res,next){
    let updatedData = req.body.updatedMe;
    let user = await User.findOneAndUpdate({_id:req.userData.userID},{$set : updatedData},{new:true});
    res.send(user);
  }
  static getProductById(req, res, next) {
    let prodId = req.params.prodId;
    let userID = req.userData.userID;
    Product.findOne({ _id: prodId }).then(async (product) => {
      let user = await User.findOne({ _id: userID });
      let wishlistArr = user.wishlist;
      wishlistArr.forEach((res: any) => {
        if (res._id.toString() == prodId) {
          product.inWishlist = true;
        }
      })
      let cartId = user.cart;
      let cart = await Cart.findOne({ _id: cartId });
      let cartProducts = cart.products;
      cartProducts.map((cproduct: any) => {
        if (cproduct.productId.toString() == prodId) {
          product.inCart = true;
        }
      });
      res.send(product);
    })
  }

  static async addAddress(req,res,next) {
    let address = req.body.addressdetails;
    delete address["_id"]
    let userID = req.userData.userID;
    const newAddress = new Address(address);
    let newaddress = await newAddress.save();
    // Update the user's cart reference with the new cart's ObjectId using findOneAndUpdate
    await User.findOneAndUpdate(
      { _id: userID},
      { $push:{ address: newaddress._id} },
      {new:true}
    );
    return res.send(newaddress);
  }

  static  getAddresses(req,res,next) {
    let userID = req.userData.userID;
    let addressId =[];
    let addressArray: any ;
    User.findOne({_id : userID}).then(async (userData:any) => {
      let addressArr = userData.address;
      addressArray = await Promise.all(addressArr.map(async (addressid) =>{
        let singleAddress = await Address.findOne({ _id: addressid});
        return (singleAddress);
      }))
      res.send(addressArray);
    })
  }
  static async editAddress(req, res,next) {
    let userAddress = req.body.editUserAddress;
    delete userAddress["isEditMode"];
    let singleAddress = await Address.findOneAndUpdate({_id : userAddress._id},
      {$set : userAddress},{new: true});
      res.send(singleAddress);
    }
  static async deleteAddress(req,res,next){
    let addId = req.body.addId;
    let data = await Address.findOne({_id:addId})
    data.deleteOne();
    let user =  await User.findOneAndUpdate({_id:req.userData.userID},{$pull:{address:addId}},{new:true})
    res.send({msg:"Deleted Successfully"})
  }
  static async getAddressesById(req,res,next){
    let addId = req.params.addId;
    let selectedAddress = await Address.findOne({_id: addId});
    res.send(selectedAddress);
  }

  static async placeOrder(req,res,next) {
    let orderedObj = req.body.placedOrder;
    const newOrder = new Order({
      address: orderedObj.address,
      cart: orderedObj.cart,
      MOP: orderedObj.MOP
    });
    let order = await newOrder.save();
    let updatedUser = await User.findOneAndUpdate({_id : req.userData.userID},{$push : {orders: order._id }},{new: true});
    let updatedCart = await Cart.findOneAndUpdate({_id: updatedUser.cart},{$set : { products: []}},{new: true});
    res.send({updatedUser,order,updatedCart});
  }
  static async getOrders(req,res,next) {
   let userID = await User.findOne({_id: req.userData.userID});
   let orderIdsArr = await userID.orders;
   let orderObjofArray = await Promise.all(orderIdsArr.map(async (orderId: any) =>{
     return Order.findOne({_id: orderId});
   }));
   res.send(orderObjofArray); 
  }

  static async getMyRating(req,res,next) {
    let userId = req.userData.userID;
    let prodId = req.params.prodId;
    let myrating = await Rating.findOne({userId:userId, prodId: prodId });
    res.send({data: myrating});   
  }
  static async getAvgProductRating(req,res,next) {
    let prodId = req.params.prodId;
    let avgRateValue = await Rating.aggregate([
      { $match: { prodId: new ObjectId(prodId) }},
      { $group: {
          _id: null,
          averageRating: { $avg: "$rateValue" }
        }
      }
    ])
    res.send({data: avgRateValue[0]});  
  }

  static async getIsProductDelivered(req,res,next){
    let prodId = req.params.prodId;
    let user = await User.findOne({ _id : req.userData.userID});
    let orderIdsArr = user.orders;
    let newOrderIdsArr:any = await Promise.all(orderIdsArr.map( async (res: any) => {
      let singleOrder = await Order.findOne({ _id: res._id});
     return (singleOrder.status == "Delivered")? singleOrder : false;
    }))
    let deliveredOrdersArr = newOrderIdsArr.filter((res: any) => !!res);
    let cartArr = deliveredOrdersArr?.map((res: any)=>{
      return res.cart;
    });
    let resultArr = cartArr?.reduce((p,i)=>{
      return [...i,...p];
    },[]);
    let resultIdsArr = resultArr?.map((res: any)=>{
      return res._id.toString();
    });
    res.send({data:resultIdsArr?.includes(prodId.toString())})
  }

  static async postRating(req,res,next) {
    let ratedValue = req.body.userRatedValue;
    let prodId = req.body.productId;
    let userId = req.userData.userID;
    await Rating.findOneAndUpdate(
      {  userId, prodId  },
      { $set: { rateValue: ratedValue } },
      { upsert: true , new: true }
    );
    res.send({msg: "updated successfully"});
  }
}
