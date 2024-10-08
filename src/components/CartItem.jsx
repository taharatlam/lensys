'use client'
import React, {useState, useEffect} from 'react'
import Image from 'next/image'
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
import QtyCounter from './QtyCounter';
import api from '@/api/api';
import CloseIcon from '@mui/icons-material/Close';

import deleteIcon from '@/images/delete.svg'

const CartItem = ({fullDet, handleRemoveCart, data, counter, handleCounter}) => {
    const [size, setSize] = useState(null);
    const handleOpen = (value) => setSize(value);
    const [isMobile, setIsMobile] = useState(false);
    const [isLens, setIsLens] = useState(false)
    
    useEffect(() => {
        const handleResize = () => {
          if (window.innerWidth < 768) {
            setIsMobile(true);
          } else {
            setIsMobile(false);
          }
        };
        window.addEventListener('resize', handleResize);
        return () => {
          window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(()=>{
      if(data?.productdetails?.categoryid == 4){
        setIsLens(true)
      }
      // console.log("jdbjkcbd", isLens, data.productdetails);
    },[data])
  return (
    <> 
        <div className='cart-item flex gap-5'>
            <div className="cart-img">
                <Image src={data?.productdetails.image} width={150} height={150} alt="" />
            </div>
            <div className="cart-det flex flex-col justify-between items-end w-full">
                <div className='flex items-start gap-2 justify-between w-full'>
                    <div>
                        <h3>{data?.productdetails.product_name}</h3>
                        <p>
                          {
                            data?.productdetails.attributes &&
                            data?.productdetails.attributes?.map((item, index)=>(
                              <>{item.key}: {item.value} | </>
                            ))
                          }
                        </p>
                        {
                            fullDet &&
                            <>
                                <button className="main-btn link-btn mt-2" onClick={() => handleOpen("sm")}>
                                    <span className='text-sm/[14px]'>View All Details</span>
                                </button>
                            </>
                        }
                         {
                            data?.lensprice != 0 &&
                            <p className="addonlens">{`+ ₹ ${data?.lensprice} (${data?.lensdetails?.lenstype})`}</p>
                          }
                        <div className="flex items-center gap-2 flex-wrap"> 
                          
                          {
                            data?.qty > 0 && !isLens &&
                            <QtyCounter counter={data?.qty} handleCounter={handleCounter} cartId={data?.cartid} />
                          }
                          {
                            isLens &&
                            <table className='c-table mt-5 re-f-table'>
                              {/* <thead>
                                <tr>
                                  <th className='text-left'>Eye</th>
                                  <th className='text-left'>Power</th>
                                  <th className='text-left'>Boxes</th>
                                </tr>
                              </thead> */}
                              <tbody>
                                  {
                                    data?.qty > 0 && isLens &&
                                      <tr >
                                        <td>
                                        <label><b>R</b></label>
                                        </td>
                                        <td>
                                        <span>{data?.powerRight}</span>
                                        </td>
                                        <td>
                                        <span>{data?.qty}</span> 
                                        </td>
                                      </tr>
                                  }
                                  {
                                    isLens && data?.qty2 > 0 &&
                                      <tr >
                                        <td>
                                        <label htmlFor=""><b>L</b></label>
                                        </td>
                                        <td>
                                        <span>{data?.powerLeft}</span>
                                        </td>
                                        <td>
                                        <span>{data?.qty2}</span>
                                        </td>
                                      </tr>
                                  }
                              </tbody>
                            </table>
                          }
                         
                        </div>
                    </div>
                    <div className='flex flex-col items-end h-full justify-between'>
                        <p className="price">{'₹ '+data?.subtotal	}</p>
                        <button className='delete-btn' type="button" onClick={(e)=>handleRemoveCart(data?.cartid)}>
                            <span>Remove</span>
                            <Image src={deleteIcon} alt="" />
                        </button>
                    </div>
                </div>
            </div>

        </div>
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
          <DialogHeader>
            <div className="flex items-center justify-between w-full gap-5 flex-wrap">
                <h2 className='head sm'>Product Name</h2>
                <button className='modal-close-btn' onClick={() => handleOpen("close")}>
                    <CloseIcon />
                </button>
            </div>
          </DialogHeader>
          <DialogBody className='p-8 rounded-xl'>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
              {/* <div className="relative">
                <Image src={LoginImg} width={600} height={600} className='w-full h-full object-cover object-center rounded-xl' />
              </div> */}
              <div className="relative">
                
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <button className="main-btn">
                <span>Apply</span>
            </button>
          </DialogFooter>
        </Dialog>
    </>
  )
}

export default CartItem