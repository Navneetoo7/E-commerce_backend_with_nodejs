const express = require("express");
const router = express.Router();
const auth = require("../middleware/authorization");
const { check, validationResult } = require("express-validator");
const Product = require("../models/Product");

router.post(
  "/",
  [
    auth,
    [
      check("name", "Name is required").not().isEmpty(),
      check("description", "description is required").not().isEmpty(),
      check("category", "category is required").not().isEmpty(),
      check("quantity", "quantity is required").not().isEmpty(),
      check("price", "price is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.statusCode(400).json({ errors: errors.array() });
    }
    try {
      console.log("user body", req.body);
      console.log("user data", req.user);
      const { name, description, category, quantity, price, brand } = req.body;
      const newProduct = new Product({
        userId: req.user.id,
        name,
        category,
        quantity,
        description,
        price,
        brand,
      });
      const product = await newProduct.save();
      res.json({ product });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

// get all product
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// get specific product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(400).json({ msg: "Product not there or not found" });
    }
    res.json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
module.exports = router;
