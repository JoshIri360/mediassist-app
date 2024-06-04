import { MedicationsForm } from "@/components/ui/medications";

export default function PatientHomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Medications</h1>
      <p className="text-gray-600">
        This page will contain all your medications and will remind you when you
        need to take them.
      </p>
      <MedicationsForm />
    </div>
  );
}
