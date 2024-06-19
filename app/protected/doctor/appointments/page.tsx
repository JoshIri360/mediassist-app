"use client";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { db } from "@/firebase/config";
import { getDoc, doc, DocumentData } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  appointmentReason: string;
}

export default function DoctorAppointmentsPage() {
  const { user, role } = useAuthContext();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (role === "patient") {
      router.push("/protected/patient");
    }
  }, [user, role, router]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (user && role === "doctor") {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const hospitalPlaceId = userData.hospitalPlaceId;
            const doctorDoc = await getDoc(
              doc(db, "verifiedHospitals", hospitalPlaceId)
            );
            if (doctorDoc.exists()) {
              const data = doctorDoc.data() as DocumentData;
              const appointmentsData = await Promise.all(
                data.appointments.map(async (appointment: any) => {
                  const patientDoc = await getDoc(
                    doc(db, "users", appointment.patientId)
                  );
                  const patientName = patientDoc.exists()
                    ? patientDoc.data().name
                    : "Unknown";
                  return {
                    id: appointment.id,
                    patientId: appointment.patientId,
                    patientName: patientName,
                    date: appointment.date,
                    appointmentReason: appointment.appointmentReason,
                  };
                })
              );
              setAppointments(appointmentsData);
            }
          }
        } catch (error) {
          console.error("Error fetching appointments:", error);
        }
      }
    };
    fetchAppointments();
  }, [user, role]);

  const filteredAppointments = useMemo(() => {
    const searchValue = search.toLowerCase();
    return appointments.filter(
      (appointment) =>
        appointment.patientName.toLowerCase().includes(searchValue) ||
        new Date(appointment.date)
          .toLocaleString()
          .toLowerCase()
          .includes(searchValue) ||
        appointment.appointmentReason.toLowerCase().includes(searchValue)
    );
  }, [search, appointments]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Appointment List</h1>
      <div className="relative mb-6">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
        <Input
          type="search"
          placeholder="Search appointments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white shadow-none appearance-none pl-8 md:w-[300px] dark:bg-gray-950"
        />
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Reason</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.map((appointment, index) => (
              <TableRow
                key={appointment.id}
                className={`${
                  index % 2 === 0
                    ? "bg-gray-100 dark:bg-gray-800"
                    : "bg-white dark:bg-gray-950"
                }`}
              >
                <TableCell>{appointment.patientName}</TableCell>
                <TableCell>
                  {new Date(appointment.date).toLocaleString()}
                </TableCell>
                <TableCell>{appointment.appointmentReason}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
