import { useState } from "react";
import FakePayment from "../components/FakePayment";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

function Booking() {

  const [showPayment, setShowPayment] = useState(false);

  const seats = 2;
  const price = 200;
  const total = seats * price;

  const handleSuccess = async (payment) => {

    await addDoc(collection(db, "bookings"), {
      seats: seats,
      amount: total,
      paymentId: payment.paymentId,
      createdAt: new Date()
    });

    alert("Booking Successful 🎉");

    setShowPayment(false);
  };

  return (
    <div className="p-10">

      <h1 className="text-2xl font-bold mb-6">
        Total: ₹{total}
      </h1>

      <button
        onClick={() => setShowPayment(true)}
        className="bg-blue-500 text-white px-6 py-3 rounded"
      >
        Pay Now
      </button>

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