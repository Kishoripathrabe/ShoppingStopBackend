const mongoose = require('mongoose');
const Chance = require('chance');
const { ObjectId } = require('mongodb');

export class DemoController {

  static FusionSchemaDemoProduct = new mongoose.Schema({}, { strict: false });
  static DemoProduct = mongoose.model('demo_product', DemoController.FusionSchemaDemoProduct)
  
  static FusionSchemaDemoOrder = new mongoose.Schema({}, { strict: false });
  static DemoOrder = mongoose.model('demo_order', DemoController.FusionSchemaDemoOrder);
  
  static FusionSchemaDemoCustomer = new mongoose.Schema({}, { strict: false });
  static DemoCustomer = mongoose.model('demo_customer', DemoController.FusionSchemaDemoCustomer);
  

  static async addDemoOrder(req, res, next) {

    const savedFusion = await DemoController.DemoOrder.insertMany([
      { "idz": 1001, "customer_id": 1, "product_id": 101, "quantity": 1, "order_date": "2021-06-15", "status": "Shipped" },
      { "idz": 1002, "customer_id": 1, "product_id": 103, "quantity": 2, "order_date": "2021-07-20", "status": "Pending" },
      { "idz": 1003, "customer_id": 2, "product_id": 102, "quantity": 1, "order_date": "2021-08-25", "status": "Delivered" },
      { "idz": 1004, "customer_id": 3, "product_id": 104, "quantity": 3, "order_date": "2021-09-10", "status": "Cancelled" },
      { "idz": 1005, "customer_id": 4, "product_id": 105, "quantity": 1, "order_date": "2021-10-05", "status": "Shipped" }
    ])

    res.send({ data: savedFusion })
    console.log(savedFusion);
  }

  static async addDemoCustomer(req, res, next) {

    const savedFusion = await DemoController.DemoCustomer.insertMany([
      { "idz": 1, "name": "Alice Johnson", "email": "alice@example.com", "age": 30, "address": "123 Maple St, Springfield", "join_date": "2020-01-15" },
      { "idz": 2, "name": "Bob Smith", "email": "bob@example.com", "age": 35, "address": "456 Oak St, Springfield", "join_date": "2021-03-20" },
      { "idz": 3, "name": "Charlie Brown", "email": "charlie@example.com", "age": 25, "address": "789 Pine St, Springfield", "join_date": "2019-07-11" },
      { "idz": 4, "name": "Diana Prince", "email": "diana@example.com", "age": 28, "address": "101 Elm St, Springfield", "join_date": "2018-11-30" }
    ])

    res.send({ data: savedFusion })
    console.log(savedFusion);
  }

  static async addDemoProduct(req, res, next) {
  
    const savedFusion = await DemoController.DemoProduct.insertMany([
      { "idz": 101, "name": "Laptop", "category": "Electronics", "price": 1200, "stock": 30 },
      { "idz": 102, "name": "Smartphone", "category": "Electronics", "price": 800, "stock": 50 },
      { "idz": 103, "name": "Tablet", "category": "Electronics", "price": 600, "stock": 40 },
      { "idz": 104, "name": "Headphones", "category": "Accessories", "price": 150, "stock": 100 },
      { "idz": 105, "name": "Keyboard", "category": "Accessories", "price": 50, "stock": 150 }
    ])

    res.send({ data: savedFusion })
    console.log(savedFusion);

  }

