"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";

export default function DoctorPage() {
  const { id } = useParams();

  const [data, setData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [mappings, setMappings] = useState<any[]>([]);
  const [patientId, setPatientId] = useState<number | null>(null);
  const [assignedMapping, setAssignedMapping] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [doctorRes, userRes] = await Promise.all([
        api.get(`/doctors/get/${id}/`),
        api.get("/auth/me/"),
      ]);

      setData(doctorRes.data);
      setUser(userRes.data);

      if (userRes.data.role === "doctor") {
        const res = await api.get("/mappings/");
        const filtered = res.data.filter(
          (m: any) => m.doctor === Number(id)
        );
        setMappings(filtered);
      }

      if (userRes.data.role === "patient") {
        const patientRes = await api.get("/patients/");
        const myPatient = patientRes.data.find(
          (p: any) => p.user === userRes.data.id
        );

        if (myPatient) {
          setPatientId(myPatient.id);

          const mapRes = await api.get(
            `/mappings/patient/${myPatient.id}/`
          );

          const found = mapRes.data.find(
            (m: any) => m.doctor === Number(id)
          );

          setAssignedMapping(found || null);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const assignDoctor = async () => {
    if (!patientId) return;

    setActionLoading(true);
    try {
      await api.post("/mappings/create/", {
        patient: patientId,
        doctor: Number(id),
      });
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || "Assign failed");
    } finally {
      setActionLoading(false);
    }
  };

  const unassignDoctor = async () => {
    if (!assignedMapping) return;

    setActionLoading(true);
    try {
      await api.delete(
        `/mapping/delete/${assignedMapping.id}/`
      );
      fetchData();
    } catch {
      alert("Unassign failed");
    } finally {
      setActionLoading(false);
    }
  };

  const removePatient = async (mappingId: number) => {
    if (!confirm("Remove this patient?")) return;

    setActionLoading(true);
    try {
      await api.delete(`/mapping/delete/${mappingId}/`);
      fetchData();
    } catch {
      alert("Failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-blue-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 p-6">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* DOCTOR DETAILS */}
        <div className="bg-white border border-blue-100 rounded-xl p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-blue-900">
            {data.name}
          </h1>
          <p className="text-gray-600 mt-1">
            {data.specialization}
          </p>

          {/* PATIENT ACTION */}
          {user?.role === "patient" && (
            <div className="mt-4">
              {assignedMapping ? (
                <button
                  onClick={unassignDoctor}
                  disabled={actionLoading}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  {actionLoading
                    ? "Removing..."
                    : "Unassign Doctor"}
                </button>
              ) : (
                <button
                  onClick={assignDoctor}
                  disabled={actionLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  {actionLoading
                    ? "Assigning..."
                    : "Assign Doctor"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* DOCTOR VIEW: PATIENT LIST */}
        {user?.role === "doctor" && (
          <div className="bg-white border border-blue-100 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-blue-800 mb-4">
              Assigned Patients
            </h2>

            {mappings.length > 0 ? (
              mappings.map((m) => (
                <div
                  key={m.id}
                  className="flex justify-between items-center bg-blue-50 p-3 rounded mb-2"
                >
                  <span>{m.patient_name}</span>
                  <button
                    onClick={() => removePatient(m.id)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400">
                No patients assigned
              </p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}