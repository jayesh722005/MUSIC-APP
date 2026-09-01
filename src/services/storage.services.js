
const ImageKit=require('@imagekit/nodejs')

const Imagekitclient = new ImageKit({
  privateKey: process.env['IMAGEKIT_PRIVATE_KEY'], // This is the default and can be omitted
});

async function uploadFile(file)
{
    const result=await Imagekitclient.files.upload({
        file,
        fileName:"music_"+Date.now(),
        folder:"yt-complete-backend/music"
    })

    return result;
}


module.exports={uploadFile}