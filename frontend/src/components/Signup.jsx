import React, {useState} from 'react';
import { useForm } from 'react-hook-form';
import {default as axios} from 'axios'
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  

  const onSubmit = async (data) => {
    if(!data) console.error("Data not found for signup")
    try {
        const res = await axios.post('http://localhost:8000/user/signup', data, {withCredentials: true})
        console.log("Signup successfull: ", res.data)
        const result = dispatch(login(res.data))
        navigate('/')
    } catch (error) {
      if (error.response) {
        setServerError(error.response.data.error)
        console.error("Server Error:", error.response.data.error);
      } else {
        console.error("Request Failed:", error.message);
      }
      }
    
  };

  return (
    <div className='w-full md:w-[90%] lg:w-[80%] mx-auto px-4'>
    <div className="flex justify-center items-center mt-1 sm:mt-5 bg-[#242323] w-full mx-auto">
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="bg-[#525252] text-white p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-lg sm:text-2xl font-bold mb-4 text-center">Create an Account</h2>
        {serverError && <p className="text-[#dd4a4a] text-center mb-2 font-semibold">{serverError}</p>}

        {/* First Name */}
        <div className="mb-4">
          <label htmlFor="firstName" className="block text-sm font-medium">First Name</label>
          <input 
            type="text" 
            {...register("firstName", { required: "First name is required" })} 
            placeholder="John"
            className="mt-1 p-0.5 pl-2 w-full border rounded bg-[#242323] focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-2"
          />
          {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <label htmlFor="lastName" className="block text-sm font-medium">Last Name</label>
          <input 
            type="text" 
            {...register("lastName")} 
            placeholder="Doe"
            className="mt-1 sm:p-2 pl-2 p-0.5 w-full border rounded bg-[#242323] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input 
            type="email" 
            {...register("email", { 
              required: "Email is required", 
              pattern: { 
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
                message: "Invalid email format" 
              }
            })} 
            placeholder="johndoe@example.com"
            className="mt-1 sm:p-2 pl-2 p-0.5  w-full border rounded bg-[#242323] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium">Password</label>
          <input 
            type="password" 
            {...register("password", { 
              required: "Password is required", 
              minLength: { value: 8, message: "Must be at least 8 characters" },
              maxLength: { value: 24, message: "Must be less than 24 characters" }
            })} 
            placeholder="••••••••"
            className="mt-1 sm:p-2 pl-2 p-0.5  w-full border rounded bg-[#242323] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        {/* Submit Button */}
        <div className="mt-4">
          <button 
            type="submit" 
            className="w-full p-2 bg-blue-500 transition duration-300 hover:bg-blue-600 rounded cursor-pointer text-white font-semibold"
          >
            Create Account
          </button>
          <p className='text-white mt-4 text-center text-sm sm:text-base'>Already have an account? <Link to="/user/login" className='hover:text-blue-400 hover:underline'>Login</Link></p>
        </div>
      </form>
      
    </div>
    </div>
  );
}

export default Signup;