  static async getDemoQ1(req, res, next) {
    // Find all customers who placed an order for a product in the "Electronics" category.


    /*

    // const result = await Order.aggregate([
//     {
//         $lookup: {
//             from: 'products',
//             localField: 'product_id',
//             foreignField: '_id',
//             as: 'product_details'
//         }
//     },
//     { $unwind: '$product_details' },
//     { $match: { 'product_details.category': 'Electronics' } },
//     {
//         $lookup: {
//             from: 'customers',
//             localField: 'customer_id',
//             foreignField: '_id',
//             as: 'customer_details'
//         }
//     },
//     { $unwind: '$customer_details' },
//     {
//         $group: {
//             _id: '$customer_details._id',
//             name: { $first: '$customer_details.name' },
//             email: { $first: '$customer_details.email' }
//         }
//     }
// ]);
// res.json(result);

[
  {
    $lookup: {
      from: "demo_products",
      localField: "product_id",
      foreignField: "idz",
      as: "product_details",
    },
  },
  {
    $unwind:
    
    {
      path: "$product_details",
      },
  },
  {
  $match: {
    "product_details.category": "Electronics",
    },
},
{
  $lookup:
  {
    from: "demo_customers",
      localField: "customer_id",
        foreignField: "idz",
          as: "customer_details",
      },
},
{
  $unwind: {
    path: "$customer_details",
    },
},
{
  $group: {
    _id: "$customer_id",
      name: {
      $first: "$customer_details.name",
      },
  },
},
]



    */

    await DemoController.DemoCustomer.aggregate(
      [
        {
          $lookup:
          {
            from: "demo_orders",
            localField: "idz",
            foreignField: "customer_id",
            as: "my_orders",
          },
        },
        {
          $unwind:
          {
            path: "$my_orders",
          },
        },
        {
          $lookup:
          {
            from: "demo_products",
            localField: "my_orders.product_id",
            foreignField: "idz",
            as: "product",
          },
        },
        {
          $unwind:
          {
            path: "$product",
          },
        },
        {
          $match: {
            "product.category": "Electronics",
          },
        },
        {
          $group:
          {
            _id: "$idz",
            name: {
              $first: "$name",
            },
          },
        },
      ])
  }
  static async getDemoQ2(req, res, next) {
    // Controller 2: Calculate the total amount spent by each customer
    /*
[
  {
    $lookup:

    {
      from: "demo_orders",
        localField: "idz",
          foreignField: "customer_id",
            as: "orderz",
      },
  },
  {
  $unwind:

  {
    path: "$orderz",
      },
},
{
  $lookup: {
    from: "demo_products",
      localField: "orderz.product_id",
        foreignField: "idz",
          as: "product_details",
    },
},
{
  $unwind: {
    path: "$product_details",
    },
},
{
  $group: {
    _id: {
      name: "$name",
        email: "$email",
      },
    // Group by customer's name and email
    total_spent: {
      $sum: {
        $multiply: [
          "$orderz.quantity",
          "$product_details.price",
        ],
        },
    }, 
  },
},
]
    */
  }
  static async getDemoQ3(req,res,next){
    // Controller 3: List all products that have never been ordered


    /*
[
  {
    $lookup:

    {
      from: "demo_orders",
        localField: "idz",
          foreignField: "product_id",
            as: "my_order",
      },
  },
  {
  $match: {
    "my_order.0": {
      $exists: false,
      },
  },
},

]
    */


    /*

    [
  {

    {
      from: "demo_orders",
        localField: "idz",
          foreignField: "product_id",
            as: "my_order",
      },
  },
  {
  $match: {
    $expr: {
      $eq: [
        {
          $size: "$my_order",
        },
        0,
      ],
      },
  },
}
]

    */












    /*
    [
  {
    $group:
    {
      _id: "$product_id",
      },
  },
  {
  $lookup:

  {
    from: "demo_products",
      localField: "_id",
        foreignField: "idz",
          as: "result",
      },
},
{
  $unwind: {
    path: "$result",
    },
},
{
  $lookup:

  {
    from: "demo_products",
      localField: "result.__v",
        foreignField: "__v",
          as: "all",
      },
},
{
  $match: {
    "result.idz": {
      $ne: "all.idz",
      },
  },
},
]

    */
  }


  static async getDemoQ4(){
    // Aggregation to get the most recent order for each customer

    /*

[
  {
    $lookup: {
      from: "demo_orders",
      localField: "idz",
      foreignField: "customer_id",
      as: "my_order",
    },
  },
  {
    $unwind:

    {
      path: "$my_order",
      },
  },
  {
  $sort:
  {
    "my_order.order_date": -1,
      },
},
{
  $group: {
    _id: "$idz",
      my_sorted_order: {
      $push: "$my_order",
      },
  },
},
{
  $project: {
    my_sorted_order_new: {
      $first: "$my_sorted_order",
      },
  },
},
{
  $lookup: {
    from: "demo_customers",
      localField: "_id",
        foreignField: "idz",
          as: "Customer_Details",
    },
},
{
  $unwind: {
    path: "$Customer_Details",
    },
},
]






[
  {
    $sort: {
      order_date: -1,
    },
  },
  {
    $group: {
      _id: "$customer_id",
      recent: {
        $first: "$$ROOT",
      },
    },
  },
  {
    $lookup:

    {
      from: "demo_customers",
        localField: "_id",
          foreignField: "idz",
            as: "customer_details",
      },
  },
]




*/

  }



  

  static async getDemoQ5(){
    // Find the average age of customers who have placed at least one order
    /*
[
  {
    $match: {
      $expr: {
        $ne: ["$status", "Cancelled"],
      },
    },
  },
  {
    $group:
      {
        _id: "$customer_id",
      },
  },
  {
    $lookup:
      {
        from: "demo_customers",
        localField: "_id",
        foreignField: "idz",
        as: "customer_details",
      },
  },
  {
    $unwind:
      {
        path: "$customer_details",
      },
  },
  {
    $group: {
      _id: "",
      avg_age: {
        $avg: "$customer_details.age",
      },
    },
  },
]




[
  {
    $lookup: {
      from: 'demoorders',
      localField: 'idz',
      foreignField: 'customer_id',
      as: 'orders'
    }
  },
  {
    $match: {
      'orders.0': { $exists: true }
    }
  },
  {
    $group: {
      _id: null,
      averageAge: { $avg: "$age" }
    }
  },
  {
    $project: {
      _id: 0,
      averageAge: 1
    }
  }
]);




    */
}

  static async getDemoQ6() {
    // List all products with their total number of orders and total quantity ordered
/*
[
  {
    $lookup:
      {
        from: "demo_orders",
        localField: "idz",
        foreignField: "product_id",
        as: "orders",
      },
  },
  {
    $project: {
      name: 1,
      num_of_orders: {
        $size: "$orders",
      },
      quantity_order: {
        $sum: "$orders.quantity",
      },
    },
  },
]
*/

  }
}
