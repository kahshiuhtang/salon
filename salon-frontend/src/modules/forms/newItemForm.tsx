import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/clerk-react";
// Schema definition
const formSchema = z.object({
    title: z.string().min(5).max(50),
    description: z.string().min(5).max(50),
    price: z.string().min(1).max(50),
    location: z.string().min(2).max(50),
    college: z.string(),
});

export default function NewItemForm() {
    const user = useUser();
    if (user) {
        console.log(user);
    }
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // State for selected files
    const [imagePreviews, setImagePreviews] = useState<string[]>([]); // State for image previews
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            price: "",
            location: "",
            college: "",
        },
    });

    // Handle image file selection
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files).slice(0, 5); // Limit to 5 files
            const combinedFiles = [...selectedFiles, ...filesArray].slice(0, 5); // Ensure no more than 5 files

            // Create image previews
            const newPreviews = combinedFiles.map((file) =>
                URL.createObjectURL(file)
            );

            setSelectedFiles(combinedFiles);
            setImagePreviews(newPreviews);
        }
    };

    // Remove a file
    const handleRemoveFile = (index: number) => {
        setSelectedFiles((prevFiles) =>
            prevFiles.filter((_, i) => i !== index)
        );
        setImagePreviews((prevPreviews) =>
            prevPreviews.filter((_, i) => i !== index)
        );
    };
    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (values) {
            console.log(values);
        }
    }

    return (
        <div className="flex justify-center items-center mt-24">
            <Card className="w-1/4">
                <CardHeader className="pl-8 pt-8 pb-0 mb-2">
                    <CardTitle>Post a listing</CardTitle>
                    <CardDescription>
                        Add basic information to create a new post
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-2"
                        >
                            {/* Form Fields */}
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter the title of your post"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter a brief description"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter the price"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter the location"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="college"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>College</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your college name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Image Upload Section */}
                            <div>
                                <FormLabel>Images (up to 5)</FormLabel>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                    className="mt-2"
                                />
                                {imagePreviews.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {imagePreviews.map((preview, index) => (
                                            <div
                                                key={index}
                                                className="relative"
                                            >
                                                <img
                                                    src={preview}
                                                    alt={`Selected image ${
                                                        index + 1
                                                    }`}
                                                    className="w-20 h-20 object-cover rounded-md"
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="absolute top-0 right-0 bg-white"
                                                    onClick={() =>
                                                        handleRemoveFile(index)
                                                    }
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {/* Submit Button */}
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
