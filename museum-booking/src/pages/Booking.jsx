import { useState } from "react";
import FakePayment from "../components/FakePayment";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

function Bookings() {

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [seatMap, setSeatMap] = useState({});

  const price = 200;

  // 🎯 Events Data (same as Home)
  const events = [
    { title: "Art Workshop", date: "April 15, 2025", time: "2:00 PM", spots: "25 spots left" },
    { title: "Guided Tour", date: "April 20, 2025", time: "11:00 AM", spots: "15 spots left" },
    { title: "Lecture Series", date: "April 25, 2025", time: "4:00 PM", spots: "40 spots left" }
  ];

  // 🪑 Seat Logic (per card)
  const getSeats = (i) => seatMap[i] || 1;

  const updateSeats = (i, value) => {
    setSeatMap(prev => ({
      ...prev,
      [i]: Math.max(1, value)
    }));
  };

  // 💳 Payment Success
  const handlePaymentSuccess = async (payment) => {
    const index = selectedEvent.index;
    const seats = getSeats(index);
    const total = seats * price;

    await addDoc(collection(db, "bookings"), {
      eventTitle: selectedEvent.title,
      eventDate: selectedEvent.date,
      eventTime: selectedEvent.time,
      seats,
      amount: total,
      paymentId: payment.paymentId,
      createdAt: new Date()
    });

    alert("Booking Successful 🎉");
    setShowPayment(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold mb-6 text-center">
        🎟 Book Events
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        {events.map((event, i) => {
          const seats = getSeats(i);
          const total = seats * price;

          return (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >

              {/* Image */}
              <img
                src={`https://source.unsplash.com/400x300/?event,${i}`}
                className="h-40 w-full object-cover"
              />

              {/* Content */}
              <div className="p-5">

                <h2 className="text-xl font-bold mb-2">
                  {event.title}
                </h2>

                <p className="text-sm text-gray-500">
                  📅 {event.date}
                </p>

                <p className="text-sm text-gray-500">
                  ⏰ {event.time}
                </p>

                <p className="text-xs text-purple-600 mb-3">
                  🎟 {event.spots}
                </p>

                {/* Seat Selector */}
                <div className="flex items-center justify-between mb-4 border rounded-lg p-2">
                  <button
                    onClick={() => updateSeats(i, seats - 1)}
                    className="px-3 bg-gray-200 rounded"
                  >
                    -
                  </button>

                  <span className="font-semibold">{seats}</span>

                  <button
                    onClick={() => updateSeats(i, seats + 1)}
                    className="px-3 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>

                {/* Total */}
                <p className="font-semibold mb-4">
                  Total: ₹{total}
                </p>

                {/* Pay Button */}
                <button
                  onClick={() => {
                    setSelectedEvent({ ...event, index: i });
                    setShowPayment(true);
                  }}
                  className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Pay & Book 💳
                </button>

              </div>
            </div>
          );
        })}

      </div>

      {/* Payment Modal */}
      {showPayment && (
        <FakePayment
          amount={
            getSeats(selectedEvent.index) * price
          }
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
        />
      )}

    </div>
  );
}

export default Bookings;