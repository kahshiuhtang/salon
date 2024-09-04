import Navbar from "@/modules/navbar";
import BookAppointmentForm from "@/modules/forms/bookAppointmentForm";

// max four items
// provider --> Lee, Kim, Kimberly, Marie --> maybe do one for each, and then split it
// appointment time, date
export default function BookAppointmentPage() {
    return (
        <>
            <Navbar />
            <BookAppointmentForm />
        </>
    );
}
