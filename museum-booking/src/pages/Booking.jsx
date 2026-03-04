import { useState } from "react";
import { db } from "../firebase";
import { doc, updateDoc, addDoc, collection } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Booking() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const show = location.state;
  const [seats, setSeats] = useState(1);

  const handleBooking = async () => {
    if (seats > show.availableSeats) {
      alert("Not enough seats available!");
      return;
    }

    // 1️⃣ Create booking
    await addDoc(collection(db, "bookings"), {
      userId: user.uid,
      showId: show.id,
      seats,
      totalPrice: seats * show.price,
      createdAt: new Date(),
    });

    // 2️⃣ Update available seats
    await updateDoc(doc(db, "shows", show.id), {
      availableSeats: show.availableSeats - seats,
    });

    alert("Booking Successful!");
    navigate("/shows");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">{show.title}</h1>

      <p>Price per seat: ₹{show.price}</p>

      <input
        type="number"
        min="1"
        value={seats}
        onChange={(e) => setSeats(Number(e.target.value))}
        className="border p-2 mt-4"
      />

      <button
        onClick={handleBooking}
        className="mt-4 bg-green-500 text-white px-6 py-2 rounded"
      >
        Confirm Booking
      </button>
    </div>
  );
}

export default Booking;