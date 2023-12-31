import React, { useState, useEffect } from 'react'
import person from '../images/person.svg'
import av from '../images/person.png'
import Image from 'next/image'

import Link from 'next/link'

import LogoutIcon from '@mui/icons-material/Logout';
import RedeemIcon from '@mui/icons-material/Redeem';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

// import { Logout } from '@/utils/Logout'

import LoginImg from '@/images/login-img.png'

import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Avatar,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

import LoginSigup from './LoginSigup'

import { useDispatch, useSelector } from 'react-redux'
import { updateUserData } from '@/store/features/userdata/UserDataSlice'
import { updateCartCount } from '@/store/features/cartcount/cartCountSlice'

import customToast from '@/utils/CusToast'

const HeaderLoginArea = () => {
  const [size, setSize] = useState(null);
  const handleOpen = (value) => setSize(value)

  const userData = useSelector((state)=> state.userData.value);
  const dispatch = useDispatch();


  
  
  const isLoggedIn = userData.loggedin;

  const LogoutClick = ()=>{
      // console.log("logout");
      localStorage.removeItem('access_token');
      dispatch(updateUserData({loggedin:false}));
      dispatch(updateCartCount(0));
      customToast('Logged Out','error')
  }

  useEffect(() => {
    console.log("headerLoginArea data", userData)
  },[userData])



  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // Check the window width and set the class accordingly
      if (window.innerWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


 
    return (
      <>
  
      {

  !isLoggedIn?
        <>
        <button className="main-btn ml-3 white-bordered" onClick={() => handleOpen("sm")}>
          <span>Login/Signup</span>
        </button>
          {/* <button className="header-action-btn header-login-btn" onClick={() => handleOpen("sm")} >
            <Image src={person} width={"50px"} height={"50px"} alt="" />
           
          </button> */}
          <Dialog
            open={
              size === "xs" ||
              size === "sm" ||
              size === "md" ||
              size === "lg" ||
              size === "xl" ||
              size === "xxl"
            }
            size={isMobile? 'xl': size || "md"}
            handler={handleOpen}
           
          >
            
            <DialogBody className='p-8 rounded-xl h-[85vh] overflow-scroll'>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                <div className="relative">
                  <LoginSigup handleOpen={handleOpen} />
                </div>
              </div>
            </DialogBody>
          </Dialog>
        </>:
            <Popover placement="bottom">
              <PopoverHandler>
                <button className="header-action-btn header-login-btn">
                  <Image src={person} width={"50px"} height={"50px"} alt="" />
                </button>
              </PopoverHandler>
              <PopoverContent className="w-72 z-50">
                <div className="flex items-center gap-4 border-b border-blue-gray-50 pb-4 mb-4">
                  {/* <Avatar src={av.src} alt="candice wu" /> */}
                  <div>
                    <Typography variant="h6" color="blue-gray">{userData.name}</Typography>
                    {/* <Typography variant="small" color="gray" className="font-normal">User@1256</Typography> */}
                  </div>
                </div>
                <List className="p-0">
                  <Link href="#" className="text-initial">
                    <Link href="/my-account">
                      <ListItem>
                        <ListItemPrefix>
                          <InsertEmoticonIcon />
                        </ListItemPrefix>
                        My Profile
                      </ListItem>
                    </Link>
                  </Link>
                  <Link href="/my-account/orders" className="text-initial">
                    <ListItem>
                      <ListItemPrefix>
                        <RedeemIcon />
                      </ListItemPrefix>
                      My Orders
                    </ListItem>
                  </Link>
                  <Link href="/my-account/wishlist" className="text-initial">
                    <ListItem>
                      <ListItemPrefix>
                        <FavoriteBorderIcon />
                      </ListItemPrefix>
                      Wishlist
                    </ListItem>
                  </Link>
                  <ListItem onClick={LogoutClick}  className="text-initial">
                    <ListItemPrefix>
                      <LogoutIcon />
                    </ListItemPrefix>
                    Logout
                  </ListItem>
                 
                </List>
              </PopoverContent>
            </Popover>
      }
      </>
    )
  
}

export default HeaderLoginArea