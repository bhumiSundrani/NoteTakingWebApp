import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Facebook, Twitter, Instagram } from "lucide-react"; // Icons

const Footer = () => {
  const navigate = useNavigate()
  return (
    <footer className="w-full p-2 pb-4 sm:p-6 bg-[#242323] text-[#edede9] mt-auto" id="footer">
      <div className="w-full mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        
        {/* Brand Name */}
        <div className="sm:text-xl font-bold cursor-pointer" onClick={() => navigate('/')}>MyNotes</div>

        {/* Navigation Links */}
        <div className="flex space-x-6 mt-2 sm:mt-4 md:mt-0">
          <Link to="/" className="hover:text-gray-400 text-sm sm:text-[16px] transition duration-300 hover:underline">Home</Link>
        </div>

        {/* Social Media Links (Optional) */}
        <div className="flex space-x-4 mt-2 sm:mt-4 md:mt-0">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
            <Facebook size={15} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
            <Twitter size={15} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
            <Instagram size={15} />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-[12px] sm:text-sm mt-3 sm:mt-6 opacity-75">
        © {new Date().getFullYear()} MyNotes. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
