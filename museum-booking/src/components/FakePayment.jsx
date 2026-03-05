import { useState } from "react";

function FakePayment({ amount, onSuccess, onClose }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = () => {
    setLoading(true);

    // simulate payment delay
    setTimeout(() => {
      onSuccess({
        paymentId: "FAKE_" + Date.now()
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-xl w-96 text-center">

        <h2 className="text-2xl font-bold mb-4">Fake Payment Gateway</h2>

        <p className="mb-6">
          Amount to Pay: <span className="font-bold">₹{amount}</span>
        </p>

        <button
          onClick={handlePayment}
          className="bg-green-500 text-white px-6 py-2 rounded-lg mr-3"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

        <button
          onClick={onClose}
          className="bg-gray-400 text-white px-6 py-2 rounded-lg"
        >
          Cancel
        </button>

      </div>
    </div>
  );
}

export default FakePayment;