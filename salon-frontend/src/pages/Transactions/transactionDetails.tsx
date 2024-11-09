import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SalonTransaction } from "@/lib/types/types";

export default function TransactionDetails({
    transaction,
}: {
    transaction: SalonTransaction;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Transaction Details</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-2">
                    <div>
                        <strong>Date & Time:</strong>{" "}
                        {transaction.date.toLocaleDateString()}{" "}
                        {transaction.time}
                    </div>
                    <div>
                        <strong>Services:</strong>
                        <ul>
                            {transaction.services.map((service, index) => (
                                <li key={index}>
                                    {service.service} - {service.tech}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <strong>Technicians:</strong>{" "}
                        {transaction.involvedEmployees.join(", ")}
                    </div>
                    <div>
                        <strong>Total Cost:</strong> $
                        {transaction.totalCost.toFixed(2)}
                    </div>
                    <div>
                        <strong>Tip:</strong> ${transaction.tip.toFixed(2)}
                    </div>
                    <div>
                        <strong>Tax Rate:</strong>{" "}
                        {(transaction.taxRate * 100).toFixed(2)}%
                    </div>
                    <div className="text-xl font-bold mt-2">
                        <strong>Total:</strong> ${transaction.total.toFixed(2)}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
