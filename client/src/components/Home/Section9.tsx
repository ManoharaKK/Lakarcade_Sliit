import React from 'react'
import Image from 'next/image'
function Section9() {
    return (
        <div className='containerpadding container mx-auto mt-8 sm:mt-10 md:mt-12 lg:mt-12 xl:mt-14 2xl:mt-16 relative'>
            {/* Corner Images */}
            <div className='absolute top-0 inset-x-0 flex justify-between pointer-events-none px-4 sm:px-6 lg:px-10 xl:px-20 2xl:px-20'>
                <Image src='/images/Home/MandanaLt.svg' alt='icon' width={8914} height={459} className='w-auto h-auto max-w-[100px] sm:max-w-[120px] md:max-w-[140px] lg:max-w-[150px] xl:max-w-[130px] 2xl:max-w-[150px]' />
                <Image src='/images/Home/MandanaTr.svg' alt='icon' width={8914} height={459} className='w-auto h-auto max-w-[100px] sm:max-w-[120px] md:max-w-[140px] lg:max-w-[150px] xl:max-w-[130px] 2xl:max-w-[150px]' />
            </div>
            <div className='absolute bottom-0 inset-x-0 flex justify-between pointer-events-none px-4 sm:px-6 lg:px-10 xl:px-20 2xl:px-20'>
                <Image src='/images/Home/MandanaLb.svg' alt='icon' width={8914} height={459} className='w-auto h-auto max-w-[100px] sm:max-w-[120px] md:max-w-[140px] lg:max-w-[150px] xl:max-w-[130px] 2xl:max-w-[150px]' />
                <Image src='/images/Home/MandanaRb.svg' alt='icon' width={8914} height={459} className='w-auto h-auto max-w-[100px] sm:max-w-[120px] md:max-w-[140px] lg:max-w-[150px] xl:max-w-[130px] 2xl:max-w-[150px]' />
            </div>

            {/* Top Divider */}
            <div className='bg-lightbrown w-full h-[1px] mt-4 sm:mt-6 md:mt-8 lg:mt-10 xl:mt-12 2xl:mt-14'>
            </div>

            {/* Content with Left Image, Center Text, Right Image - Centered between dividers */}
            <div className='flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-6 xl:gap-8 2xl:gap-10 py-8 sm:py-10 md:py-12 lg:py-14 xl:py-16 2xl:py-20'>
                <Image src='/images/Home/Mandanafooter.png' alt='icon' width={300} height={300} className='hidden lg:block w-auto h-full object-contain max-w-[80px] lg:max-w-[150px] xl:max-w-[200px] 2xl:max-w-[200px]' />
                <div className='w-full max-w-[90%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[60%] xl:max-w-[60%] 2xl:max-w-[60%] px-2 sm:px-4 md:px-6 lg:px-0'>
                    <h1 className='text-blackbrown subtitle text-center mb-4 sm:mb-5 md:mb-6 lg:mb-6 xl:mb-7 2xl:mb-8'>
                        Where Tradition Meets Tomorrow
                    </h1>
                    <p className='text-blackbrown description text-center text-sm sm:text-base md:text-base lg:text-base xl:text-lg 2xl:text-lg'>
                        From the mask carvers of Ambalangoda to the weavers of Dumbara, every product we showcase carries the story of its maker and the culture of their village. We work directly with artisans and families who have mastered their craft through generations, ensuring that every purchase supports their livelihood, strengthens rural economies, and keeps Sri Lanka's cultural heritage alive.
                        <br />
                        <br />
                        We are also deeply committed to sustainability and authenticity. All our handicrafts are made using eco-friendly natural materials, each product verified with QR/NFC tracking to guarantee originality and artisan recognition. With every item you purchase, you become part of a global community that values tradition, creativity, and conscious living.
                    </p>
                </div>
                <Image src='/images/Home/Mandanafooter.png' alt='icon' width={300} height={300} className='hidden lg:block w-auto h-full object-contain max-w-[80px] lg:max-w-[150px] xl:max-w-[200px] 2xl:max-w-[200px]' />
            </div>

            {/* Bottom Divider */}
            <div className='bg-lightbrown w-full h-[1px] mb-4 sm:mb-6 md:mb-8 lg:mb-10 xl:mb-12 2xl:mb-14'>
            </div>
        </div>
    )
}

export default Section9