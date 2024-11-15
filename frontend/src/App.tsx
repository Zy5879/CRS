import Footer from "./components/Footer/Footer";
import { Navbar } from "./components/Navbar/Navbar";
import RouteProvider from "./components/RouteProvider/RouteProvider";

export default function App() {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Navbar />
      <RouteProvider />
      <Footer />
    </div>
  );
}
