import React from 'react'
import Image from 'next/image'

function Section7() {
    return (
        <div className='bg-[#3E3003] w-full h-auto py-30 relative overflow-hidden'>
            <div className='absolute bottom-0 right-0 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 opacity-30 pointer-events-none z-0'>
                <Image 
                    src='/images/Home/MandanaRight.svg' 
                    alt='section7 decorative' 
                    fill
                    sizes="(max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
                    className='object-contain'
                />
            </div>
            <div className='absolute top-0 left-0 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 opacity-30 pointer-events-none z-0'>
                <Image 
                    src='/images/Home/MandanaLeft.svg' 
                    alt='section7 decorative' 
                    fill
                    sizes="(max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
                    className='object-contain'
                />
            </div>
            <div className='containerpadding container mx-auto  relative z-10'>
                <div className=''>
                    <h1 className='title text-center'>
                        Sri Lanka - Miracle of Asia
                    </h1>
                    <p className='mt-5 description'>
                        Sri Lanka with its nearly 3000 years of history holds some of world’s ancient cities including Anuradhapura, Polonnaruwa and Digamadulla. Remnants of these once glorious cities, their palaces, temples, monasteries, hospitals and theaters intricately carved and modeled out of stone lay abandoned amidst the soaring mountains.
                    </p>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5 items-stretch'>
                        <div className='flex flex-col'>
                       <p className='description'>
                       Of all the ancient sites the most famed and most exquisite is the Kingdom of Anuradhapura. Sri Lanka's third and the longest serving capital and one of the oldest continuously inhabited cities in the world is also one of the most sacred cities of World Buddhists. It was the capital of Sri Lanka from the Fourth Century BC up to the turn of the eleventh Century and was one of the most stable and durable centers of political power and urban life in South Asia. However the city itself is much older than the Kingdom of Anuradhapura and according to archeological evidence could have originated as far as tenth century BC.
                       </p>
                       <p className='mt-5 description'>
                       Anuradhapura was abandoned due to the due to repeated South Indian Invasions and was eventually forgotten with time until it was rediscovered in the early 19 th century.Of all the ancient sites the most famed and most exquisite is the Kingdom of Anuradhapura.                       </p>
                       </div>
                        <div className='w-full relative min-h-[400px] lg:min-h-0 lg:h-full'>
                            <Image
                                src='/images/Home/SriLanka.png'
                                alt='section7'
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className='object-cover w-full h-full'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Section7