"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { SalonTransaction } from "@/lib/types/types";
import { useUsers } from "@/lib/hooks/useUsers";

export default function TransactionEditor({
    transaction,
    onEditSubmit,
}: {
    transaction: SalonTransaction;
    onEditSubmit: (editedTransaction: SalonTransaction) => void;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [employeeNames, setEmployeeNames] = useState<string[]>([]);
    const { register, handleSubmit, control, watch, reset } =
        useForm<SalonTransaction>({defaultValues:{
            transId:transaction.transId,
            dateTransCreated: new Date(transaction.dateTransCreated),
            totalCost: transaction.totalCost,
            tip: transaction.tip,
            taxRate: transaction.taxRate,
        }});
    const { getEmployeeFromId } = useUsers();
    const watchTotalCost = watch("totalCost");
    const watchTip = watch("tip");
    const watchTaxRate = watch("taxRate");
    useEffect(() => {
        async function getInvolvedEmployees(){
            const employees: string[] = [];
            for(const employeeId of transaction.involvedEmployees){
                const employee = await getEmployeeFromId({"userId": employeeId});
                employees.push(employee.firstName);
            }
            setEmployeeNames(employees);
        }
        
        getInvolvedEmployees();
    }, [transaction]);

    function calculateTotal(){
        const subtotal = watchTotalCost || transaction.totalCost;
        const tip = watchTip || transaction.tip;;
        const tax = subtotal * (watchTaxRate || transaction.taxRate);
        return (subtotal + tip + tax).toFixed(2);
    };

    function onSubmit(data: SalonTransaction){
        onEditSubmit({ ...data, total: parseFloat(calculateTotal()) });
        setIsEditing(false);
    };

    function handleCancel() {
        reset();
        setIsEditing(false);
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Transaction Details</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="transId">Transaction ID</Label>
                        <Input
                            id="transId"
                            type="text"
                            readOnly
                            {...register("transId")}
                        />
                    </div>
                    <div>
                        <Label htmlFor="dateTransCreated">Date Created</Label>
                        <Input
                            id="dateTransCreated"
                            type="date"
                            value={new Date(transaction.dateTransCreated).toISOString().split('T')[0]}
                            readOnly
                        />
                    </div>
                    <div>
                        <Label htmlFor="totalCost">Total Cost</Label>
                        <Controller
                            name="totalCost"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    id="totalCost"
                                    type="number"
                                    step="0.01"
                                    {...field}
                                    onChange={(e) =>
                                        field.onChange(
                                            parseFloat(e.target.value)
                                        )
                                    }
                                    readOnly={!isEditing}
                                />
                            )}
                        />
                    </div>
                    <div>
                        <Label htmlFor="tip">Tip</Label>
                        <Controller
                            name="tip"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    id="tip"
                                    type="number"
                                    step="0.01"
                                    {...field}
                                    onChange={(e) =>
                                        field.onChange(
                                            parseFloat(e.target.value)
                                        )
                                    }
                                    readOnly={!isEditing}
                                />
                            )}
                        />
                    </div>
                    <div>
                        <Label htmlFor="taxRate">Tax Rate</Label>
                        <Controller
                            name="taxRate"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    id="taxRate"
                                    type="number"
                                    step="0.01"
                                    {...field}
                                    value={transaction.taxRate}
                                    onChange={(e) =>
                                        field.onChange(
                                            parseFloat(e.target.value)
                                        )
                                    }
                                    readOnly={!isEditing}
                                />
                            )}
                        />
                    </div>
                    <div>
                        <Label>Total (including tip and tax)</Label>
                        <div className="text-2xl font-bold">
                            ${calculateTotal()}
                        </div>
                    </div>
                    <div>
                        <Label>Involved Employees</Label>
                        <div>{employeeNames.join(", ")}</div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    {isEditing ? (
                        <>
                            <Button type="submit">Save Changes</Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={(e) =>{
                                    e.preventDefault();
                                    handleCancel();
                                }}
                            >
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <Button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                setIsEditing(true);
                            }}
                        >
                            Edit Transaction
                        </Button>
                    )}
                </CardFooter>
            </form>
        </Card>
    );
}