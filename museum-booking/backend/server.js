const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: "YOUR_RAZORPAY_KEY_ID",
  key_secret: "YOUR_RAZORPAY_SECRET",
});

/*
  Create Razorpay Order
*/
app.post("/create-order", async (req, res) => {
  try {

    const { amount } = req.body;

    const options = {
      amount: amount * 100, // Razorpay works in paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order: order
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Order creation failed"
    });
  }
});

/*
  Test Route
*/
app.get("/", (req, res) => {
  res.send("Razorpay backend running");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});