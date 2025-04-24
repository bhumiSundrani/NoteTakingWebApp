import React from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from './SideBar';
import AllNotes from './AllNotes';

function Home() {
  const navigate = useNavigate();

  return (
    <div className='w-full h-full flex flex-col sm:flex-row'>
      <SideBar/>
      <AllNotes/>
    </div>
  );
}

export default Home;
