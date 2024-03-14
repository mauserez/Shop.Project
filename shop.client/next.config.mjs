/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "via.placeholder.com",
			},
			{
				protocol: "https",
				hostname: "images.gizbot.com",
			},
		],
	},
};

export default nextConfig;
