import React ,{useRef,useState,useEffect} from 'react'
import { pdfjs } from "react-pdf"
import { Swiper, SwiperSlide } from 'swiper/react';


import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation'
import 'swiper/css/scrollbar';

import './style.css';
import { EffectCoverflow, Pagination ,Navigation} from 'swiper/modules';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ImageViewer = () =>{
  const [images, setImages] = useState([]);
  const date = getCurrentDate();

  useEffect(() => {
    fetchImages();
    const interval = setInterval(fetchImages, 10000);

    return () => clearInterval(interval);
  }, []);
    const fetchImages = () => {
       fetch(process.env.REACT_APP_API_KEY_IMAGES)
        .then((response) => response.json())
        .then((data) => {
          setImages(data);
       })
        .catch((error) => {
          console.error('Error fetching images:', error);
       });
    };


    return (

  <div className='image_display'>
      <script
      type="module"
      src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"
    ></script>
    <script
      nomodule
      src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"
    ></script>
<Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.0,
        }}
        pagination={{ el: '.swiper-pagination', clickable: true }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          clickable: true,
        }}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="swiper_container"
      > 
        {images.length === 0 ? (
          <SwiperSlide>
            <div className="no-image" style={{textAlign:'center'}}>No image available</div>
          </SwiperSlide>
        ) : (
        images.map((image, index) => (
          <SwiperSlide key={index} >
               <div style={{width:'250px'}}>
                <img src={`${process.env.PUBLIC_URL}/image/${date}/${image}`} alt={`Image ${index + 1}`} />
              </div>
        </SwiperSlide>
       )))}

        <div className="slider-controler">
          <div className="swiper-button-prev slider-arrow">
            <ion-icon name="arrow-back-outline"></ion-icon>
          </div>
          <div className="swiper-button-next slider-arrow">
            <ion-icon name="arrow-forward-outline"></ion-icon>
          </div>
          <div className="swiper-pagination"></div>
        </div>
      </Swiper> 
  </div>
    );
}
export default ImageViewer

function getCurrentDate(){
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, '0');
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const year = currentDate.getFullYear().toString();
  const date =  `${day}-${month}-${year}`;
  return date;
}
