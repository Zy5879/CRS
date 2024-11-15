import { Route, Routes } from "react-router-dom";
import HomePage from "../HomePage/HomePage";
import { LoginPage } from "../LoginPage/LoginPage";
import { SignUpPage } from "../SignUpPage/SignUpPage";
import { AdminLogin } from "../AdminLogin/AdminLogin";
import Vehicle from "../VehicleContent/Vehicle";

export default function RouteProvider() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/vehicles" element={<Vehicle />} />
    </Routes>
  );
}
