"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";

export default function Home() {
  const [role, setRole] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [assigned, setAssigned] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      try {
        const userRes = await api.get("/auth/me/");
        const userRole = userRes.data.role;
        setRole(userRole);
    
        if (userRole === "patient") {
          const res = await api.get("/doctors/");
          setData(res.data);
    
          try {
            const mappingRes = await api.get("/mappings/");
            setAssigned(mappingRes.data);
          } catch {
            setAssigned([]);
          }
        }
    
        if (userRole === "doctor") {
          const res = await api.get("/patients/");
          setData(res.data);
    
          try {
            const mappingRes = await api.get("/mappings/");
            setAssigned(mappingRes.data);
          } catch {
            setAssigned([]);
          }
        }
      } catch {
        setRole(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleClick = (id: number) => {
    if (role === "patient") router.push(`/doctor/${id}`);
    if (role === "doctor") router.push(`/patient/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-semibold text-blue-900 mb-8">
          {role === "patient" && "Available Doctors"}
          {role === "doctor" && "All Patients"}
        </h1>

        {loading && <div className="text-blue-600">Loading...</div>}

        {!loading && data.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {data.map((item) => (
              <div
                key={item.id}
                onClick={() => handleClick(item.id)}
                className="cursor-pointer bg-white border border-blue-100 rounded-xl p-5 shadow-sm hover:shadow-md transition"
              >
                <h2 className="text-xl font-semibold text-blue-800 mb-2">
                  {item.name}
                </h2>

                {role === "patient" && (
                  <p className="text-gray-600">
                    {item.specialization}
                  </p>
                )}

                {role === "doctor" && (
                  <>
                    <p className="text-gray-600">Age: {item.age}</p>
                    <p className="text-gray-500 text-sm">
                      {item.condition}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && assigned.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold text-blue-800 mb-6">
              {role === "patient" && "Your Doctors"}
              {role === "doctor" && "Your Patients"}
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assigned.map((m) => (
                <div
                  key={m.id}
                  onClick={() =>
                    handleClick(
                      role === "patient" ? m.doctor : m.patient
                    )
                  }
                  className="cursor-pointer bg-blue-100 border border-blue-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                >
                  <h2 className="text-xl font-semibold text-blue-900">
                    {role === "patient"
                      ? m.doctor_name
                      : m.patient_name}
                  </h2>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}