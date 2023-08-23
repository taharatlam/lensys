import React, {useRef} from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import { Navigation } from "swiper";
import ProductCard from './ProductCard';

import "swiper/css";
import "swiper/css/navigation";


const ProductImageSlider = () => {
    const navigationPrevRef = useRef();
    const navigationNextRef = useRef();

    return (
        <div className='le_pr-image-swiper'>
            
            <Swiper navigation={{prevEl: navigationPrevRef.current,nextEl: navigationNextRef.current,}} spaceBetween={15} slidesPerView={4} onSlideChange={() => console.log('slide change')} modules={[Navigation]} className='mt-14 pb-5' breakpoints={{
                                    0: {
                                        slidesPerView: 1,
                                        spaceBetween: 10,
                                    },
                                    640: {
                                        slidesPerView: 1.5,
                                        spaceBetween: 10,
                                    },
                                    768: {
                                        slidesPerView: 3,
                                        spaceBetween: 10,
                                    },
                                    1024: {
                                        slidesPerView: 4,
                                        spaceBetween: 10,
                                    },
                                }}>
                {
                    [...Array(8)].map((item,index)=>(
                        <SwiperSlide key={index}>
                            <ProductCard ImageProductCard={true} />
                        </SwiperSlide>
                    ))
                }
            </Swiper>
            {/* <div className="sw-next" ref={navigationNextRef} />
            <div className="sw-prev" ref={navigationPrevRef} /> */}
        </div>
    )
}

export default ProductImageSlider