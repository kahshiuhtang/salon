import UnlockedNavbar from "@/pages/Navbar/unlockedNavbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <UnlockedNavbar></UnlockedNavbar>
      <section id="home" className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Welcome to SNS Nails
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Your premier nail salon in Staten Island. Experience luxury and
                style at your fingertips.
              </p>
            </div>
            <Button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
              Book Now
            </Button>
          </div>
        </div>
      </section>
      <section
        id="about"
        className="w-full py-12 md:py-24 lg:py-32 bg-gray-100"
      >
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
            About Us
          </h2>
          <div className="grid gap-6 lg:grid-cols-3 items-start">
            <Card>
              <CardHeader>
                <CardTitle>Expert Technicians</CardTitle>
              </CardHeader>
              <CardContent>
                Our skilled nail artists bring years of experience and
                creativity to every service.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Premium Products</CardTitle>
              </CardHeader>
              <CardContent>
                We use only the highest quality, long-lasting nail products for
                beautiful, durable results.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Relaxing Atmosphere</CardTitle>
              </CardHeader>
              <CardContent>
                Enjoy a serene environment designed for your comfort and
                relaxation during your visit.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
            Contact Us
          </h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
                <CardDescription>
                  We'd love to hear from you. Send us a message and we'll
                  respond as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <Input placeholder="Name" />
                  <Input type="email" placeholder="Email" />
                  <Textarea placeholder="Your message" />
                  <Button type="submit">Send Message</Button>
                </form>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Visit Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>123 Main St, Staten Island, NY 10314</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>(123) 456-7890</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>info@ssnails.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Mon-Sat: 9am-7pm, Sun: 10am-5pm</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
