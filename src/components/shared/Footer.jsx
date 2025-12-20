// ===========================================
// CLIENT/src/components/shared/Footer.jsx
// ===========================================
import { Link } from 'react-router-dom';
import { BiDish } from 'react-icons/bi';
import {
    FiFacebook,
    FiTwitter,
    FiInstagram,
    FiMail,
    FiPhone,
    FiMapPin
} from 'react-icons/fi';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <BiDish className="w-8 h-8 text-primary-500" />
                            <span className="text-xl font-bold text-white font-heading">
                                LocalChefBazaar
                            </span>
                        </Link>
                        <p className="text-sm mb-4">
                            Connecting food lovers with talented home chefs. Experience authentic,
                            homemade meals delivered to your doorstep.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary-500 transition-colors"
                                aria-label="Facebook"
                            >
                                <FiFacebook className="w-5 h-5" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary-500 transition-colors"
                                aria-label="Twitter"
                            >
                                <FiTwitter className="w-5 h-5" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary-500 transition-colors"
                                aria-label="Instagram"
                            >
                                <FiInstagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="hover:text-primary-500 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/meals" className="hover:text-primary-500 transition-colors">
                                    Browse Meals
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard" className="hover:text-primary-500 transition-colors">
                                    Dashboard
                                </Link>
                            </li>

                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2">
                                <FiMapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                                <span className="text-sm">
                                    Gulshan 1, Dhaka<br />

                                </span>
                            </li>
                            <li className="flex items-center gap-2">
                                <FiPhone className="w-5 h-5" />
                                <a href="tel:+1234567890" className="text-sm hover:text-primary-500">
                                    +8801211221123
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <FiMail className="w-5 h-5" />
                                <a href="mailto:info@localchefbazaar.com" className="text-sm hover:text-primary-500">
                                    info@localchefbazaar.com
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Working Hours */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Working Hours</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex justify-between">
                                <span>Saturday - Thursday:</span>
                                <span className="text-primary-400">9:00 AM - 10:00 PM</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Friday:</span>
                                <span className="text-primary-400">10:00 AM - 11:00 PM</span>
                            </li>

                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
                    <p>
                        &copy; {currentYear} LocalChefBazaar. All rights reserved. |
                        <Link to="/privacy" className="hover:text-primary-500 ml-2">
                            Privacy Policy
                        </Link> |
                        <Link to="/terms" className="hover:text-primary-500 ml-2">
                            Terms of Service
                        </Link>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;