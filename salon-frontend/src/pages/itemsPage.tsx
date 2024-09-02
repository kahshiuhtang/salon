import { useState } from "react";
import ItemCard, { ItemCardProps } from "@/item/itemCard";
import Navbar from "@/modules/navbar";

export function getCurrentDate(separator = ":") {
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();

    return `${year}${separator}${
        month < 10 ? `0${month}` : `${month}`
    }${"-"}${date}`;
}

export default function ItemsPage() {
    const [items, _] = useState<ItemCardProps[]>([]);

    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center">
                <div className="grid gap-2 grid-cols-3 p-4">
                    {items.map((item, index) => (
                        <ItemCard
                            key={index}
                            title={item.title}
                            description={item.description}
                            images={item.images}
                            price={item.price}
                            createdAt={item.createdAt}
                            location={item.location}
                            college={item.college}
                            username={item.username}
                            userId={item.userId}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}
