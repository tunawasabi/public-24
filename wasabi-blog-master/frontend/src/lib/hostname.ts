const hostName: string = process.env.HOST_URL ??
    "https://" + process.env.VERCEL_URL!
export default hostName;
