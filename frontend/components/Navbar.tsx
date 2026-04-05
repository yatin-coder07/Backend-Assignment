"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me/");
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/auth/login";
  };

  return (
    <nav className="w-full px-6 py-3 flex items-center justify-between bg-white/10 backdrop-blur-xl border border-white/10 rounded-lg shadow-lg">
      <div className="text-white text-lg font-semibold tracking-wide">
        DoctorAI
      </div>

      <div className="flex items-center gap-4">
        {loading ? (
          <div className="text-sm text-gray-300">Loading...</div>
        ) : user ? (
          <>
            <div className="text-right">
              <p className="text-black text-sm font-medium">
                {user.name || user.email}
              </p>
              <p className="text-xs text-gray-400 capitalize">
                {user.role}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-1.5 rounded-md bg-red-500/80 hover:bg-red-600 transition text-white text-sm font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => (window.location.href = "/auth/login")}
            className="px-4 py-1.5 rounded-md bg-blue-500/80 hover:bg-blue-600 transition text-white text-sm font-medium"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}