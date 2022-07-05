const Order = require("../models/order");
const Product = require("../models/productModel");
var _ = require("lodash");

async function updateStore(item) {
  Product.findOne({ id: item._id }, (err, doc) => {
    console.log(doc);
    console.log("--------------");
  });
}

exports.createOrder = async (req, res) => {
  try {
    const { _id } = req.user;
    const { productId, title, mainPrice, discount, quantity, status } =
      req.body;
    if (!_id)
      return res.status(400).json({ error: "Please Logout then log in." });

    const newOrder = new Order({
      user: _id,
      cartTotal: req.body.cartTotal,
      items: req.body.items,
    });

    newOrder.save(async (err, order) => {
      if (err) return res.status(400).json({ error: "Try Again." });
      if (order?.items?.length > 0) {
        let output_collections = [];
        for (let i = 0; i < order?.items?.length; i++) {
          let query = await Product.findOneAndUpdate(
            { _id: order?.items[i]._id },
            { $inc: { stock: -order?.items[i].quantity } }
          );
          // output_collections.push("<div>" + "</div>");
          // console.log(order?.items[i]);
          // console.log(query);
          console.log("--------------------");
        }
        res.send("OK");
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Something wrong, Try again." });
  }
};

// exports.createOrder = async (req, res) => {
//   try {
//     const { _id } = req.user;
//     // const { productId, title, mainPrice, discount, quantity, status } =
//     //   req.body;
//     if (!_id)
//       return res.status(400).json({ error: "Please Logout then log in." });

//     const newOrder = new Order({
//       user: _id,

//       cartTotal: req.body.cartTotal,
//        items: req.body.items,

//     });
//     newOrder.save(async(err, or) => {

//       if (err) return res.status(400).json({ error: "Try Again." });
//       if(or?.items?.length >  0) {

//         // or?.items?.forEach(async(item) => {
//         //   // const single = await Product.findOne({id: item._id})
//         //   // console.log(item._id);
//         //   // console.log(single);
//         //   // console.log("--------------");
//         //  await updateStore(item)
//         // })

//         // for(let i = 0; i < or?.items?.length; i++ ){
//         //   const single = await Product.findOne({id: or?.items[i]._id})
//         //   console.log(or?.items[i]._id);
//         //   console.log(single);
//         //   console.log("--------");
//         //   const updatedFild = {
//         //     stock: single.stock - or?.items[i]?.quantity,
//         //   };
//         //   const updateProduct = _.extend(single, updatedFild);
//         //   updateProduct.save((err, pro) => {
//         //     // console.log(pro);
//         //   });
//         // }
//       }

//       return res.status(201).json({ message: "Order Submited." });
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(400).json({ error: "Something wrong, Try again." });
//   }
// };

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate(
      "user",
      "pharmacyName name number"
    );
    orders.reverse();
    res.status(200).json(orders);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Something wrong, Try later." });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { _id } = req.user;
    const myOrder = await Order.find({ user: _id });
    myOrder.reverse();
    res.status(200).json(myOrder);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Something wrong, Try later." });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { _id, status } = req.body;
    if (!_id) return res.status(400).json({ error: "Invalid Product" });

    const order = await Order.findById(_id);
    if (!order) return res.status(400).json({ error: "Invalid Order" });
    const updatedOrder = _.extend(order, { status: status });
    updatedOrder.save((err, order) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      res.status(201).json({
        message: "Product Updated.",
      });
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Something wrong, Try later." });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) return res.status(400).json({ error: "Invalid Action" });
    const deletOrder = await Order.findByIdAndRemove(_id);
    res.status(201).json({
      message: "order Cancel Successfully.",
    });
  } catch (e) {
    res.status(500).json({ error: "Something wrong, Try later." });
  }
};

exports.singleOrder = async (req, res) => {
  try {
    const { _id } = req.user;
    if (!_id)
      return res.status(400).json({ error: "Please Logout then log in." });
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Invalid Action" });

    const myOrder = await Order.findOne({ _id: id }).populate("user");
    if (!myOrder) return res.status(400).json({ error: "Invalid Action" });

    res.status(200).json(myOrder);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Something wrong, Try later." });
  }
};
