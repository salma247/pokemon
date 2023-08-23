import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import PokemonDetails from "./components/PokemonDetails";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemon/:pokemon" element={<PokemonDetails />} />
      </Routes>
  );
}

export default App;