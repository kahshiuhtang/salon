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
import CreateTransactionForm from "@/pages/Transactions/createTransactionForm";
import TransactionEditor from "@/pages/Transactions/transactionEditor";
import { Appointment, SalonTransaction } from "@/lib/types/types";

export default function TransactionsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [transactions, setTransactions] = useState<SalonTransaction[]>([]);
    const [selectedApp, setSelectedApp] = useState<Appointment | null>(null);
    const [selectedTrans, setSelectedTrans] = useState<SalonTransaction | null>(
        null
    );
    const [filter, setFilter] = useState("");
    const [activeTab, setActiveTab] = useState("transactions");

    useEffect(() => {
        fetchUnprocessedApps();
        fetchTransactions();
    }, []);

    useEffect(() => {
        setSelectedTrans(null);
        setSelectedApp(null);
    }, [activeTab]);
    const {
        getUnprocessedApps,
        getTransactions,
        createTransaction,
        updateTransaction,
    } = useTransaction();

    async function fetchUnprocessedApps() {
        const apps = await getUnprocessedApps();
        setAppointments(apps);
    };

    async function fetchTransactions() {
        const trans = await getTransactions();
        setTransactions(trans);
    };

    function handleAppSelect(item: Appointment){
        setSelectedApp(item);
        setSelectedTrans(null);
    };
    function handleTransactionSelect(item: SalonTransaction){
        setSelectedApp(null);
        setSelectedTrans(item);
    };
    async function handleCreateTransaction(
        newTransaction: SalonTransaction
    ){
        const trans = await createTransaction({ transaction: newTransaction });
        setTransactions([...transactions, trans]);
        setAppointments(appointments.filter((apt) => apt.id !== trans.id));
        setSelectedTrans(null);
        setSelectedApp(null);
    };

    async function handleUpdateTransaction(
        updatedTransaction: SalonTransaction
    ){

        const entireTransactionInd = transactions.findIndex((item)=> item.transId == updatedTransaction.transId);
        if(entireTransactionInd < 0){
            return;
        }
        const transToUpdate = transactions[entireTransactionInd];
        transToUpdate.taxRate = updatedTransaction.taxRate;
        transToUpdate.totalCost = updatedTransaction.totalCost;
        transToUpdate.tip = updatedTransaction.tip;
        await updateTransaction({
            updatedTransaction: transToUpdate,
            transactionId: transToUpdate.id,
        });
        const updatedTransactions = transactions.map((trans) =>
            trans.transId === updatedTransaction.transId ? transToUpdate : trans
        );
        setTransactions(updatedTransactions);
        setSelectedTrans(transToUpdate);
        setSelectedApp(null);
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
                                                        onClick={() => {
                                                            if (
                                                                !(
                                                                    "totalCost" in
                                                                    apt
                                                                )
                                                            ) {
                                                                handleAppSelect(
                                                                    apt
                                                                );
                                                            } else {
                                                                handleTransactionSelect(
                                                                    apt
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        {!("totalCost" in apt)
                                                            ? "Close Appointment"
                                                            : "View Details"}
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
                                            <TableHead>Subtotal</TableHead>
                                            <TableHead>Tip</TableHead>
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredItems.map((item) => (
                                            <TableRow
                                                key={
                                                    "transId" in item
                                                        ? item.transId
                                                        : item.id
                                                }
                                            >
                                                <TableCell>
                                                    {item.date.toLocaleDateString()}{" "}
                                                    {item.time}
                                                </TableCell>
                                                <TableCell>
                                                    {item.services
                                                        .map((s) => s.service)
                                                        .join(", ")}
                                                </TableCell>
                                                <TableCell>
                                                    {item.involvedEmployees.join(
                                                        ", "
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {"totalCost" in item
                                                        ? `$${item.totalCost.toFixed(
                                                              2
                                                          )}`
                                                        : "$0.00"}
                                                </TableCell>
                                                <TableCell>
                                                    {"tip" in item
                                                        ? `$${item.tip.toFixed(
                                                              2
                                                          )}`
                                                        : "$0.00"}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        onClick={() => {
                                                            if (
                                                                !(
                                                                    "totalCost" in
                                                                    item
                                                                )
                                                            ) {
                                                                handleAppSelect(
                                                                    item
                                                                );
                                                            } else {
                                                                handleTransactionSelect(
                                                                    item
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        {!("totalCost" in item)
                                                            ? "Close Appointment"
                                                            : "View Details"}
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

                {selectedApp && activeTab !== "transactions" && (
                    <CreateTransactionForm
                        appointment={selectedApp}
                        onCreateSubmit={handleCreateTransaction}
                    />
                )}

                {selectedTrans && activeTab == "transactions" && (
                    <TransactionEditor
                        transaction={selectedTrans}
                        onEditSubmit={handleUpdateTransaction}
                    />
                )}
            </div>
        </div>
    );
}
