import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function SideBar() {
  const [sideBarHeight, setSideBarHeight] = useState("100vh")
  useEffect(() => {
    const updateSideBarHeight = () => {
      const footer = document.getElementById("footer")
      const footerHeight = footer ? footer.offsetHeight : 0;
      const screenWidth = window.innerHeight
      if (screenWidth >= 640) {
        // Apply height only for `sm` screens (Tailwind `sm` is 640px)
        setSideBarHeight(`calc(100vh - ${footerHeight}px)`);
      } else {
        setSideBarHeight("auto"); // Default for smaller screens
      }
    }
    updateSideBarHeight()
    window.addEventListener("resize", updateSideBarHeight)
    return () => window.removeEventListener("resize", updateSideBarHeight)
  }, [])

  return (
    <div className={`text-center sm:text-left w-full sticky  sm:w-[250px] bg-[#3a3731] text-[#ddd] p-3 sm:p-6 shadow-lg`} style={{height: sideBarHeight}}>
      {/* Sidebar Title */}
      <h2 className="sm:text-xl text-[16px] font-semibold mb-2 sm:mb-4 text-[#ccc]">Work Space</h2>

      {/* Navigation Links */}
      <nav className="flex flex-col sm:space-y-3 ">
        <Link
          to="/notes/add-notes"
          className="flex  items-center text-[15px] sm:text-[16px] gap-2 py-1 sm:py-2 px-4 rounded-lg hover:bg-[#555149] transition duration-300"
        >
          📝 Create Notes
        </Link>
        <Link
          to="/notes/recently-deleted"
          className="flex items-center gap-2 text-[15px] sm:text-[16px] sm:py-2 py-1 px-4 rounded-lg hover:bg-[#555149] transition duration-300"
        >
          🗑️ Recently Deleted
        </Link>
      </nav>
    </div>
  );
}

export default SideBar;
