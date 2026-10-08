import {useState} from "react";
import {Check, ChevronDown, Download, Edit3, Loader2, Mail, Plus, Save, Send, Trash2, User, X} from "lucide-react";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Heading from "../components/ui/Heading";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Textarea from "../components/ui/Textarea";

const ComponentPlayground = () => {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        position: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (event) => {
        const {name, value} = event.target;

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setForm({
            fullName: "",
            email: "",
            phone: "",
            position: "",
            message: "",
        });

        setShowError(false);
        setSubmitted(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!form.fullName || !form.email || !form.position || !form.message) {
            setShowError(true);
            setSubmitted(false);
            return;
        }

        setShowError(false);
        setLoading(true);

        // Testing only: simulate API request.
        setTimeout(() => {
            console.log("Submitted form:", form);
            setLoading(false);
            setSubmitted(true);
        }, 1200);
    };

    return (
        <main className="min-h-screen bg-gray-50 px-5 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <section className="mb-10">
                    <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-[#4F7383]">
                        UI Component Testing
                    </p>

                    <Heading as="h1" className="mb-3">
                        Component Playground
                    </Heading>

                    <p className="max-w-2xl text-gray-600">
                        Testing page ito para makita mo ang buttons, form inputs, select, textarea, cards, labels, error
                        state, disabled state, at loading state ng reusable components mo.
                    </p>
                </section>

                {/* Button Components */}
                <Card className="mb-8">
                    <Heading as="h2" className="mb-2">
                        Button Variants
                    </Heading>

                    <p className="mb-6 text-gray-600">
                        Primary, secondary, danger, ghost, sizes, icons, disabled, at loading states.
                    </p>

                    <div className="flex flex-wrap gap-3">
                        <Button>
                            <Check size={18} />
                            Primary
                        </Button>

                        <Button variant="secondary">
                            <Edit3 size={18} />
                            Secondary
                        </Button>

                        <Button variant="danger">
                            <Trash2 size={18} />
                            Delete
                        </Button>

                        <Button variant="ghost">
                            <X size={18} />
                            Ghost
                        </Button>

                        <Button size="sm">
                            <Plus size={16} />
                            Small
                        </Button>

                        <Button size="lg">
                            <Download size={19} />
                            Large Button
                        </Button>

                        <Button disabled>
                            <Save size={18} />
                            Disabled
                        </Button>

                        <Button loading>Loading</Button>
                    </div>
                </Card>

                {/* Card Components */}
                <section className="mb-8 grid gap-6 md:grid-cols-3">
                    <Card>
                        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#062B4A]/10 text-[#062B4A]">
                            <User size={22} />
                        </div>

                        <Heading as="h3" className="mb-2">
                            Basic Card
                        </Heading>

                        <p className="text-gray-600">
                            Example ng normal reusable Card component with heading and text.
                        </p>
                    </Card>

                    <Card className="border-[#4F7383]/30 bg-[#4F7383]/5">
                        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#4F7383]/15 text-[#062B4A]">
                            <Mail size={22} />
                        </div>

                        <Heading as="h3" className="mb-2">
                            Custom Card
                        </Heading>

                        <p className="text-gray-600">Same Card component, pero nag-pass lang ng custom className.</p>
                    </Card>

                    <Card className="bg-[#062B4A]">
                        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white">
                            <Check size={22} />
                        </div>

                        <h3 className="mb-2 text-xl font-bold text-white">Dark Card</h3>

                        <p className="text-white/75">Sample dark design gamit pa rin ang parehong Card component.</p>
                    </Card>
                </section>

                {/* Form Components */}
                <Card className="mb-8">
                    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                        <div>
                            <Heading as="h2" className="mb-2">
                                Form Component Test
                            </Heading>

                            <p className="text-gray-600">
                                Test mo dito ang Input, Select, Textarea, validation error, at submit loading state.
                            </p>
                        </div>

                        <Button type="button" variant="secondary" size="sm" onClick={resetForm}>
                            <X size={16} />
                            Reset Form
                        </Button>
                    </div>

                    {submitted && (
                        <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-800">
                            <Check size={20} className="mt-0.5 shrink-0" />

                            <div>
                                <p className="font-bold">Test form submitted successfully.</p>
                                <p className="text-sm text-green-700">
                                    Check your browser console to see the submitted data.
                                </p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid gap-5 md:grid-cols-2">
                            <Input
                                label="Full Name"
                                name="fullName"
                                placeholder="Juan Dela Cruz"
                                value={form.fullName}
                                onChange={handleChange}
                                required
                                error={showError && !form.fullName ? "Full name is required." : ""}
                            />

                            <Input
                                label="Email Address"
                                name="email"
                                type="email"
                                placeholder="juan@email.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                                error={showError && !form.email ? "Email address is required." : ""}
                            />
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <Input
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                placeholder="0917 123 4567"
                                value={form.phone}
                                onChange={handleChange}
                            />

                            <Select
                                label="Position"
                                name="position"
                                placeholder="Choose a position"
                                value={form.position}
                                onChange={handleChange}
                                required
                                error={showError && !form.position ? "Please select a position." : ""}
                                options={[
                                    {value: "web-developer", label: "Web Developer"},
                                    {value: "frontend-developer", label: "Frontend Developer"},
                                    {value: "backend-developer", label: "Backend Developer"},
                                    {value: "ui-ux-designer", label: "UI/UX Designer"},
                                    {value: "hr-staff", label: "HR Staff"},
                                ]}
                            />
                        </div>

                        <Textarea
                            label="Message"
                            name="message"
                            placeholder="Write your message here..."
                            value={form.message}
                            onChange={handleChange}
                            required
                            rows={6}
                            error={showError && !form.message ? "Message is required." : ""}
                        />

                        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                            <Button type="button" variant="secondary" onClick={resetForm} disabled={loading}>
                                <X size={18} />
                                Cancel
                            </Button>

                            <Button type="submit" loading={loading}>
                                {!loading && <Send size={18} />}
                                Submit Test Form
                            </Button>
                        </div>
                    </form>
                </Card>

                {/* Input states */}
                <Card className="mb-8">
                    <Heading as="h2" className="mb-2">
                        Input States
                    </Heading>

                    <p className="mb-6 text-gray-600">
                        Quick preview ng default, error, disabled, at read-only inputs.
                    </p>

                    <div className="grid gap-5 md:grid-cols-2">
                        <Input label="Default Input" placeholder="Normal input state" />

                        <Input
                            label="Error Input"
                            placeholder="Invalid value"
                            value="invalid-email"
                            readOnly
                            error="Please enter a valid email address."
                        />

                        <Input label="Disabled Input" placeholder="You cannot edit this" disabled />

                        <Input label="Read Only Input" value="readonly@example.com" readOnly />
                    </div>
                </Card>

                {/* Raw current form state */}
                <Card className="border-[#062B4A]/15 bg-[#062B4A]/[0.03]">
                    <div className="mb-4 flex items-center gap-2">
                        <ChevronDown size={20} className="text-[#062B4A]" />

                        <Heading as="h2">Live Form State</Heading>
                    </div>

                    <p className="mb-4 text-gray-600">
                        Ito yung current state ng form habang nagta-type ka. Pang-test lang ito, puwede mo alisin later.
                    </p>

                    <pre className="overflow-x-auto rounded-xl bg-slate-950 p-5 text-sm leading-6 text-green-300">
                        {JSON.stringify(form, null, 2)}
                    </pre>
                </Card>
            </div>
        </main>
    );
};

export default ComponentPlayground;
