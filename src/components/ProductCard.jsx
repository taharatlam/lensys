import React, {useState, useEffect} from 'react'
import Productlikebtn from './Productlikebtn'
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import Link from 'next/link';

import { useDispatch, useSelector } from 'react-redux'

import pr from '@/images/pr1.png'

import 'swiper/css';

const ProductCard = ({ data, ImageProductCard}) => {
    const userData = useSelector((state)=> state.userData.value);
    const isLoggedIn = userData.loggedin;
    const [liked , setLiked] = useState(false);
    const hasOffer = true;
    data = data || {}
    const {name,price,regular_price,image,alt_text,slug} = data;
    return (
        
            <article className={`le_pr-main-wrapper ${ImageProductCard?'le_pr-main-img-wrapper':''}`}>
                {
                    isLoggedIn &&
                    <Productlikebtn liked={liked} setLiked={setLiked} />
                }
                <Link href={`product/${slug}`}>
                    <div className="le_pr-image-carousel">
                        <Swiper
                            spaceBetween={0}
                            slidesPerView={1}
                            // onSlideChange={}
                            // onSwiper={}
                        >
                            {
                                [...Array(3)].map((item, index)=>(
                                    <SwiperSlide key={index}>
                                        <div className="le_pr-image">
                                            <Image src={pr} width={300} height={300} alt="" />
                                        </div>
                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>
                    </div>
                    <div className="le_pr-con-wrap">
                        <div className="le_pr-content">
                            <h3 className='le_pr-title'>{name?name:'Vincent Chase Online'}</h3>
                            <p className='le_pr-para'>Size: Medium • Classic Acetate</p>
                            <div className="le_pr-price">
                                <h3>{regular_price?regular_price:'₹999'} <span>+ tax</span></h3>
                            </div>
                        </div>
                        <div className="le_pr-offer-strip">
                            BUY 1 GET 1 FREE
                        </div>
                    </div>
                </Link>
            </article>
      
    )
}

export default ProductCard