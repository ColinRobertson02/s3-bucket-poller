// Import required AWS SDK clients and commands for Node.js.
import { ListObjectsCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./libs/s3Client.js"; // Helper function that creates an Amazon S3 service client module.
import fs from "fs";

import zlib from "zlib";
 

const BUCKET_NAME = "buketname";

// Create the parameters for the bucket
export const bucketParams = { 
    Bucket: BUCKET_NAME, 
    Prefix: "bukcetfolder" };

export const run = async () => {
  try {
    const data = await s3Client.send(new ListObjectsCommand(bucketParams));

    if(data.Contents) {
        for (let index = 0; index < data.Contents.length; index++) {
            const fileName = data.Contents[index].Key;

            const bucketParams = { Bucket: BUCKET_NAME, Key: fileName};

            const decompressedFilename = `logs${fileName.substring(fileName.lastIndexOf('/'), fileName.length-3)}`;

            if(!fs.existsSync(decompressedFilename))
            {
                console.log("Downloading ", fileName);
                const file = await s3Client.send(new GetObjectCommand(bucketParams));

                // const body = await file.Body.transformToString();
    
                console.log('Saving to ', decompressedFilename);

                await new Promise((resolve, reject) => {
                    file.Body
                      .pipe(zlib.createGunzip())
                      .pipe(fs.createWriteStream(decompressedFilename))
                      .on('error', err => reject(err))
                      .on('close', () => resolve())
                  })

            } else {
                console.log(`${decompressedFilename} already exists so skipping`)
            }
        }
    } else {
        console.log('No logs to download :( press ctrl-c to exit at any time')
    }
    return data; // For unit tests.
  } catch (err) {
    console.log("Error", err);
  }
};

setInterval(run, 1000);

function parseHeader(chunk) {
    console.log("Header Chunk:", chunk)
}

function handleGunzipError(err, file) {
    console.error(err);
}
