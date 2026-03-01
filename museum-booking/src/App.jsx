import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
        <h1 className="text-4xl text-blue-500 font-bold">
  Tailwind Working 🚀
</h1>
    </BrowserRouter>
   
  );


}

export default App;