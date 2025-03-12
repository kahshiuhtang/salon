"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTransaction } from "@/lib/hooks/useTransaction";
import { Appointment, SalonTransaction } from "@/lib/types/types";
import { useUsers } from "@/lib/hooks/useUsers";
import Navbar from "@/pages/Navbar/navbar";
import CreateTransactionForm from "@/pages/Transactions/createTransactionForm";
import TransactionEditor from "@/pages/Transactions/transactionEditor";
import { useAppointment } from "@/lib/hooks/useAppointment";
import AppointmentsTab from "./appointmentsTab";
import TransactionsTab from "./transactionsTab";

export default function TransactionsPage() {
    const { getEmployeeFromId } = useUsers();

    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [transactions, setTransactions] = useState<SalonTransaction[]>([]);
    const [selectedApp, setSelectedApp] = useState<Appointment | null>(null);
    const [selectedTrans, setSelectedTrans] = useState<SalonTransaction | null>(
        null
    );
    const [idToNameMapping, setIdToNameMapping] = useState<Map<string, string>>(
        new Map()
    );
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
    const { updateAppointment } = useAppointment();

    async function fetchUnprocessedApps() {
        const apps = await getUnprocessedApps();
        setAppointments(apps);
    }
    async function getEmployeeIdToNameMap(transArr: SalonTransaction[]) {
        let tmp = new Map();
        for (const transaction of transArr) {
            for (const employeeId of transaction.involvedEmployees) {
                if (tmp.has(employeeId)) {
                    continue;
                }
                const employee = await getEmployeeFromId({
                    userId: employeeId,
                });
                tmp.set(employeeId, employee.firstName);
            }
        }
        setIdToNameMapping(tmp);
    }
    async function fetchTransactions() {
        const trans = await getTransactions();
        setTransactions(trans);
        await getEmployeeIdToNameMap(trans);
    }

    function handleAppSelect(item: Appointment) {
        setSelectedApp(item);
        setSelectedTrans(null);
    }
    function handleTransactionSelect(item: SalonTransaction) {
        setSelectedApp(null);
        setSelectedTrans(item);
    }
    async function handleCreateTransaction(
        newTransaction: SalonTransaction,
        app: Appointment
    ) {
        const trans = await createTransaction({ transaction: newTransaction });
        await updateAppointment(app);
        setTransactions([...transactions, trans]);
        setAppointments(appointments.filter((apt) => apt.id !== trans.id));
        setSelectedTrans(null);
        setSelectedApp(null);
    }

    async function handleUpdateTransaction(
        updatedTransaction: SalonTransaction
    ) {
        const entireTransactionInd = transactions.findIndex(
            (item) => item.transId == updatedTransaction.transId
        );
        if (entireTransactionInd < 0) {
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
    }

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
                        <div className="flex">
                            <AppointmentsTab
                                handleAppSelect={handleAppSelect}
                                appointments={appointments}
                                idToNameMapping={idToNameMapping}
                            />
                            {selectedApp && activeTab !== "transactions" && (
                                <CreateTransactionForm
                                    appointment={selectedApp}
                                    onCreate={handleCreateTransaction}
                                />
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value="transactions">
                        <div className="flex">
                            <div className="mr-3">
                            <TransactionsTab
                                handleTransactionSelect={
                                    handleTransactionSelect
                                }
                                transactions={transactions}
                                idToNameMapping={idToNameMapping}
                            />
                            </div>
                            {selectedTrans && activeTab == "transactions" && (
                                <TransactionEditor
                                    transaction={selectedTrans}
                                    onEditSubmit={handleUpdateTransaction}
                                />
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
