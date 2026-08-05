import Header from "./components/Header";
import Home from "./pages/Home";

import "./styles/App.css";

function App() {
  return (
    <div className="app">
      <Header />

      <main className="main-container">
        <Home />
      </main>
    </div>
  );
}

export default App;