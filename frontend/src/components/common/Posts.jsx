import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { POSTS } from "../../utils/db/dummy";
import { baseUrl } from "../../constant/url";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({feedType}) => {

	const getPostEndPoint =()=>{
		switch (feedType) {
			case "forYou":
				return `${baseUrl}/api/post/posts`
			case "following":
				return `${baseUrl}/api/post/following`
		
			default:
				return `${baseUrl}/api/post/posts`
		}
	}

	const POST_ENDPOINTS=getPostEndPoint()
	console.log(POST_ENDPOINTS);
	
		const {data:POSTS,isLoading, refetch,isRefetching}=useQuery({
			queryKey: ["posts"],
            queryFn: async () => {
               try {
				const res=await fetch(POST_ENDPOINTS,{
					method: "GET",
                    credentials:"include",
                    headers: {
						"Content-Type": "application/json",
                        "Accept": "application/json"
                    
					}
				})
                const data=await res.json()
				if (!res.ok) {
                    throw new Error(data.error||"something went wrong");
                }
                return data
			   } catch (error) {
				throw error
			   }
            }
		})
		useEffect(() => {
		  refetch()
		}, [feedType,refetch])
		

	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && POSTS?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && POSTS && (
				<div>
					{POSTS.map((post) => (
						<Post key={post._id} post={post}  />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;