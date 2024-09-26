import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import AvailabilityForm from "@/pages/Settings/availabilityForm";
export default function AvailabilityCard() {
    return (
        <div className="w-full mt-2">
            <Card className={"w-full"}>
                <CardHeader className="pl-8 pt-8 pb-0 mb-2">
                    <CardTitle>Create Availability Block</CardTitle>
                    <CardDescription>
                        Enter a block of time where you are free for future
                        scheduling and appointments.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AvailabilityForm />
                </CardContent>
            </Card>
        </div>
    );
}
