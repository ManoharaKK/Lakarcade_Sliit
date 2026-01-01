import React from 'react'
import Image from 'next/image'
import villageData from './Village.json'
import Review from './Review'

interface Village {
    id: number
    name: string
    region: string
    famousFor: string
    location: {
        name: string
        image: string
    }
    description: string[]
    makingVideo: string
    impactDescription: string[]
    impactImages: string[]
}

function Village({ villageName }: { villageName?: string }) {
    // Find village by name, or use first village if no name provided
    const village = villageName 
        ? (villageData as Village[]).find(v => v.name === villageName)
        : (villageData as Village[])[0]

    if (!village) {
        return null
    }

    return (
        <div>
        <div className='mt-5 grid grid-cols-1 xl:grid-cols-7 gap-4 items-stretch'>
            <div className='col-span-2 flex flex-col xl:border-r xl:border-lightbrown xl:pr-4'>
                <h1 className='text-blackbrown title'>
                    Village Spotlight
                </h1>

                <div className='bg-[#3E3003] p-4 mt-5 flex-1 flex flex-col'>
                    <div>
                        <Image src={village.location.image} alt={village.location.name} width={500} height={500} className='w-full h-full object-cover mb-5' />
                    </div>
                    <div>
                        <p className='title text-primary mt-5'>
                            {village.name}
                        </p>
                        <div className='my-5'>
                        <p className='description text-primary'>
                            Region : {village.region}
                        </p>
                        <p className='description text-primary'>
                            Famous for : {village.famousFor}
                        </p>
                        </div>
                    </div>
                    <div>
                        {village.description.map((paragraph, index) => (
                            <p key={index} className='description text-primary mb-4'>
                                {paragraph}
                            </p>
                        ))}
                    </div>
                    <button className='w-full border border-primarybrown text-primarybrown py-3 px-6  hover:bg-primarybrown hover:text-primary transition-colors '>
                        More Info
                    </button>

                </div>

            </div>
            <div className='col-span-5 flex flex-col'>
                <h1 className='text-blackbrown title'>
                    How the {village.name} is Made
                </h1>
                <video 
                    src={village.makingVideo} 
                    className='w-full h-auto object-cover mt-5' 
                    controls
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    Your browser does not support the video tag.
                </video>
                <div className='bg-lightbrown w-full h-[1px] mt-5'>
                </div>
                <h1 className='text-blackbrown title mt-5'>
                    Impact on the community
                </h1>
                {village.impactDescription.map((paragraph, index) => (
                    <p key={index} className='description text-blackbrown mt-5'>
                        {paragraph}
                    </p>
                ))}

                <div className='grid grid-cols-1 xl:grid-cols-3 gap-4 mt-5'>
                    {village.impactImages.map((image, index) => (
                        <div key={index} className='col-span-1'>
                            <Image src={image} alt={`${village.name} impact ${index + 1}`} width={500} height={500} className='w-full h-full object-cover' />
                        </div>
                    ))}
                </div>
            </div>
            
        
        </div>
        <div className='bg-lightbrown w-full h-[1px] mt-5'>
            </div>
            <Review />
            </div>
    )
}

export default Village