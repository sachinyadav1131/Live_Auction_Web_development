import { useState ,useEffect} from 'react';
import React from 'react';
import { BrowserRouter as Router , Routes , Route } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideDrawer from './layout/SideDrawer';
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import SubmitCommission from "./pages/SubmitCommission";
import { useDispatch } from "react-redux";
import { fetchLeaderboard, fetchUser } from "./store/slices/userSlice";
import { getAllAuctionItems } from "./store/slices/auctionSlice";
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import Home from './pages/Home';
import LeaderboardPage from './pages/LeaderboardPage'
import Auctions from './pages/Auction';
import CreateAuction from './pages/CreateAuction';
import ViewMyAuctions from './pages/ViewMyAuction';
import ViewAuctionDetails from './pages/ViewAuctionDetails';
import Dashboard from './pages/dashboard/Dashboard';
import UserProfile from './pages/UserProfile';
import AuctionItem from './pages/AuctionItem';


const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUser());
    dispatch(getAllAuctionItems());
    dispatch(fetchLeaderboard());
  }, []);

  return (
    <>
      <Router>
        <SideDrawer />
        <Routes>
          <Route path= "/" element= {<Home />} />
           <Route path="/sign-up" element={<SignUp />} />
            <Route path="/login" element={<Login/>} />
            <Route path="/submit-commission" element={<SubmitCommission />} />
            <Route path="/how-it-works-info" element={<HowItWorks/>} />
            <Route path="/about" element={<About/>} />
            <Route path="/leaderboard" element={<LeaderboardPage/>} />
            <Route path="/auctions" element={<Auctions/>} />
            <Route path="/create-auction" element={<CreateAuction/>} />
            <Route path="/view-my-auctions" element={<ViewMyAuctions/>} />
             <Route path="/auction/details/:id" element={<ViewAuctionDetails/>} />
             <Route path="/dashboard" element={<Dashboard/>} />
             <Route path="/me" element={<UserProfile/>} />
             <Route path="/auction/item/:id" element={<AuctionItem />} />
            
            
        </Routes>
        <ToastContainer position="top-right" />
      </Router>
    </>
  )
}

export default App
