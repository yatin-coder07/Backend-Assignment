"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading , setLoading]=useState(false)

  const handleLogin = async () => {
    setLoading(true)
    try {
      const res = await api.post("/auth/login/", {
        email,
        password,
      });

      const access = res.data.tokens.access;
    const refresh = res.data.tokens.refresh;

    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);

    const payload = JSON.parse(atob(access.split(".")[1]));
    localStorage.setItem("role", payload.role);

      
      alert("Login Successful!")
      setLoading(false)
      router.push("/");
    } catch (err) {
      alert("Invalid credentials");
      setLoading(false)
    }
  };

  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-1/2 bg-blue-600 text-white flex items-center justify-center text-4xl font-bold">
        Welcome Back
      </div>

      {/* RIGHT */}
      <div className="w-1/2 flex items-center justify-center bg-white">
        <div className="w-80 space-y-4">
          <h2 className="text-2xl font-semibold text-black">Login</h2>

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

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
           {loading ?"Logging you in...":"Login"}
          </button>

          <p
            className="text-sm text-blue-600 cursor-pointer"
            onClick={() => router.push("/auth/register")}
          >
            Create account
          </p>
        </div>
      </div>
    </div>
  );
}