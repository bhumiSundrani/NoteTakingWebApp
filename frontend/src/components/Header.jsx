import React, { useState } from "react";
import Logo from "./Logo";
import Button from "./Button";
import { Menu, X } from "lucide-react"; // Importing a 3-bar menu icon
import {useSelector} from "react-redux"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const status = useSelector((state) => state.auth.status)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = async () => {
    try {
      const res = await axios.post('http://localhost:8000/user/logout', {}, {withCredentials: true})
      dispatch(logout())
      navigate('/user/login')
      console.log("Logout successfull: ", res.data)
    } catch (error) {
      if (error.response) {
        console.error("Server Error:", error.response.data.error);
      } else {
        console.error("Request Failed:", error.message);
      }
      }
  }

  return (
    <div className="w-full flex justify-center items-center py-2 sm:py-4 sm:px-6">
      <div className="pb-0 w-full bg-[#242323] flex items-center justify-between px-6">
        {/* Logo and Title */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
          <Logo />
          <p className="font-bold md:text-lg lg:text-xl text-[#edede9]">
            MyNotes
          </p>
        </div>

        
        {!status ? 
        <>
          <div className="hidden md:flex items-center space-x-2">
            <Button type="button" text="Sign up" bgColor="#edede9" textColor="black" className="p-2 hover:bg-[#dddbdbcf] transition duration-300" onClick={() =>{
              navigate('/user/signup')}}/>
            <Button type="button" text="Login" bgColor="#edede9" textColor="black" className="p-2 transition duration-300 hover:bg-[#dddbdbcf]" onClick={() => {
              navigate('/user/login')}}/>
          </div>

          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-700 text-white transition-transform duration-300 "
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} className="rotate-180 transition-transform duration-300" /> : <Menu size={28} />}
          </button>
        </>
        : 
           <Button type="button" text="Logout" bgColor="#edede9" textColor="black" className="px-1 py-[4px] sm:p-2 transition duration-300  hover:bg-[#dddbdbcf] " onClick={handleLogout}/>
        }
      </div>

      {/* Mobile Menu Dropdown with Smooth Transition */}
      <div
        className={`md:hidden flex flex-col items-center bg-[#242323] text-white py-4 space-y-2 w-[50%] sm:w-[40%] px-2 absolute right-0 top-[53px] rounded-l-xl
          transition-all duration-200 ease-in-out z-1 origin-top ${
            isOpen ? "scale-y-100 opacity-100 h-auto" : "scale-y-0 opacity-0 h-0"
          } overflow-hidden`}
      >
        <div className="w-full">
          <Button type="button" text="Sign up" bgColor="#edede9" textColor="black" className="w-full py-1 transition duration-300  hover:bg-[#dddbdbcf]" onClick={() => {navigate('/user/signup')
            setIsOpen(false)}
          } />
        </div>
        <div className="w-full">
          <Button type="button" text="Login" bgColor="#edede9" textColor="black" className="w-full py-1 transition duration-300  hover:bg-[#dddbdbcf]" onClick={() =>{ navigate('/user/login')
            setIsOpen(false)
          }}/>
        </div>
      </div>
    </div>
  );
}

export default Header;

