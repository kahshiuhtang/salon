"use client";

import { useEffect, useState } from "react";
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
import { Appointment, SalonTransaction } from "@/lib/types/types";
import { useService } from "@/lib/hooks/useService";

export default function CreateTransactionForm({
    appointment,
    onCreateSubmit,
}: {
    appointment: Appointment;
    onCreateSubmit: (newTransaction: SalonTransaction) => void;
}) {
    const [defaultTaxRate] = useState(0.08); // 8% default tax rate
    const [total, setTotal] = useState(0);

    useEffect(() => {
        getCostMap();
    }, []);
    

    const { getSelectServices } = useService();

    const { register, handleSubmit, control, watch, reset } =
        useForm<SalonTransaction>({
            defaultValues: {
                transId: appointment.id,
                dateTransCreated: new Date(),
                totalCost: total,
                tip: 0,
                taxRate: defaultTaxRate,
                involvedEmployees: appointment.involvedEmployees,
            },
        });
    useEffect(() => {
        reset((formValues) => ({
            ...formValues,
            totalCost: total,
        }));
    }, [total, reset]);
    const watchTotalCost = watch("totalCost");
    const watchTip = watch("tip");
    const watchTaxRate = watch("taxRate");

    async function getCostMap() {
        const serviceIds: string[] = appointment.services.map((service) => {
            return service.service;
        });
        const costMap = await getSelectServices({ serviceIds });
        const tot = appointment.services.reduce((curTotal, service) => {
            const serviceCost = costMap.get(service.service)?.price || 0;
            return curTotal + serviceCost;
        }, 0);
        setTotal(tot);
    };

    function calculateTotal(){
        const subtotal = watchTotalCost;
        const tip = watchTip;
        const tax = subtotal * watchTaxRate;
        return (subtotal + tip + tax).toFixed(2);
    };

    function onSubmit(data: SalonTransaction){
        onCreateSubmit({ ...data, ...appointment });
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Create Transaction</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="totalCost">Total Cost</Label>
                        <Input
                            id="totalCost"
                            type="text"
                            readOnly
                            {...register("totalCost")}
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
                                    onChange={(e) =>
                                        field.onChange(
                                            parseFloat(e.target.value)
                                        )
                                    }
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
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full">
                        Create Transaction
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
