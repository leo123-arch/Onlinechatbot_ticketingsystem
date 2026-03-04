import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Shows() {
  const navigate = useNavigate();

  const [shows, setShows] = useState([]);

  useEffect(() => {
    const fetchShows = async () => {
      const querySnapshot = await getDocs(collection(db, "shows"));
      const showList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setShows(showList);
    };

    fetchShows();
  }, []);

  return (
    
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Available Shows</h1>

      <div className="grid grid-cols-3 gap-6">
        {shows.map((show) => (
          <div key={show.id} className="bg-white p-4 shadow rounded">
            <h2 className="text-xl font-bold">{show.title}</h2>
            <p>Date: {show.date?.toDate().toLocaleDateString()}</p>{" "}
            <p>Time: {show.time}</p>
            <p>Price: ₹{show.price}</p>
            <p>Seats: {show.availableSeats}</p>
            <button
              onClick={() => navigate("/booking", { state: show })}
              className="mt-3 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Shows;
