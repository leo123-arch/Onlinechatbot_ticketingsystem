import { useState } from "react";
import FakePayment from "../components/FakePayment";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

function Booking() {

  const [showPayment, setShowPayment] = useState(false);
  const [seats, setSeats] = useState(1);
  const navigate = useNavigate();

  const price = 200;
  const total = seats * price;

  const handleSuccess = async (payment) => {
    await addDoc(collection(db, "bookings"), {
      seats,
      amount: total,
      paymentId: payment.paymentId,
      createdAt: new Date()
    });

    alert("Booking Successful 🎉");
    setShowPayment(false);
  };

  return (
    
<div className="relative min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-[350px]">

        <button
  onClick={() => navigate("/dashboard")}
  className="absolute top-6 left-6 bg-white shadow px-4 py-2 rounded-lg hover:bg-gray-100"
>
  ⬅ Back
</button>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-6">
          🎟️ Book Your Ticket
        </h1>

        {/* Ticket Card */}
        <div className="bg-indigo-500 text-white p-5 rounded-xl mb-6">
          <h2 className="text-lg font-semibold">Museum Entry</h2>
          <p className="text-sm opacity-80">Price per seat: ₹{price}</p>
        </div>

        {/* Seat Selector */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">Select Seats</label>

          <div className="flex items-center justify-between border rounded-lg p-2">
            <button
              onClick={() => setSeats(prev => Math.max(1, prev - 1))}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              -
            </button>

            <span className="text-lg font-semibold">{seats}</span>

            <button
              onClick={() => setSeats(prev => prev + 1)}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              +
            </button>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center mb-6">
          <span className="font-medium">Total Amount</span>
          <span className="text-xl font-bold text-indigo-600">
            ₹{total}
          </span>
        </div>

        {/* Pay Button */}
        <button
          onClick={() => setShowPayment(true)}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl transition"
        >
          Pay Now 💳
        </button>

      </div>

      {/* Payment Modal */}
      {showPayment && (
        <FakePayment
          amount={total}
          onSuccess={handleSuccess}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
}

export default Booking;