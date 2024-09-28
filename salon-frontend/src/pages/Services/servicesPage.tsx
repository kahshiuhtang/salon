import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRole } from "@/lib/hooks/useRole";
import { useService } from "@/lib/hooks/useService";
import { SalonGood, SalonService } from "@/lib/types/types";
import UnlockedNavbar from "@/pages/Navbar/unlockedNavbar";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ServiceForm from "@/pages/Services/serviceForm";

interface ServicePageGroups {
  groupName: string;
  objects: (SalonGood | SalonService)[];
}

export default function ServicesPage() {
  const [services, setServices] = useState<SalonService[]>([]);
  const [goods, setGoods] = useState<SalonGood[]>([]);
  const [itemsToDisplay, setItemsToDisplay] = useState<ServicePageGroups[]>([]);
  const [role, setRole] = useState("USER");
  const { getServices, getGoods } = useService();
  const { getRole } = useRole();
  const { user } = useUser();
  const navigate = useNavigate();
  var userId = "";
  if (user && user.id) {
    userId = user.id;
  } else {
    navigate("/sign-in");
  }
  const processServicesAndGoods = () => {
    const items: ServicePageGroups[] = [];
    const itemMap = new Map<String, ServicePageGroups>();
    services.forEach((service) => {
      const key = service.type;
      if (!itemMap.get(key)) {
        itemMap.set(key, { groupName: key, objects: [] });
      }
      itemMap.get(key)?.objects.push(service);
    });
    goods.forEach((good) => {
      const key = "Goods";
      if (!itemMap.get(key)) {
        itemMap.set(key, { groupName: key, objects: [] });
      }
      itemMap.get(key)?.objects.push(good);
    });
    for (const key in itemMap) {
      if (itemMap.hasOwnProperty(key)) {
        const item = itemMap.get(key);
        if (item) items.push(item);
      }
    }
    return items;
  };
  const fetchServicesAndGoods = async () => {
    const tempServices = await getServices();
    const tempGoods = await getGoods();
    setServices(tempServices);
    setGoods(tempGoods);
    const processedItems = processServicesAndGoods();
    setItemsToDisplay(processedItems);
  };
  const fetchRole = async () => {
    const tempRole = await getRole({ userId });
    setRole(tempRole);
  };
  useEffect(() => {
    fetchServicesAndGoods();
    fetchRole();
  }, []);
  // const services = [
  //     {
  //         category: "Manicures",
  //         items: [
  //             { name: "Classic Manicure", price: 25, time: "30 min" },
  //             { name: "Gel Manicure", price: 35, time: "45 min" },
  //             { name: "Spa Manicure", price: 40, time: "60 min" },
  //         ],
  //     },
  //     {
  //         category: "Pedicures",
  //         items: [
  //             { name: "Classic Pedicure", price: 35, time: "45 min" },
  //             { name: "Gel Pedicure", price: 45, time: "60 min" },
  //             { name: "Deluxe Spa Pedicure", price: 55, time: "75 min" },
  //         ],
  //     },
  //     {
  //         category: "Nail Enhancements",
  //         items: [
  //             { name: "Acrylic Full Set", price: 60, time: "90 min" },
  //             { name: "Acrylic Fill", price: 40, time: "60 min" },
  //             { name: "Gel Extensions", price: 70, time: "90 min" },
  //             { name: "Dip Powder", price: 45, time: "60 min" },
  //         ],
  //     },
  //     {
  //         category: "Nail Art",
  //         items: [
  //             { name: "Simple Design (per nail)", price: 5, time: "5 min" },
  //             {
  //                 name: "Complex Design (per nail)",
  //                 price: 10,
  //                 time: "10 min",
  //             },
  //             { name: "French Tips", price: 10, time: "15 min" },
  //         ],
  //     },
  // ];

  return (
    <>
      <UnlockedNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          {itemsToDisplay.map((category) => (
            <Card key={category.groupName}>
              <CardHeader>
                <CardTitle>{category.groupName}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.objects.map((item) => (
                    <li
                      key={item.name}
                      className="flex justify-between items-center"
                    >
                      <span className="font-medium">{item.name}</span>
                      <span className="text-muted-foreground">
                        ${item.price} {item.time && <> • {item.time}</>}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        {role !== "USER" && (
          <>
            <ServiceForm></ServiceForm>
          </>
        )}
        <div className="mt-12 text-center">
          <Button size="lg">Book an Appointment</Button>
        </div>
      </div>
    </>
  );
}
