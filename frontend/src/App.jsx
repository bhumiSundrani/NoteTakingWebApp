import { useEffect } from "react";
import { Footer, Header } from "./components";
import { Outlet, useNavigate } from "react-router-dom"; // Use from "react-router-dom", not "react-router"
import { useDispatch } from "react-redux";
import { login } from "./store/authSlice";
import axios from "axios";

function App() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get('https://notetakingwebapp.onrender.com/user/get-current-user', {withCredentials: true})
        if (res.data?.user) {
          dispatch(login(res.data.user))
        } else {
          navigate('/user/login')
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        navigate('/user/login')
      }
    }

    // Only attempt to get user if we have cookies
    if (document.cookie) {
      getUser()
    } else {
      navigate('/user/login')
    }
  }, [dispatch, navigate])

  return (
    <div className="min-h-screen bg-[#242323] flex flex-col">
      {/* Header stays on top */}
      <Header />

      {/* Main content with scrollable area */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <Footer/>
    </div>
  );
}

export default App;
