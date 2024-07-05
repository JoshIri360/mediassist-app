import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


const invoices = [
  {
    id: "INV001",
    name: "Posi",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    date: "2023-03-15",
  },
  {
    id: "INV002",
    name: "Posi",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    date: "2023-03-15",
  },
  {
    id: "INV003",
    name: "Posi",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    date: "2023-03-15",
  },
  {
    id: "INV004",
    name: "Posi",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    date: "2023-03-15",
  },
  {
    id: "INV005",
    name: "Posi",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    date: "2023-03-15",
  },
  {
    id: "INV006",
    name: "Posi",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    date: "2023-03-15",
  },
  {
    id: "INV007",
    name: "Posi",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    date: "2023-03-15",
  },
]

type PaymentStatus = "Paid" | "Pending" | "Unpaid";

const statusClasses: Record<PaymentStatus, string> = {
  Paid: "border-green-700 text-green-700",
  Pending: "border-yellow-500 text-yellow-500",
  Unpaid: "border-red-600 text-red-600",
};

const EmergenciesPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Emergency List</h1>
      {/* Other components and content */}
      <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.id}</TableCell>
              <TableCell className="font-medium">{invoice.name}</TableCell>
              <TableCell>
                <button
                  className={`px-2 py-0.5 rounded-full border-2 w-20 text-center ${statusClasses[invoice.paymentStatus as PaymentStatus]}`}
                >
                  <span className="">·</span> {invoice.paymentStatus}
                </button>
              </TableCell>
              <TableCell>{invoice.totalAmount}</TableCell>
              <TableCell>{invoice.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>

    </div>

  );
};

export default EmergenciesPage;
