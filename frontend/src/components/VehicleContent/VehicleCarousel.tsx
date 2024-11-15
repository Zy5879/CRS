import luxury from "../../assets/images/luxury.png";
import sedan from "../../assets/images/sedan.png";
import pickup from "../../assets/images/pickup.png";
import minivan from "../../assets/images/minivan.png";
import suv from "../../assets/images/suv.png";
import "./Vehicle.module.css";
import { Button } from "@mantine/core";

const data = [
  {
    type: "Sedan",
    image: sedan,
  },
  {
    type: "SUV",
    image: suv,
  },
  {
    type: "Pickup Truck",
    image: pickup,
  },
  {
    type: "Luxury Car",
    image: luxury,
  },
  {
    type: "Minivan",
    image: minivan,
  },
];

export default function VehicleCarousel() {
  return (
    <section>
      <h4 style={{ textAlign: "center" }} className="vt">
        <span>Check Out Our Cars</span>
      </h4>
      <div className="vc" style={{ display: "flex" }}>
        {data.map((item, i) => (
          <div key={i}>
            <img src={item.image} />
            <p>{item.type}</p>
          </div>
        ))}
      </div>
      <div
        style={{ display: "flex", justifyContent: "center" }}
        className="vNav"
      >
        <Button>Browse Vehicles</Button>
      </div>
    </section>
  );
}
