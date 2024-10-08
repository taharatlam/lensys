'use client'
import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import offerImage from '@/images/offer.svg'
import infoIcon from '@/images/info.svg'
import Link from 'next/link'
import { useFormikContext, Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux'
import { updateCartCount } from '@/store/features/cartcount/cartCountSlice'
import axios from 'axios'

import Script from "next/script";

import { useRouter } from 'next/navigation'


import * as Yup from 'yup';


import {
    Accordion,
    AccordionHeader,
    AccordionBody,
    Drawer,
    IconButton,
    Typography
} from "@material-tailwind/react";
import api from '@/api/api'
import CartItem from '@/components/CartItem'

import NoResult from '@/components/NoResult'

function Icon({ id, open }) {


    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`${id === open ? "rotate-180" : ""
                } h-5 w-5 transition-transform`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
    );
}


const Cart = () => {
    const [openRight, setOpenRight] = React.useState(false);
    const { push } = useRouter();
    const dispatch = useDispatch()
    const [open, setOpen] = useState(true);
    const [open1, setOpen1] = useState(false);
    const [isAddressSame, setIsAddressSame] = useState(false)
    const [paymentLoading, setPaymentLoading] = useState(false)
    const [cartItems, setCartItems] = useState([]);
    const [domLoaded, setDomLoaded] = useState(false);
    const [counter, setCounter] = useState(1);
    const [grandTotal, setGrandTotal] = useState(null);
    const [coupons, setCoupons] = useState([]);
    const [cart, setCart] = useState({});
    const [couponInvalid , setCouponInvalid ] = useState(false);

    const [states, setStates] = useState([]);
    const [stateKey, setStateKey] = useState('');
    const [city, setCity] = useState('');
    const [cities, setCities] = useState([]);
    const [pin, setPin] = useState(false);
    const [pinEr, setPinEr] = useState(true);

    const openDrawerRight = () => setOpenRight(true);
    const closeDrawerRight = () => setOpenRight(false);

    const userData = useSelector(state=>state.userData.value);

    

    const getStates = useCallback(async() => {
        const res = await api.get('states');
        setStates(res.data)
        getCities(res.data[11].id)
    }, [])
    const getCities = async (id) => {
        const res = await api.get('cities/' + id);
        setCities(res.data)
      
    }

    // useState(()=>{
    //     setFieldValue('city', cities.length > 0 && cities[3].city)
    //     setFieldValue('state', states.length > 0 && states[11].id)
    //     console.log('data', cities, states);
        
    // }, [cities, states])

    const paymentProceed = async (id) => {
        const res = await api.get('paymentprocess/' + id);
        const data = res.data;
        if (data.status) {
            push('/my-account/orders');
        } else {
            alert('Something went wrong!');
        }
    }

    const handlePayment = async (values) => {
        setPaymentLoading(true)
        const dt = new FormData();
        Object.keys(values).forEach((key) => {
            dt.append(key, values[key]);
        });
        const response = await api.post(`create-order?auth=${userData.access_token}`, dt);
        const data = await response.data;
        console.log(data, "rzor");
        const options = {
            key: data.rkey,
            amount: data.amount,
            order_id: data.orderid,
            name: data.companyname,
            description: 'Test Payment',
            handler: (ress) => {
                console.log('razorpay', ress);
                if (ress) {
                    paymentProceed(ress.razorpay_payment_id)
                    setPaymentLoading(false)
                }
            },
            modal: {
                ondismiss: function () {
                    console.log('Checkout form closed');
                    push('/my-account/orders');
                }
            }
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    };

    const handleCoupon = async (coupon)=>{
        const res = await api.get(`apply-coupon/${coupon}?auth=${userData.access_token}`);
        const data = res.data
        if(data.status){
            setOpenRight(false);
            fetchCart();
        }else{
            setCouponInvalid(true);
            setTimeout(() => {
                setCouponInvalid(false);
            }, 1200);
        }
    }

    const handleRemoveCoupon = async (coupon)=>{
        const res = await api.get(`remove-coupon?auth=${userData.access_token}`);
        const data = res.data
        if(data.status){
            fetchCart();
        }
    }

    const handleCounter = async (e, coun, id, isLens) => {
        var count = 0;
        if (e.target.dataset.action == "inc") {
            count = parseInt(coun) + 1;
        }
        if (e.target.dataset.action == "dec") {
            if (parseInt(coun) > 1) {
                count = parseInt(coun) - 1;
            }
        }
        const data = new FormData();
        data.append('cartid', id);
        if(isLens){
            data.append('qty2', count);
        }else{
            data.append('qty', count);
        }
        const res = await api.post(`updateqty?auth=${userData.access_token}`, data);
        if (res.data) {
            fetchCart();
        }
    }
    const fetchCart = useCallback(async () => {
        const res = await api.get(`cartitems?auth=${userData.access_token}`)
        // if(res.data.status){
        setCartItems(res.data.cartitems || []);
        setCart(res.data || {});
        setGrandTotal(res.data.grandtotal)
        dispatch(updateCartCount(res.data.cartcount || 0));
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[userData])

    const fetchCoupons = useCallback(async () => {
        const res = await api.get(`coupons?auth=${userData.access_token}`)
        setCoupons(res.data || []);
    },[userData])

    const fetchPin = useCallback(async () => {
        if(pin.length == 6){
            const res = await api.get(`checkpincode?pincode=${pin}`)
            setPinEr(res.data);
        }
    },[pin])

    const handleRemoveCart = async (id) => {
        const formData = new FormData();
        formData.append('cartid', id);
        const res = await api.post(`removecartitem?auth=${userData.access_token}`, formData)
        fetchCart();
    }

    useEffect(() => {
        fetchCart()
    },[fetchCart]);

    useEffect(() => {
        getStates()
    },[getStates]);

    useEffect(() => {
        fetchPin()
    },[fetchPin]);

    useEffect(() => {
        setDomLoaded(true)
        // fetchCoupons();
    },[])
    useEffect(() => {
        // setDomLoaded(true)
        fetchCoupons();
    },[userData,fetchCoupons])

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        fname: Yup.string().required('Name is required'),
        lname: Yup.string().required('Last Name is required'),
        phone: Yup.string().required('Phone is required').matches(/^\d{7,15}$/, 'Invalid phone number'),
        address: Yup.string().required('Address is required'),
        state: Yup.string().required('State is required'),
        city: Yup.string().required('City is required'),
        zipcode: Yup.string().required('zipcode is required').matches(/^\d{2,6}$/, 'Invalid ZIP code'),
    });
    const validationSchemaForCoupon = Yup.object().shape({
        coupon: Yup.string().required('Coupon code is required'),
    });


    const handleOpen = () => setOpen((prevState) => !prevState);
    const handleOpen1 = () => setOpen1((prevState) => !prevState);

    return (
        <>

            <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
            <main className='cart-page pt-8 pb-8'>
                {
                    domLoaded ?
                        <>
                            <div className="container mx-auto">
                                {
                                    cartItems.length > 0 ?
                                        <>
                                            <Formik
                                                initialValues={{
                                                    email: userData.email,
                                                    fname: userData.name,
                                                    lname: userData.lastname,
                                                    phone: userData.phone,
                                                    // city: '',
                                                    // state: '',
                                                    city: cities?.[16]?.city || cities?.[16]?.city || '',
                                                    state: states?.[11]?.id || states?.[11]?.id || '',
                                                    address: '',
                                                    zipcode: ''
                                                }}
                                                // enableReinitialize
                                                enableReinitialize={true}
                                                validationSchema={validationSchema}
                                                onSubmit={(values) => {
                                                    console.log('submit..');
                                                    //  var selectedState = ;
                                                    console.log('values pela', values);
                                                    // values.city = city == '' ? cities[0].city : city
                                                    values.state = states.find(state => state.id === values.state) ? states.find(state => state.id === values.state).name : states[0].name;
                                                    console.log('values', values);
                                                    
                                                    handlePayment(values)
                                                    
                                                }}

                                            >
                                                {({ values, isSubmitting, setFieldValue  }) => (
                                                    <Form>
                                                        <div className="grid grid-cols-1 md:grid-cols-12 mt-8 gap-8">
                                                            <div className="relative md:col-span-7">
                                                                <h3 className="it-head mb-5">
                                                                    Personal Details
                                                                </h3>
                                                                
                                                                <div className="grid mt-8 mb-8 grid-cols-1 md:grid-cols-2 gap-5">
                                                                    <div className="form-group">
                                                                        <div className="inp-grp">
                                                                            <Field type="text" name="fname" placeholder="First Name" />
                                                                            <ErrorMessage name="fname" component="div" className="error-message" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <div className="inp-grp">
                                                                            <Field type="text" name="lname" placeholder="Last Name" />
                                                                            <ErrorMessage name="lname" component="div" className="error-message" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="form-group col-span-2">
                                                                        <div className="inp-grp">
                                                                            <Field type="text" name="phone" placeholder="Phone Number" />
                                                                            <ErrorMessage name="phone" component="div" className="error-message" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="form-group col-span-2">
                                                                        <div className="inp-grp">
                                                                            <Field type="text" name="email" placeholder="Email" readOnly />
                                                                            <ErrorMessage name="email" component="div" className="error-message" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                
                                                                <h3 className="it-head mb-5 mt-10">
                                                                    Shipping Details
                                                                </h3>
                                                                <div className="grid mt-8 mb-8 grid-cols-1 md:grid-cols-2 gap-5">
                                                                    <div className="form-group col-span-2">
                                                                        <div className="inp-grp">
                                                                            <Field type="text" name="address" placeholder="Address Line 1" />
                                                                            <ErrorMessage name="address" component="div" className="error-message" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="form-group ">
                                                                        <div className="inp-grp">
                                                                            <select name="state" value={values.state} onChange={(e) =>{getCities(e.target.value); setStateKey(e.target.value);setFieldValue('state', e.target.value)}}  id="">

                                                                                {   
                                                                                    states.map((state, index) => (
                                                                                        <option  value={state.id} key={index}>
                                                                                            {state.name}
                                                                                        </option>
                                                                                    ))
                                                                                }
                                                                            </select>
                                                                            {/* <Field as="select" name="state" onChange={(e) => getCities(e.target.value)} >

                                                                            </Field> */}
                                                                            <ErrorMessage name="state" component="div" className="error-message" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <div className="inp-grp">
                                                                            <select name="city" value={values.city} id="" onChange={(e)=>{setCity(e.target.value); setFieldValue('city', e.target.value)}}>
                                                                                {
                                                                                    cities.map((city, index) => (
                                                                                        <option value={city.city} key={index}>
                                                                                            {city.city}
                                                                                        </option>
                                                                                    ))
                                                                                }
                                                                            </select>
                                                                            {/* <Field  as="select" name="city" placeholder="city">
                                                                            </Field> */}
                                                                            <ErrorMessage name="city" component="div" className="error-message" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="form-group col-span-2">
                                                                        <div className="inp-grp">
                                                                            <Field type="select" name="zipcode" placeholder="Zip Code" onKeyUp={(e)=>setPin(e.target.value)} />
                                                                            <ErrorMessage name="zipcode" component="div" className="error-message" />
                                                                            {
                                                                                !pinEr &&
                                                                                <p class="error-message">Sorry we currently not providing services in your area </p>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                             

                                                            </div>
                                                            <div className="relative md:col-span-5 sticky top-20 self-start">
                                                                
                                                                <Accordion open={open} icon={<Icon id={1} open={open ? 1 : 0} />} className=''>
                                                                    <AccordionHeader className='cart-total-btn' onClick={handleOpen}>
                                                                        <h3 className="it-head">
                                                                            Total: <span>₹ {grandTotal || ''}</span>
                                                                        </h3>
                                                                    </AccordionHeader>
                                                                    <AccordionBody className="">
                                                                        <p className='cart-tot-det'>
                                                                            {
                                                                                cart.subtotal != 0&&
                                                                                <div className="cart-det-bx">
                                                                                <span>Subtotal : </span>
                                                                                <span>₹ {cart.subtotal}</span>
                                                                                
                                                                                </div>
                                                                            }
                                                                            {
                                                                                cart.discount != 0&&
                                                                                <div className="cart-det-bx">
                                                                                <span>Discount : </span>
                                                                                <span>- ₹ {cart.discount}</span>
                                                                                
                                                                                </div>
                                                                            }
                                                                            <Accordion open={open1} icon={<Icon id={1} open={open1 ? 1 : 0} />} className=''>
                                                                            <AccordionHeader className='cart-total-btn' onClick={handleOpen1}>
                                                                                <h3 className="it-head sm">
                                                                                    Total GST: <span>₹ {cart?.totalgst}</span>
                                                                                </h3>
                                                                            </AccordionHeader>
                                                                            <AccordionBody className="p-0 top-p">
                                                                               {
                                                                                cart?.cartitems.map((item,i)=>{
                                                                                    return(
                                                                                        <div key={i} className="cart-det-bx pr">
                                                                                            <span>{item.productdetails.product_name} : </span>
                                                                                            <span>₹ {item.productdetails.taxamount} | {item.productdetails.gst}</span>
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                               }
                                                                            </AccordionBody>
                                                                            </Accordion>
                                                                            
                                                                                
                                                                                <div className="cart-det-bx">
                                                                                    <span>Shipping : </span>
                                                                                    <span class="green-text">{cart.shipping != 0 ? cart.shipping : 'FREE'}</span>
                                                                                </div>
                                                                            
                                                                            {/* {
                                                                                cart.shipping != 0&&
                                                                                <div>
                                                                                <span>Shipping : </span>
                                                                                <span>₹ {cart.shipping}</span>
                                                                                </div>
                                                                            } */}
                                                                        </p>
                                                                    </AccordionBody>
                                                                </Accordion>
                                                                <div className="cart-items-list mb-5">
                                                                    {
                                                                        cartItems.length > 0 ?
                                                                            cartItems?.map((item, index) => (
                                                                                <CartItem handleCounter={handleCounter} counter={counter} data={item} handleRemoveCart={handleRemoveCart} key={index} />
                                                                            )) : <NoResult message={"You don&apos;t have any items added in cart"} />
                                                                    }
                                                                </div>
                                                                {
                                                                    cart.discount != 0?
                                                                    <>
                                                                    <div className={`coupon-wrap`} onClick={()=>handleRemoveCoupon(cart?.coupon)}>
                                                                        <h3 className='uppercase'>{cart?.coupon}</h3>
                                                                        <p>
                                                                            {cart?.coupondesc}
                                                                        </p>
                                                                        <span className="apply">
                                                                            Remove
                                                                        </span>
                                                                    </div>
                                                                    </>:
                                                                    <div className="apply-offer-strip" onClick={openDrawerRight}>
                                                                        <div className="ic">
                                                                            <Image src={offerImage} width={30} height={30} alt="" />
                                                                        </div>
                                                                        <span>Apply Coupon</span>
                                                                    </div>
                                                                }

                                                                <button disabled={paymentLoading || !pinEr} type="submit" className='main-btn full mt-5 big dark'>
                                                                    <span>{paymentLoading?'Please wait...':'Proceed For Payment'}</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </Form>
                                                )}
                                            </Formik>
                                        </> :
                                        <>
                                            <div className="no-cart-items pt-12 pb-12">
                                                <h3 className='heading text-center mb-5'>You don&apos;t have any items added in yout cart</h3>
                                                <Link href="/" className="main-btn center mt-5">
                                                    <span>Do some shopping</span>
                                                </Link>
                                            </div>
                                        </>
                                }
                            </div>
                            <Drawer
                                placement="right"
                                open={openRight}
                                onClose={closeDrawerRight}
                                className="p-4"
                                size={450}
                            >
                                <div className="mb-6 flex items-center justify-between">
                                    <Typography variant="h5" color="blue-gray">
                                        Apply Coupon
                                    </Typography>
                                    <IconButton
                                        variant="text"
                                        color="blue-gray"
                                        onClick={closeDrawerRight}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                            stroke="currentColor"
                                            className="h-5 w-5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </IconButton>
                                </div>

                                <Formik
                                    initialValues={{
                                        coupon: ''
                                    }}
                                    validationSchema={validationSchemaForCoupon}
                                    onSubmit={(values) => {
                                        handleCoupon(values.coupon)
                                    }}
                                >
                                    {({ isSubmitting }) => (
                                        <Form>
                                            <div className="apply-coupon-wrap">
                                                <div className="form-group">
                                                    <div className="inp-grp">
                                                        <Field type="text" name="coupon" placeholder="Enter Coupon" />
                                                    </div>
                                                </div>
                                                <button type="submit" className='main-btn'>
                                                    <span>Apply</span>
                                                </button>
                                            </div>
                                            <ErrorMessage name="coupon" component="div" className="error-message" />
                                            {
                                                couponInvalid&&
                                                <><p className='error-message mb-0'>Coupon code is invalid</p></>
                                            }
                                        </Form>
                                    )}     
                                </Formik>
                                {
                                    coupons.length > 0 &&
                                   
                                    <div className="coupons-list">
                                        {
                                             coupons?.map((item, index) =>(   
                                                <div className={`coupon-wrap ${item?.applicable?'':'disabled'}`} key={index} onClick={()=>item?.applicable?handleCoupon(item?.code):''}>
                                                    <h3 className='uppercase'>{item?.code}</h3>
                                                    <p>{item?.description}</p>
                                                    <span className="apply">
                                                        {item?.applicable?'Apply':'Not Applicable'}
                                                    </span>
                                                </div>
                                            ))
                                        }
                                     
                                    </div>
                                    // <NoResult message={'No coupons available right now'} />
                                }
                                
                                
                            </Drawer>
                        </> : ''
                }
            </main>
        </>
    )
}

export default Cart