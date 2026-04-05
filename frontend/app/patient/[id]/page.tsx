"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";

export default function PatientPage() {
  const { id } = useParams();

  const [data, setData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [mappings, setMappings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const [patientRes, userRes, doctorRes, mappingRes] =
        await Promise.all([
          api.get(`/patients/get/${id}/`),
          api.get("/auth/me/"),
          api.get("/doctors/"),
          api.get(`/mappings/patient/${id}/`),
        ]);

      setData(patientRes.data);
      setUser(userRes.data);
      setDoctors(doctorRes.data);
      setMappings(mappingRes.data);
    } catch {
      alert("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const assignDoctor = async (doctorId: number) => {
    setActionLoading(doctorId);
    try {
      await api.post("/mapping/create/", {
        patient: Number(id),
        doctor: doctorId,
      });
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to assign");
    } finally {
      setActionLoading(null);
    }
  };

  const unassignDoctor = async (mappingId: number) => {
    setActionLoading(mappingId);
    try {
      await api.delete(`/mappings/delete/${mappingId}/`);
      fetchData();
    } catch {
      alert("Failed to unassign");
    } finally {
      setActionLoading(null);
    }
  };

  const isAssigned = (doctorId: number) =>
    mappings.find((m) => m.doctor === doctorId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-blue-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 p-6">
      <div className="max-w-3xl mx-auto space-y-6">

        <div className="bg-white border border-blue-100 rounded-xl p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-blue-900 mb-4">
            Patient Details
          </h1>

          <div className="space-y-2 text-gray-700">
            <p><span className="font-medium">Name:</span> {data.name}</p>
            <p><span className="font-medium">Age:</span> {data.age}</p>
            <p><span className="font-medium">Condition:</span> {data.condition}</p>
          </div>
        </div>

        <div className="bg-white border border-blue-100 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">
            Assigned Doctors
          </h2>

          {mappings.length > 0 ? (
            mappings.map((m) => (
              <div
                key={m.id}
                className="flex justify-between items-center bg-blue-50 p-3 rounded mb-2"
              >
                <span className="font-medium">{m.doctor_name}</span>

                {((user?.role === "patient" && data.user === user.id) ||
                  user?.role === "doctor") && (
                  <button
                    onClick={() => unassignDoctor(m.id)}
                    disabled={actionLoading === m.id}
                    className="text-red-500 text-sm"
                  >
                    {actionLoading === m.id ? "Removing..." : "Unassign"}
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400">No doctors assigned</p>
          )}
        </div>

        {user?.role === "patient" && data.user === user.id && (
          <div className="bg-white border border-blue-100 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">
              Assign Doctor
            </h2>

            {doctors.map((doc) => {
              const assigned = isAssigned(doc.id);

              return (
                <div
                  key={doc.id}
                  className="flex justify-between items-center bg-blue-50 p-3 rounded mb-2"
                >
                  <div>
                    <p className="font-medium text-blue-900">
                      {doc.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {doc.specialization}
                    </p>
                  </div>

                  {assigned ? (
                    <span className="text-green-600 text-sm font-medium">
                      Assigned
                    </span>
                  ) : (
                    <button
                      onClick={() => assignDoctor(doc.id)}
                      disabled={actionLoading === doc.id}
                      className="text-blue-600 text-sm font-medium"
                    >
                      {actionLoading === doc.id
                        ? "Assigning..."
                        : "Assign"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}