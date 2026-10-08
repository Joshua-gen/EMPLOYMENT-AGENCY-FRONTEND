import {Mail, MapPin, Phone, Send} from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Heading from "../components/ui/Heading";
import Input from "../components/ui/Input";
import Text from "../components/ui/Text";
import Textarea from "../components/ui/Textarea";
import OfficeMap from "../components/contactus/OfficeMap";

const ContactUs = () => {
    return (
        <main className="min-h-screen bg-gray-50">
            <section className="relative bg-[#062B4A] px-5 pt-16 pb-20 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl text-center">
                    <Text size="sm" weight="semibold" className="mb-3 uppercase tracking-[0.18em] text-[#EFE8A5]">
                        Get In Touch
                    </Text>

                    <Heading as="h1" className="text-white">
                        Contact Us
                    </Heading>

                    <Text size="lg" className="mx-auto mt-4 max-w-2xl text-white/80">
                        Have questions about our services, job opportunities, or application process? Get in touch with
                        our team.
                    </Text>
                </div>

                <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
                    <svg
                        className="relative block w-full h-8 sm:h-12 text-gray-50"
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                        fill="currentColor"
                    >
                        <path d="M0,0 C300,90 900,90 1200,0 L1200,120 L0,120 Z"></path>
                    </svg>
                </div>
            </section>

            <section className="px-5 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card>
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#062B4A]/10 text-[#062B4A]">
                                <MapPin size={22} />
                            </div>

                            <Heading as="h3" className="mb-2">
                                Office Address
                            </Heading>

                            <Text className="leading-7 text-gray-600">Your office address will be displayed here.</Text>
                        </Card>

                        <Card>
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#062B4A]/10 text-[#062B4A]">
                                <Phone size={22} />
                            </div>

                            <Heading as="h3" className="mb-2">
                                Contact Numbers
                            </Heading>

                            <Text className="text-gray-600">+63 XXX XXX XXXX</Text>

                            <Text className="mt-1 text-gray-600">+63 XXX XXX XXXX</Text>
                        </Card>

                        <Card>
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#062B4A]/10 text-[#062B4A]">
                                <Mail size={22} />
                            </div>

                            <Heading as="h3" className="mb-2">
                                Email
                            </Heading>

                            <Text className="text-gray-600">info@example.com</Text>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="px-5 pb-16 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
                    <div>
                        <Heading as="h2" className="mb-3">
                            Office Information
                        </Heading>

                        <Text className="mb-8 leading-7 text-gray-600">
                            You may visit our office during our operating hours or connect with us through our social
                            media channels.
                        </Text>

                        <Card className="mb-6">
                            <Heading as="h3" className="mb-5">
                                Office Hours
                            </Heading>

                            <div className="space-y-3">
                                <div className="flex justify-between border-b border-gray-100 pb-3">
                                    <Text weight="semibold">Monday - Friday</Text>

                                    <Text className="text-gray-600">8:00 AM - 5:00 PM</Text>
                                </div>

                                <div className="flex justify-between">
                                    <Text weight="semibold">Saturday - Sunday</Text>

                                    <Text className="text-gray-600">Closed</Text>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <Heading as="h3" className="mb-5">
                                Social Media
                            </Heading>

                            <div className="flex flex-wrap gap-3">
                                <Button variant="secondary" size="sm">
                                    Facebook
                                </Button>

                                <Button variant="secondary" size="sm">
                                    Instagram
                                </Button>
                            </div>
                        </Card>
                    </div>

                    <Card className="min-h-[400px] overflow-hidden p-0">
                        <OfficeMap position={[14.5775593, 120.9914377]} label="Your Agency Name" />
                    </Card>
                </div>
            </section>

            <section className="bg-white px-5 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-8 text-center">
                        <Text size="sm" weight="semibold" className="mb-2 uppercase tracking-[0.15em] text-[#4F7383]">
                            Send Us A Message
                        </Text>

                        <Heading as="h2">Inquiry Form</Heading>

                        <Text className="mx-auto mt-3 max-w-2xl text-gray-600">
                            Have an inquiry? Fill out the form below and send us a message.
                        </Text>
                    </div>

                    <Card>
                        <form className="space-y-5">
                            <div className="grid gap-5 md:grid-cols-2">
                                <Input label="Full Name" name="fullName" placeholder="Juan Dela Cruz" required />

                                <Input
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    placeholder="juan@email.com"
                                    required
                                />
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <Input label="Phone Number" name="phone" type="tel" placeholder="0917 123 4567" />

                                <Input label="Subject" name="subject" placeholder="Subject" required />
                            </div>

                            <Textarea
                                label="Message"
                                name="message"
                                placeholder="Write your inquiry here..."
                                rows={6}
                                required
                            />

                            <div className="flex justify-end border-t border-gray-100 pt-6">
                                <Button type="submit" size="lg">
                                    <Send size={18} />
                                    Send Inquiry
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </section>
        </main>
    );
};

export default ContactUs;
