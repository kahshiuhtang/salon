import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UnlockedNavbar from "@/pages/Navbar/unlockedNavbar";

export default function ServicesPage() {
    const services = [
        {
            category: "Manicures",
            items: [
                { name: "Classic Manicure", price: 25, time: "30 min" },
                { name: "Gel Manicure", price: 35, time: "45 min" },
                { name: "Spa Manicure", price: 40, time: "60 min" },
            ],
        },
        {
            category: "Pedicures",
            items: [
                { name: "Classic Pedicure", price: 35, time: "45 min" },
                { name: "Gel Pedicure", price: 45, time: "60 min" },
                { name: "Deluxe Spa Pedicure", price: 55, time: "75 min" },
            ],
        },
        {
            category: "Nail Enhancements",
            items: [
                { name: "Acrylic Full Set", price: 60, time: "90 min" },
                { name: "Acrylic Fill", price: 40, time: "60 min" },
                { name: "Gel Extensions", price: 70, time: "90 min" },
                { name: "Dip Powder", price: 45, time: "60 min" },
            ],
        },
        {
            category: "Nail Art",
            items: [
                { name: "Simple Design (per nail)", price: 5, time: "5 min" },
                {
                    name: "Complex Design (per nail)",
                    price: 10,
                    time: "10 min",
                },
                { name: "French Tips", price: 10, time: "15 min" },
            ],
        },
    ];

    return (
        <>
            <UnlockedNavbar />
            <div className="container mx-auto px-4 py-8">
                <div className="grid gap-8 md:grid-cols-2">
                    {services.map((category) => (
                        <Card key={category.category}>
                            <CardHeader>
                                <CardTitle>{category.category}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {category.items.map((item) => (
                                        <li
                                            key={item.name}
                                            className="flex justify-between items-center"
                                        >
                                            <span className="font-medium">
                                                {item.name}
                                            </span>
                                            <span className="text-muted-foreground">
                                                ${item.price} • {item.time}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Button size="lg">Book an Appointment</Button>
                </div>
            </div>
        </>
    );
}
