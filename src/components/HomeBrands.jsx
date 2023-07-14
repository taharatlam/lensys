import React from 'react'
import SecHeading from './SecHeading'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Grid } from "swiper";
import Image from 'next/image';

import lg1 from '@/images/lg1.png'
import lg2 from '@/images/lg2.png'
import lg3 from '@/images/lg3.png'
import lg4 from '@/images/lg4.png'
import lg5 from '@/images/lg5.png'
import lg6 from '@/images/lg6.png'
import lg7 from '@/images/lg7.png'
import lg8 from '@/images/lg8.png'

import "swiper/css";
import "swiper/css/grid";

const HomeBrands = () => {
  return (
    <section className='sec home-brand-sec'>
        <div className="container mx-auto">
            <div className="container">
                <SecHeading centerLine={true}>
                    Brands
                </SecHeading>
                <div className="brand-swiper-container">
                    <Swiper spaceBetween={20}  slidesPerView={4} grid={{rows: 2}}  onSlideChange={() => console.log('slide change')} onSwiper={(swiper) => console.log(swiper)} modules={[Grid]} className='brand-swiper' >
                        <SwiperSlide>
                            <div className="brand-wrapper">
                                <Image src={lg1} alt="brand" width={200} height={100}  />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="brand-wrapper">
                                <Image src={lg2} alt="brand" width={200} height={100}  />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="brand-wrapper">
                                <Image src={lg3} alt="brand" width={200} height={100}  />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="brand-wrapper">
                                <Image src={lg4} alt="brand" width={200} height={100}  />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="brand-wrapper">
                                <Image src={lg5} alt="brand" width={200} height={100}  />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="brand-wrapper">
                                <Image src={lg6} alt="brand" width={200} height={100}  />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="brand-wrapper">
                                <Image src={lg7} alt="brand" width={200} height={100}  />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="brand-wrapper">
                                <Image src={lg8} alt="brand" width={200} height={100}  />
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>
        </div>
    </section>  
  )
}

export default HomeBrands