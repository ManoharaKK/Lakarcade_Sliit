import React from 'react'
import Navbar from '@/components/Navbar/navbar'
import Cards from '@/components/NFT/cards'
import metaData from '@/content/meta.json'


function page() {
  return (
    <div>
      <Navbar />
      <div className="containerpadding container mx-auto relative  pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8 mt-[200px]">
        <div className="absolute inset-0">
          <div className="h-1/3 sm:h-2/3" />
        </div>
        <div className="relative">
          <div className="text-center">
            <h2 className="text-3xl tracking-tight font-extrabold text-white sm:text-4xl">Amazing Creatures NFTs</h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-white sm:mt-4">
              Mint a NFT to get unlimited ownership forever!
            </p>
          </div>

             <div className="mt-12 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
               {metaData.map((item, index) => (
                 <div key={index}>
                   <Cards 
                     name={item.name}
                     description={item.description}
                     image={item.image}
                     attributes={item.attributes}
                   />
                 </div>
               ))}
             </div>

          
        </div>
      </div>
    </div>
  )
}

export default page

