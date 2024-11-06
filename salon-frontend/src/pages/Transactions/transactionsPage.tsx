"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Appointment } from "@/lib/types/types";
import Navbar from "@/pages/Navbar/navbar";

interface Transaction extends Omit<Appointment, "state" | "ownerId"> {
    totalCost: number;
    tip: number;
    taxRate: number;
    total: number;
}

const initialAppointments: Appointment[] = [
    {
        id: "1",
        time: "10:00 AM",
        appLength: "60",
        date: new Date("2023-06-01"),
        services: [
            { service: "Manicure", tech: "Alice" },
            { service: "Pedicure", tech: "Bob" },
        ],
        involvedEmployees: ["Alice", "Bob"],
        state: "CONFIRMED",
        ownerId: "user1",
        hasTransaction: true,
    },
    {
        id: "2",
        time: "2:00 PM",
        appLength: "90",
        date: new Date("2023-06-02"),
        services: [
            { service: "Full Set", tech: "Charlie" },
            { service: "Gel Polish", tech: "Diana" },
        ],
        involvedEmployees: ["Charlie", "Diana"],
        state: "CONFIRMED",
        ownerId: "user2",
        hasTransaction: true,
    },
];

// Mock service prices
const servicePrices: { [key: string]: number } = {
    Manicure: 30,
    Pedicure: 40,
    "Full Set": 60,
    "Gel Polish": 35,
};

