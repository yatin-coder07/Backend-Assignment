"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";

export default function Home() {
  const [role, setRole] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [assigned, setAssigned] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      try {
        const userRes = await api.get("/auth/me/");
        const userRole = userRes.data.role;
        const userId = userRes.data.id;

        setRole(userRole);

        // ✅ FIXED PROFILE FETCH
        try {
          if (userRole === "patient") {
            const res = await api.get("/patients/");
            const myProfile = res.data.find(
              (p: any) => p.user === userId
            );
            setProfile(myProfile);
          }

          if (userRole === "doctor") {
            const res = await api.get("/doctors/");
            const myProfile = res.data.find(
              (d: any) => d.user === userId
            );
            setProfile(myProfile);
          }
        } catch {
          setProfile(null);
        }

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

  const handleDelete = async () => {
    try {
      if (role === "patient") {
        await api.delete(`/patients/delete/${profile.id}/`);
      }
      if (role === "doctor") {
        await api.delete(`/doctors/delete/${profile.id}/`);
      }

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      router.push("/auth/login");
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      if (role === "patient") {
        await api.put(`/patients/update/${profile.id}/`, profile);
      }
      if (role === "doctor") {
        await api.put(`/doctors/update/${profile.id}/`, profile);
      }
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* PROFILE SECTION */}
        {profile && (
          <div className="bg-white border border-blue-200 rounded-xl p-6 mb-10 shadow-sm">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">
              Your Profile
            </h2>

            {!editing ? (
              <>
                <p className="text-lg font-medium text-blue-800">
                  {profile.name}
                </p>

                {role === "patient" && (
                  <>
                    <p className="text-gray-600">Age: {profile.age}</p>
                    <p className="text-gray-500">{profile.condition}</p>
                  </>
                )}

                {role === "doctor" && (
                  <p className="text-gray-600">
                    {profile.specialization}
                  </p>
                )}

                <div className="flex gap-4 mt-4">
                  <button
                    onClick={handleUpdate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Update
                  </button>

                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </>
            ) : (
              <>
                <input
                  className="border p-2 w-full mb-2 rounded"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                />

                {role === "patient" && (
                  <>
                    <input
                      className="border p-2 w-full mb-2 rounded"
                      value={profile.age}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          age: e.target.value,
                        })
                      }
                    />
                    <textarea
                      className="border p-2 w-full mb-2 rounded"
                      value={profile.condition}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          condition: e.target.value,
                        })
                      }
                    />
                  </>
                )}

                {role === "doctor" && (
                  <input
                    className="border p-2 w-full mb-2 rounded"
                    value={profile.specialization}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        specialization: e.target.value,
                      })
                    }
                  />
                )}

                <div className="flex gap-4 mt-3">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 bg-gray-400 text-white rounded"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* EXISTING UI */}
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