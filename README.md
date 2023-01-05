A small script to poll an S3 bucket and pull down and uncompress any files there.

Was originally intended to test Akamai Datastream2 logs making it into an S3 bucket, a seperate process was running to delete those files so was difficult to see the logs coming from Datastream2. 

To run you need to setup the bucket name and folder you want to monitor in index.js, login to aws (add credentials to ~/.aws/credentials) and then run the following command:

``` shell
node index.js
```