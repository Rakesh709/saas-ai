
import { NextRequest, NextResponse } from 'next/server';

import { v2 as cloudinary } from 'cloudinary';

import { auth } from '@clerk/nextjs/server'
import { error } from 'console';


// Configuration
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUNDINARY_API_SECRET
});

//FOR THE TYPESCRIPT

interface CloudinaryUploadResult {
    pubic_id: string,
    [key: string]: any
}

// (async function() {

//     // Upload an image
//      const uploadResult = await cloudinary.uploader
//        .upload(
//            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//                public_id: 'shoes',
//            }
//        )
//        .catch((error) => {
//            console.log(error);
//        });

//     console.log(uploadResult);

//     // Optimize delivery by resizing and applying auto-format and auto-quality
//     const optimizeUrl = cloudinary.url('shoes', {
//         fetch_format: 'auto',
//         quality: 'auto'
//     });

//     console.log(optimizeUrl);

//     // Transform the image: auto-crop to square aspect_ratio
//     const autoCropUrl = cloudinary.url('shoes', {
//         crop: 'auto',
//         gravity: 'auto',
//         width: 500,
//         height: 500,
//     });

//     console.log(autoCropUrl);    
// })();


export async function POST(request: NextRequest){
    const { userId } = await auth()

    if (!userId) {
        return NextResponse.json({})
    }

}