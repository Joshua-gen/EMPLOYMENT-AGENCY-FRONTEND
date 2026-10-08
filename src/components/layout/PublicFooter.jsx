import {Link} from "react-router-dom";
import Text from "../ui/Text";

const PublicFooter = () => {
    return (
        <footer className="bg-[#062B4A] text-white">
            <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                    <div className="lg:col-span-2">
                        <Text as="span" size="2xl" weight="extrabold" className="tracking-tight text-white">
                            LOGO
                        </Text>

                        <Text size="base" className="mt-4 max-w-md leading-7 text-white/70">
                            Connecting qualified Filipino workers with trusted employment opportunities abroad.
                        </Text>
                    </div>

                    <div>
                        <Text size="lg" weight="bold" className="text-white">
                            Quick Links
                        </Text>

                        <div className="mt-4 flex flex-col gap-3">
                            <Link to="/" className="text-white/70 transition hover:text-white">
                                Home
                            </Link>

                            <Link to="/our-services" className="text-white/70 transition hover:text-white">
                                Our Services
                            </Link>

                            <Link to="/recruitment/jobs" className="text-white/70 transition hover:text-white">
                                Job Openings
                            </Link>

                            <Link to="/recruitment/apply" className="text-white/70 transition hover:text-white">
                                Apply Online
                            </Link>
                        </div>
                    </div>

                    <div>
                        <Text size="lg" weight="bold" className="text-white">
                            Contact
                        </Text>

                        <div className="mt-4 flex flex-col gap-3">
                            <Text size="base" className="text-white/70">
                                Email: info@example.com
                            </Text>

                            <Text size="base" className="text-white/70">
                                Phone: +63 900 000 0000
                            </Text>

                            <Link to="/contactus" className="text-white/70 transition hover:text-white">
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-white/10 pt-6">
                    <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
                        <Text size="sm" className="text-white/60">
                            © 2026 All rights reserved.
                        </Text>

                        <Text size="sm" className="text-white/60">
                            Employment Agency
                        </Text>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default PublicFooter;
