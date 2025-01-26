
import { NextRequest, NextResponse } from 'next/server';

import { v2 as cloudinary } from 'cloudinary';

import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client/extension';
import { error } from 'console';

//prisma start
const prisma  = new PrismaClient()

// Configuration
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUNDINARY_API_SECRET
});

//FOR THE TYPESCRIPT

interface CloudinaryUploadResult {
    public_id: string;
    bytes:number;
    duration?:number
    [key: string]: any;
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


export async function POST(request: NextRequest) {
    //todo to cehck user

    // const { userId } = await auth()

    // if (!userId) {
    //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    


    try {
        //todo to check user

        if(
            !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || 
            !process.env.CLOUNDINARY_API_SECRET
    
        ){
            return NextResponse.json({error:"Cloudinary credential not found"},{status:500})
        }
        const formData = await request.formData();
        const file = formData.get("file") as File | null
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const originalSize = formData.get("originalSize") as string

        if (!file) {
            return NextResponse.json({ error: "File Not Found" }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        // from the above 2 line of code you can upload anything anywhere 

        const result = await new Promise<CloudinaryUploadResult>(
            (resolve, rejects) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { 
                        resource_type:"video",
                        folder: "video-upload",
                        transformation:[
                            {quality:"auto",fetch_format:"mp4"},
                        ]
                    },
                    // inside the folder
                    (error, result) => {
                        if (error) rejects(error);
                        else resolve(result as CloudinaryUploadResult)
                    }
                )
                uploadStream.end(buffer)
            }
        )
        const video = await prisma.video.create({
            data:{
                title,
                description,
                publicId:result.public_id,
                originalSize: originalSize,
                compressedSize:String(result.bytes),
                duration: result.duration ||0
            }
        })
        return NextResponse.json(video)

    } catch (error) {
        console.log("Upload video Failed",error);
        return NextResponse.json({error:"Upload video failed"},{status:500})
        
    }finally{
        await prisma.$disconnect()
    }

}
