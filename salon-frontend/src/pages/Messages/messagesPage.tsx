import Navbar from "@/pages/Navbar/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MessagesPage() {
    return (
        <div>
            <Navbar />
            <div className="flex justify-center mt-8">
                <Card className="w-1/5 bg-slate-300">
                    <CardHeader className="flex justify-center ">
                        <CardTitle className="flex justify-center ">
                            <h1 className="text-black">Messages</h1>
                        </CardTitle>
                    </CardHeader>
                    <CardContent></CardContent>
                </Card>
            </div>
        </div>
    );
}
