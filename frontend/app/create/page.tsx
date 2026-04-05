"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CreateProfilePage() {
    const router = useRouter()
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [doctorData, setDoctorData] = useState({
    name: "",
    specialization: "",
  });

  const [patientData, setPatientData] = useState({
    name: "",
    age: "",
    condition: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me/");
        setRole(res.data.role);
        console.log(res.data)
      } catch {
        setRole(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleDoctorSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/doctors/create/", doctorData);
    } finally {
      alert("Doctor Created")
      router.push("/")
      setSubmitting(false);
    }
  };

  const handlePatientSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
  
    try {
      const res = await api.post("/patients/create/", {
        ...patientData,
        age: Number(patientData.age),
      });
  
      alert("Patient Created ✅");
      router.push("/");
    } catch (err: any) {
      console.log(err.response?.data); 
      alert("Error creating patient ❌");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-lg font-medium">
        Loading profile setup...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-2xl font-semibold text-white mb-6 text-center">
          Complete Your Profile
        </h1>

        {role === "doctor" && (
          <form onSubmit={handleDoctorSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={doctorData.name}
                onChange={(e) =>
                  setDoctorData({ ...doctorData, name: e.target.value })
                }
                required
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Specialization
              </label>
              <input
                type="text"
                value={doctorData.specialization}
                onChange={(e) =>
                  setDoctorData({
                    ...doctorData,
                    specialization: e.target.value,
                  })
                }
                required
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-medium disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Doctor Profile"}
            </button>
          </form>
        )}

        {role === "patient" && (
          <form onSubmit={handlePatientSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={patientData.name}
                onChange={(e) =>
                  setPatientData({ ...patientData, name: e.target.value })
                }
                required
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Age
              </label>
              <input
                type="number"
                value={patientData.age}
                onChange={(e) =>
                  setPatientData({ ...patientData, age: e.target.value })
                }
                required
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Medical Condition
              </label>
              <textarea
                value={patientData.condition}
                onChange={(e) =>
                  setPatientData({
                    ...patientData,
                    condition: e.target.value,
                  })
                }
                required
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2 rounded-lg bg-green-600 hover:bg-green-700 transition text-white font-medium disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Patient Profile"}
            </button>
          </form>
        )}

        {!role && (
          <div className="text-center text-red-400">
            Unable to determine user role
          </div>
        )}
      </div>
    </div>
  );
}