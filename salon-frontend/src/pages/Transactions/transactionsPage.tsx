"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/pages/Navbar/navbar";
import { useTransaction } from "@/lib/hooks/useTransaction";
import CreateTransactionForm from "./createTransactionForm";
import TransactionDetails from "@/pages/Transactions/transactionDetails";
import { Appointment, SalonTransaction } from "@/lib/types/types";


export default function TransactionsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [transactions, setTransactions] = useState<SalonTransaction[]>([]);
    const [selectedItem, setSelectedItem] = useState<
        Appointment | SalonTransaction | null
    >(null);
    const [filter, setFilter] = useState("");
    const [activeTab, setActiveTab] = useState("transactions");
    const { getUnprocessedApps, getTransactions } = useTransaction();

    const fetchUnprocessedApps = async function () {
        const apps = await getUnprocessedApps();
        setAppointments(apps);
    };

    const fetchTransactions = async function () {
        const trans = await getTransactions();
        setTransactions(trans);
    };

    useEffect(() => {
        fetchUnprocessedApps();
        fetchTransactions();
    }, []);

    useEffect(() => {
        setSelectedItem(null);
    }, [activeTab]);

    const handleItemSelect = (item: Appointment | SalonTransaction) => {
        setSelectedItem(item);
    };

    const handleCreateTransaction = (newTransaction: SalonTransaction) => {
        setTransactions([...transactions, newTransaction]);
        setAppointments(
            appointments.filter((apt) => apt.id !== newTransaction.id)
        );
        setSelectedItem(null);
    };

    // const handleUpdateTransaction = (updatedTransaction: SalonTransaction) => {
    //     const updatedTransactions = transactions.map((trans) =>
    //         trans.id === updatedTransaction.id ? updatedTransaction : trans
    //     );
    //     setTransactions(updatedTransactions);
    //     setSelectedItem(null);
    // };

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
                        <TabsTrigger value="transactions">
                            Transactions
                        </TabsTrigger>
                        <TabsTrigger value="appointments">
                            Appointments
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
                                                        Close Appointment
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
                                                <TableCell>
                                                    ${"totalCost" in trans ? trans.totalCost.toFixed(2) : "0"}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        onClick={() =>
                                                            handleItemSelect(
                                                                trans
                                                            )
                                                        }
                                                    >
                                                        View Details
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

                {selectedItem && "state" in selectedItem && (
                    <CreateTransactionForm
                        appointment={selectedItem}
                        onCreateSubmit={handleCreateTransaction}
                    />
                )}

                {selectedItem && !("state" in selectedItem) && (
                    <TransactionDetails transaction={selectedItem} />
                )}
            </div>
        </div>
    );
}
