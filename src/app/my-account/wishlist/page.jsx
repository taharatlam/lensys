'use client'
import React,{useState, useEffect, useCallback} from 'react'
import ProductCardSkeleton from '@/components/skeleton/ProductCardSkeleton'
import ProductCard from '@/components/ProductCard'
import api from '@/api/api'
import NoResult from '@/components/NoResult'
import { useSelector } from 'react-redux'
import {
    Card,
    Dialog,
    DialogBody,
    DialogFooter,
    CardHeader,
    CardBody,
    CardFooter,
    Input,
    Checkbox,
    Button,
    Typography,
    Popover,
    PopoverHandler,
    PopoverContent,
    List,
    ListItem,
  } from "@material-tailwind/react";

const Whishlist = () => {
    const [products,setProduct] = useState([]);
    const [loading,setLoading] = useState(true);

    const userData = useSelector(state=>state.userData.value);
    const fetchProduct = useCallback(async()=>{
        const response = await api.get(`wishlist?auth=${userData.access_token}`);
        const data = response.data.data;
        setProduct(p=>data);
        setTimeout(() => {
            setLoading(false)
        }, 1500);
    },[userData.access_token])
    useEffect(() => {
        fetchProduct();
    }, [fetchProduct])
  return (
    <main className='myacc-container'>
            <div className="acc-content-wrap my-acc-page-content p-5">
              <Card className='mb-5'>
                <CardBody>
                  <ul className="bread-crumbs">
                    <li>
                      <h1 className="heading">My Account</h1>
                    </li>
                    <li>
                      <h1 className="heading">Wishlist</h1>
                    </li>
                  </ul>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                <div className="archive-pr-wrapper">
              {
                loading ?
                <div className="relative grid grid-cols-1 lg:grid-cols-4 gap-5 mt-5">
                  {
                    [...Array(8)].map((item, index)=>(
                      <ProductCardSkeleton key={index} />
                    ))
                  }
                </div>:
                products.length?
                <div className="relative grid grid-cols-1 lg:grid-cols-4 gap-5 mt-5">
                  {
                     products.map((item,index)=>{
                      return(
                        <div className="relative" key={index}>
                          <ProductCard data={item} />
                        </div>
                      )
                    })
                  }
                </div>:<div className='pt-5'><NoResult message={'No results found'} /></div>
                
              }
        </div>
                </CardBody>
            </Card>
            </div>
            </main>

  )
}

export default Whishlist