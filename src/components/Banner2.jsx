import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import banner1 from '../assets/banner/banner1.png'
import banner2 from '../assets/banner/banner2.png'
import banner3 from '../assets/banner/banner3.png'

const Banner2 = () => {
    return (
     <div className="max-w-360 mx-auto">
       <Carousel autoPlay={true}
                 infiniteLoop={true}
                 stopOnHover={true}>
                <div>
                    <img src={banner1} className='rounded-2xl'/>
                </div>
                <div>
                    <img src={banner2} className='rounded-2xl'/>
                </div>
                <div>
                    <img src={banner3} className='rounded-2xl'/>
                </div>
     </Carousel>
    </div>
    );
};

export default Banner2;