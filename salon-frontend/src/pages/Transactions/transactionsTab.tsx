"use client";

import { useState } from "react";
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
import { SalonTransaction } from "@/lib/types/types";
interface TransactionTabProps {
    transactions: SalonTransaction[];
    idToNameMapping: Map<string, string>;
    handleTransactionSelect: (item: SalonTransaction)=>void;
}

export default function TransactionsTab({
    transactions,
    idToNameMapping,
    handleTransactionSelect,
}: TransactionTabProps) {
    const [filter, setFilter] = useState("");

    const filteredItems = transactions.filter((trans) =>
        trans.services.some(
            (service) =>
                service.service.toLowerCase().includes(filter.toLowerCase()) ||
                service.tech.toLowerCase().includes(filter.toLowerCase())
        )
    );
    return (
        <Card>
            <CardHeader>
                <CardTitle>Transactions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <Input
                        placeholder="Filter transactions..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
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
                            <TableRow key={item.transId}>
                                <TableCell>
                                    {item.date.toLocaleDateString()} {item.time}
                                </TableCell>
                                <TableCell>
                                    {item.services
                                        .map((s) => s.service)
                                        .join(", ")}
                                </TableCell>
                                <TableCell>
                                    {item.involvedEmployees
                                        .map((employeeId) => {
                                            if (
                                                employeeId &&
                                                idToNameMapping.has(employeeId)
                                            ) {
                                                return idToNameMapping.get(
                                                    employeeId
                                                );
                                            }
                                            return "";
                                        })
                                        .join(",")}
                                </TableCell>
                                <TableCell>
                                    {item.totalCost
                                        ? `$${item.totalCost.toFixed(2)}`
                                        : "$0.00"}
                                </TableCell>
                                <TableCell>
                                    {item.tip
                                        ? `$${item.tip.toFixed(2)}`
                                        : "$0.00"}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        onClick={() => {
                                            handleTransactionSelect(item);
                                        }}
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
    );
}
