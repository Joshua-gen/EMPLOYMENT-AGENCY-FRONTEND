import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {ChevronDown, Menu, X} from "lucide-react";
import Text from "../ui/Text";

const PublicNavbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileDropdown, setMobileDropdown] = useState(null);
    const [scrolled, setScrolled] = useState(false);

    const toggleDropdown = (dropdown) => {
        setMobileDropdown((current) => (current === dropdown ? null : dropdown));
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
        setMobileDropdown(null);
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, {passive: true});

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navText = scrolled ? "text-[#062B4A] hover:text-[#062B4A]/70" : "text-white hover:text-white/80";

    const mobileText = scrolled ? "text-[#062B4A] hover:bg-gray-50" : "text-white hover:bg-white/10";

    const dropdownText = "text-[#062B4A] hover:bg-[#062B4A]/5";

    return (
        <nav
            className={`sticky top-0 z-50 transition-all duration-300 ${
                scrolled ? "border-b border-gray-200 bg-white shadow-sm" : "border-b border-white/10 bg-[#062B4A]"
            }`}
        >
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
                <Link to="/" onClick={closeMobileMenu} className={scrolled ? "text-[#062B4A]" : "text-white"}>
                    <Text as="span" size="xl" weight="extrabold">
                        LOGO
                    </Text>
                </Link>

                <div className="hidden items-center gap-8 lg:flex">
                    <Link to="/" className={navText}>
                        <Text as="span" size="base" weight="semibold">
                            Home
                        </Text>
                    </Link>

                    <div className="group relative">
                        <button type="button" className={navText}>
                            <span className="flex items-center gap-1.5">
                                <Text as="span" size="base" weight="semibold">
                                    About Us
                                </Text>
                                <ChevronDown size={18} />
                            </span>
                        </button>

                        <div className="absolute left-1/2 top-full hidden w-40 -translate-x-1/2 pt-3 group-hover:block">
                            <div className="rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
                                {[
                                    ["Mission", "/about/mission"],
                                    ["Vision", "/about/vision"],
                                    ["History", "/about/history"],
                                    ["FAQs", "/about/faqs"],
                                    ["Gallery", "/about/gallery"],
                                ].map(([label, path]) => (
                                    <Link
                                        key={path}
                                        to={path}
                                        className={`block rounded-lg px-4 py-2.5 ${dropdownText}`}
                                    >
                                        <Text as="span" size="base" weight="semibold">
                                            {label}
                                        </Text>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Link to="/our-services" className={navText}>
                        <Text as="span" size="base" weight="semibold">
                            Our Services
                        </Text>
                    </Link>

                    <div className="group relative">
                        <button type="button" className={navText}>
                            <span className="flex items-center gap-1.5">
                                <Text as="span" size="base" weight="semibold">
                                    Recruitment
                                </Text>
                                <ChevronDown size={18} />
                            </span>
                        </button>

                        <div className="absolute left-1/2 top-full hidden w-40 -translate-x-1/2 pt-3 group-hover:block">
                            <div className="rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
                                <Link to="/recruitment/jobs" className={`block rounded-lg px-4 py-2.5 ${dropdownText}`}>
                                    <Text as="span" size="base" weight="semibold">
                                        Job Openings
                                    </Text>
                                </Link>

                                <Link
                                    to="/recruitment/apply"
                                    className={`block rounded-lg px-4 py-2.5 ${dropdownText}`}
                                >
                                    <Text as="span" size="base" weight="semibold">
                                        Apply Online
                                    </Text>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="group relative">
                        <button type="button" className={navText}>
                            <span className="flex items-center gap-1.5">
                                <Text as="span" size="base" weight="semibold">
                                    Employer&apos;s
                                </Text>
                                <ChevronDown size={18} />
                            </span>
                        </button>

                        <div className="absolute left-1/2 top-full hidden w-52 -translate-x-1/2 pt-3 group-hover:block">
                            <div className="rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
                                <Link
                                    to="/employers/manpower-request"
                                    className={`block rounded-lg px-4 py-2.5 ${dropdownText}`}
                                >
                                    <Text as="span" size="base" weight="semibold">
                                        Manpower Request
                                    </Text>
                                </Link>

                                <Link to="/employers/login" className={`block rounded-lg px-4 py-2.5 ${dropdownText}`}>
                                    <Text as="span" size="base" weight="semibold">
                                        Login
                                    </Text>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <Link to="/contactus" className={navText}>
                        <Text as="span" size="base" weight="semibold">
                            Contact Us
                        </Text>
                    </Link>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        setMobileMenuOpen((current) => !current);
                        setMobileDropdown(null);
                    }}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border lg:hidden ${
                        scrolled ? "border-[#062B4A]/20 text-[#062B4A]" : "border-white/30 text-white"
                    }`}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
                </button>
            </div>

            {mobileMenuOpen && (
                <div
                    className={`border-t px-5 py-3 lg:hidden ${
                        scrolled ? "border-gray-200 bg-white" : "border-white/10 bg-[#062B4A]"
                    }`}
                >
                    <Link to="/" onClick={closeMobileMenu} className={`block rounded-lg px-3 py-3 ${mobileText}`}>
                        <Text as="span" size="base" weight="semibold">
                            Home
                        </Text>
                    </Link>

                    <div>
                        <button
                            type="button"
                            onClick={() => toggleDropdown("about")}
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-3 ${mobileText}`}
                        >
                            <Text as="span" size="base" weight="semibold">
                                About Us
                            </Text>

                            <ChevronDown size={19} className={mobileDropdown === "about" ? "rotate-180" : ""} />
                        </button>

                        {mobileDropdown === "about" && (
                            <div className="ml-3 border-l border-[#062B4A]/20 pl-3">
                                {[
                                    ["Mission", "/about/mission"],
                                    ["Vision", "/about/vision"],
                                    ["History", "/about/history"],
                                    ["FAQs", "/about/faqs"],
                                    ["Gallery", "/about/gallery"],
                                ].map(([label, path]) => (
                                    <Link
                                        key={path}
                                        to={path}
                                        onClick={closeMobileMenu}
                                        className={`block rounded-lg px-3 py-2.5 ${mobileText}`}
                                    >
                                        <Text as="span" size="base" weight="semibold">
                                            {label}
                                        </Text>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link
                        to="/our-services"
                        onClick={closeMobileMenu}
                        className={`block rounded-lg px-3 py-3 ${mobileText}`}
                    >
                        <Text as="span" size="base" weight="semibold">
                            Our Services
                        </Text>
                    </Link>

                    <div>
                        <button
                            type="button"
                            onClick={() => toggleDropdown("recruitment")}
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-3 ${mobileText}`}
                        >
                            <Text as="span" size="base" weight="semibold">
                                Recruitment
                            </Text>

                            <ChevronDown size={19} className={mobileDropdown === "recruitment" ? "rotate-180" : ""} />
                        </button>

                        {mobileDropdown === "recruitment" && (
                            <div className="ml-3 border-l border-[#062B4A]/20 pl-3">
                                <Link
                                    to="/recruitment/jobs"
                                    onClick={closeMobileMenu}
                                    className={`block rounded-lg px-3 py-2.5 ${mobileText}`}
                                >
                                    <Text as="span" size="base" weight="semibold">
                                        Job Openings
                                    </Text>
                                </Link>

                                <Link
                                    to="/recruitment/apply"
                                    onClick={closeMobileMenu}
                                    className={`block rounded-lg px-3 py-2.5 ${mobileText}`}
                                >
                                    <Text as="span" size="base" weight="semibold">
                                        Apply Online
                                    </Text>
                                </Link>
                            </div>
                        )}
                    </div>

                    <div>
                        <button
                            type="button"
                            onClick={() => toggleDropdown("employers")}
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-3 ${mobileText}`}
                        >
                            <Text as="span" size="base" weight="semibold">
                                Employer&apos;s
                            </Text>

                            <ChevronDown size={19} className={mobileDropdown === "employers" ? "rotate-180" : ""} />
                        </button>

                        {mobileDropdown === "employers" && (
                            <div className="ml-3 border-l border-[#062B4A]/20 pl-3">
                                <Link
                                    to="/employers/manpower-request"
                                    onClick={closeMobileMenu}
                                    className={`block rounded-lg px-3 py-2.5 ${mobileText}`}
                                >
                                    <Text as="span" size="base" weight="semibold">
                                        Manpower Request
                                    </Text>
                                </Link>

                                <Link
                                    to="/employers/login"
                                    onClick={closeMobileMenu}
                                    className={`block rounded-lg px-3 py-2.5 ${mobileText}`}
                                >
                                    <Text as="span" size="base" weight="semibold">
                                        Login
                                    </Text>
                                </Link>
                            </div>
                        )}
                    </div>

                    <Link
                        to="/contactus"
                        onClick={closeMobileMenu}
                        className={`block rounded-lg px-3 py-3 ${mobileText}`}
                    >
                        <Text as="span" size="base" weight="semibold">
                            Contact Us
                        </Text>
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default PublicNavbar;
