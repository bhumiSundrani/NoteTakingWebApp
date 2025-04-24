import { useEffect } from "react";
import { Footer, Header } from "./components";
import { Outlet, useNavigate } from "react-router-dom"; // Use from "react-router-dom", not "react-router"
import { useDispatch } from "react-redux";
import { login } from "./store/authSlice";
import axios from "axios";

function App() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect( () => {
    if(!document.cookie) return
    const getUser = async () => {
      try {
        const res = await axios.get('http://localhost:8000/user/get-current-user', {withCredentials: true})
        if(!res) return navigate('/login')
        if(res.data?.user) return dispatch(login(res.data.user))
      } catch (error) {
        console.log("Error fetching data: ", error)
      }
    }
    getUser()  
  }, [])
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