export default function TransactionsPage() {
    const [appointments, setAppointments] =
        useState<Appointment[]>(initialAppointments);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [selectedItem, setSelectedItem] = useState<
        Appointment | Transaction | null
    >(null);
    const [serviceCosts, setServiceCosts] = useState<{ [key: string]: number }>(
        {}
    );
    const [tip, setTip] = useState(0);
    const [taxRate, setTaxRate] = useState(0.08); // 8% tax rate
    const [filter, setFilter] = useState("");
    const [activeTab, setActiveTab] = useState("transactions");

    useEffect(() => {
        if (selectedItem) {
            const costs: { [key: string]: number } = {};
            selectedItem.services.forEach((service) => {
                costs[service.service] = servicePrices[service.service] || 0;
            });
            setServiceCosts(costs);
        }
    }, [selectedItem]);

    const handleItemSelect = (item: Appointment | Transaction) => {
        setSelectedItem(item);
        setTip(0);
    };

    const calculateTotal = () => {
        const subtotal = Object.values(serviceCosts).reduce(
            (sum, cost) => sum + cost,
            0
        );
        const taxAmount = subtotal * taxRate;
        return subtotal + tip + taxAmount;
    };

    const handleCreateTransaction = () => {
        if (selectedItem && "state" in selectedItem) {
            const newTransaction: Transaction = {
                ...selectedItem,
                totalCost: Object.values(serviceCosts).reduce(
                    (sum, cost) => sum + cost,
                    0
                ),
                tip: tip,
                taxRate: taxRate,
                total: calculateTotal(),
            };
            setTransactions([...transactions, newTransaction]);
            setAppointments(
                appointments.filter((apt) => apt.id !== selectedItem.id)
            );
            setSelectedItem(null);
            setServiceCosts({});
            setTip(0);
        }
    };

    const handleUpdateTransaction = () => {
        if (selectedItem && !("state" in selectedItem)) {
            const updatedTransactions = transactions.map((trans) =>
                trans.id === selectedItem.id
                    ? {
                          ...trans,
                          totalCost: Object.values(serviceCosts).reduce(
                              (sum, cost) => sum + cost,
                              0
                          ),
                          tip: tip,
                          taxRate: taxRate,
                          total: calculateTotal(),
                      }
                    : trans
            );
            setTransactions(updatedTransactions);
            setSelectedItem(null);
            setServiceCosts({});
            setTip(0);
        }
    };

    const filteredItems =
        activeTab === "appointments"
            ? appointments.filter((apt) =>
                  apt.services.some(
                      (service) =>
                          service.service
                              .toLowerCase()
                              .includes(filter.toLowerCase()) ||
                          service.tech
                              .toLowerCase()
                              .includes(filter.toLowerCase())
                  )
              )
            : transactions.filter((trans) =>
                  trans.services.some(
                      (service) =>
                          service.service
                              .toLowerCase()
                              .includes(filter.toLowerCase()) ||
                          service.tech
                              .toLowerCase()
                              .includes(filter.toLowerCase())
                  )
              );

    return (
        <div>
            <Navbar />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Nail Salon Payment</h1>

                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="mb-6"
                >
                    <TabsList>
                        <TabsTrigger value="appointments">
                            Appointments
                        </TabsTrigger>
                        <TabsTrigger value="transactions">
                            Transactions
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="appointments">
                        <Card>
                            <CardHeader>
                                <CardTitle>Appointments</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4">
                                    <Input
                                        placeholder="Filter appointments..."
                                        value={filter}
                                        onChange={(e) =>
                                            setFilter(e.target.value)
                                        }
                                    />
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date & Time</TableHead>
                                            <TableHead>Services</TableHead>
                                            <TableHead>Technicians</TableHead>
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredItems.map((apt) => (
                                            <TableRow key={apt.id}>
                                                <TableCell>
                                                    {apt.date.toLocaleDateString()}{" "}
                                                    {apt.time}
                                                </TableCell>
                                                <TableCell>
                                                    {apt.services
                                                        .map((s) => s.service)
                                                        .join(", ")}
                                                </TableCell>
                                                <TableCell>
                                                    {apt.involvedEmployees.join(
                                                        ", "
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        onClick={() =>
                                                            handleItemSelect(
                                                                apt
                                                            )
                                                        }
                                                    >
                                                        Select
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="transactions">
                        <Card>
                            <CardHeader>
                                <CardTitle>Transactions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4">
                                    <Input
                                        placeholder="Filter transactions..."
                                        value={filter}
                                        onChange={(e) =>
                                            setFilter(e.target.value)
                                        }
                                    />
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date & Time</TableHead>
                                            <TableHead>Services</TableHead>
                                            <TableHead>Technicians</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredItems.map((trans) => (
                                            <TableRow key={trans.id}>
                                                <TableCell>
                                                    {trans.date.toLocaleDateString()}{" "}
                                                    {trans.time}
                                                </TableCell>
                                                <TableCell>
                                                    {trans.services
                                                        .map((s) => s.service)
                                                        .join(", ")}
                                                </TableCell>
                                                <TableCell>
                                                    {trans.involvedEmployees.join(
                                                        ", "
                                                    )}
                                                </TableCell>
                                                <TableCell>$ 100</TableCell>
                                                <TableCell>
                                                    <Button
                                                        onClick={() =>
                                                            handleItemSelect(
                                                                trans
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {selectedItem && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                {selectedItem.services.map((service, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-4 items-center gap-4"
                                    >
                                        <Label
                                            htmlFor={`service-cost-${index}`}
                                        >
                                            {service.service} Cost
                                        </Label>
                                        <Input
                                            id={`service-cost-${index}`}
                                            type="number"
                                            value={
                                                serviceCosts[service.service] ||
                                                0
                                            }
                                            onChange={(e) =>
                                                setServiceCosts({
                                                    ...serviceCosts,
                                                    [service.service]: Number(
                                                        e.target.value
                                                    ),
                                                })
                                            }
                                            className="col-span-3"
                                        />
                                    </div>
                                ))}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="tip">Tip</Label>
                                    <Input
                                        id="tip"
                                        type="number"
                                        value={tip}
                                        onChange={(e) =>
                                            setTip(Number(e.target.value))
                                        }
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="tax-rate">Tax Rate</Label>
                                    <Select
                                        onValueChange={(value) =>
                                            setTaxRate(Number(value))
                                        }
                                    >
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select tax rate" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0.08">
                                                8%
                                            </SelectItem>
                                            <SelectItem value="0.10">
                                                10%
                                            </SelectItem>
                                            <SelectItem value="0.12">
                                                12%
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <div className="text-2xl font-bold">
                                Total: ${calculateTotal().toFixed(2)}
                            </div>
                            {activeTab === "appointments" ? (
                                <Button onClick={handleCreateTransaction}>
                                    Create Transaction
                                </Button>
                            ) : (
                                <Button onClick={handleUpdateTransaction}>
                                    Update Transaction
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                )}
            </div>
        </div>
    );
}
