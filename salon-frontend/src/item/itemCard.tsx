import { Link } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { MessageCircleMore } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatBox from "@/modules/chatBox";

export interface ItemCardProps {
    title: string;
    description: string;
    images: string[];
    price: number;
    location: string;
    college: string;
    createdAt: string;
    username: string;
    userId: string;
}

export default function ItemCard({
    title,
    description,
    images,
    price,
    location,
    college,
    createdAt,
    username,
    userId,
}: ItemCardProps) {
    return (
        <div className="w-96 mb-4">
            <Card className="px-6">
                <CardHeader className="pb-2">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>
                        <div className="flex items-center">
                            <Link
                                to={`/user/${userId}`}
                                className="text-black hover:underline"
                            >
                                {username}
                            </Link>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <MessageCircleMore
                                        className="hover:cursor-pointer"
                                        color="black"
                                        size={20}
                                    />
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>
                                            Chat with {username}
                                        </DialogTitle>
                                        <DialogDescription>
                                            Message {username}
                                        </DialogDescription>
                                        <ChatBox />
                                    </DialogHeader>
                                    <DialogFooter className="sm:justify-start">
                                        <DialogClose asChild>
                                            <Button
                                                type="button"
                                                variant="secondary"
                                            >
                                                Close
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <p className="text-black mt-2">{description}</p>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Carousel className="w-full max-w-xs bg-purple-400">
                        <CarouselContent>
                            {images.map((image, index) => (
                                <CarouselItem key={index}>
                                    <div className="p-1">
                                        <Card className="">
                                            <CardContent className="flex aspect-square items-center justify-center p-6">
                                                <img
                                                    src={image}
                                                    alt={`Image ${index + 1}`}
                                                    className="max-w-full max-h-full object-cover"
                                                />
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                    <div className="mt-4">
                        <p>
                            <b>Price:</b> ${price.toFixed(2)}
                        </p>
                        <p>
                            <b>College:</b> {college}
                        </p>
                        <p>
                            <b>Location:</b> {location}
                        </p>
                        <p>
                            <b>Posted:</b> {createdAt}
                        </p>
                    </div>
                </CardContent>
                <CardFooter></CardFooter>
            </Card>
        </div>
    );
}
