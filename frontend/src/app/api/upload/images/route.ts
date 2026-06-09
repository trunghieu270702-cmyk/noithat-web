import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, message: 'Không có file nào được tải lên.' }, { status: 400 });
    }

    const cloudName = 'dmbc4l5sp';
    const apiKey = '754381674985892';
    const apiSecret = '6c5yCfbKtbR3JMYVR5I3b1ddyqs';
    const folder = 'omnix';

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;

      const timestamp = Math.round(new Date().getTime() / 1000);
      
      // Tạo signature theo chuẩn Cloudinary
      // Các tham số cần sign phải được sắp xếp theo thứ tự alphabet
      const strToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash('sha1').update(strToSign).digest('hex');

      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append('file', base64String);
      cloudinaryFormData.append('api_key', apiKey);
      cloudinaryFormData.append('timestamp', timestamp.toString());
      cloudinaryFormData.append('signature', signature);
      cloudinaryFormData.append('folder', folder);

      const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: cloudinaryFormData,
      });

      const cloudinaryData = await cloudinaryRes.json();
      if (cloudinaryData.secure_url) {
        uploadedUrls.push(cloudinaryData.secure_url);
      } else {
        console.error('Cloudinary error:', cloudinaryData);
      }
    }

    return NextResponse.json(uploadedUrls);
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ success: false, message: 'Lỗi server khi tải ảnh' }, { status: 500 });
  }
}
