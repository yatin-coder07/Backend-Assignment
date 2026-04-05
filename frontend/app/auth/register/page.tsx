"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const[loading,setLoading]=useState(false)

  const handleRegister = async () => {
    setLoading(true)
    try {
      await api.post("/auth/register/", {
        name,
        email,
        password,
        role,
      });

      const res = await api.post("/auth/login/", {
        email,
        password,
      });

      const { access, refresh } = res.data.tokens;

    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);

    
  setLoading(false)
     router.push("/create")
    } catch (err) {
      alert("Registration failed");
      setLoading(false)
    }
  };

  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-1/2 bg-black text-white flex items-center justify-center text-4xl font-bold">
        Join Us
      </div>

      {/* RIGHT */}
      <div className="w-1/2 flex items-center justify-center bg-white">
        <div className="w-80 space-y-4">
          <h2 className="text-2xl font-semibold text-black">Register</h2>

          <input
            className="w-full border p-2 rounded"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full border p-2 rounded"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <select
            className="w-full border p-2 rounded"
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>

          <button
            onClick={handleRegister}
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
           {loading ?"Wait...":"Register"}
          </button>

          <p
            className="text-sm text-blue-600 cursor-pointer"
            onClick={() => router.push("/auth/login")}
          >
            Already have an account?
          </p>
        </div>
      </div>
    </div>
  );
}