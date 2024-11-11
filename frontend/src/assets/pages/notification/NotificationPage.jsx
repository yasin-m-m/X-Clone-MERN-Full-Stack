import { Link } from "react-router-dom";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { baseUrl } from "../../../constant/url";

const NotificationPage = () => {

	const queryClient= useQueryClient()
	
	const {data:notifications, isLoading}=useQuery({
		queryKey: ["notification"],
        queryFn: async () => {
            try {
				// Fetch notifications from the API
            // Replace this with your actual API endpoint
            const res = await fetch(`${baseUrl}/api/notification`,{
				method: "GET",
                credentials: "include",
                headers: {
					    "Content-Type": "application/json",
                        "Accept": "application/json"
                    
				}
			});
            if (!res.ok) {
                throw new Error("Failed to fetch notifications");
            }
            const data = await res.json();
			return data;
			} catch (error) {
				console.error("Error fetching notifications:", error.message);
				
			}
        },
        onError: (error) => {
            console.error("Error fetching notifications:", error.message);
        },
        // Fetch the data once every 5 minutes
        refetchInterval: 5 * 60 * 1000,
	})

	const {mutate:deleteNotification}=useMutation({
		mutationFn: async () => {
            try {
                // Delete a notification from the API
            // Replace this with your actual API endpoint
            const res = await fetch(`${baseUrl}/api/notification`,{
                method: "DELETE",
                credentials: "include",
                headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    
                }
            });
            if (!res.ok) {
                throw new Error("Failed to delete notification");
            }
            const data = await res.json();
			queryClient.invalidateQueries({ queryKey: ["notification"] })
            return data;
            } catch (error) {
                console.error("Error deleting notification:", error.message);
            }
        },
		onSuccess:()=>{
			toast.success("Successfully deleted notification")
			
		},
        onError: (error) => {
            console.error("Error deleting notification:", error.message);
        },
	})
	const deleteNotifications = () => {
		deleteNotification()
	};

	return (
		<>
			<div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
				<div className='flex justify-between items-center p-4 border-b border-gray-700'>
					<p className='font-bold'>Notifications</p>
					<div className='dropdown '>
						<div tabIndex={0} role='button' className='m-1'>
							<IoSettingsOutline className='w-4' />
						</div>
						<ul
							tabIndex={0}
							className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
						>
							<li>
								<a onClick={deleteNotifications}>Delete all notifications</a>
							</li>
						</ul>
					</div>
				</div>
				{isLoading && (
					<div className='flex justify-center h-full items-center'>
						<LoadingSpinner size='lg' />
					</div>
				)}
				{notifications?.length === 0 && <div className='text-center p-4 font-bold'>No notifications 🤔</div>}
				{notifications?.map((notification) => (
					<div className='border-b border-gray-700' key={notification._id}>
						<div className='flex gap-2 p-4'>
							{notification.type === "follow" && <FaUser className='w-7 h-7 text-primary' />}
							{notification.type === "like" && <FaHeart className='w-7 h-7 text-red-500' />}
							<Link to={`/profile/${notification.from.username}`}>
								<div className='avatar'>
									<div className='w-8 rounded-full'>
										<img src={notification.from.profileImg || "/avatar-placeholder.png"} />
									</div>
								</div>
								<div className='flex gap-1'>
									<span className='font-bold'>@{notification.from.username}</span>{" "}
									{notification.type === "follow" ? "followed you" : "liked your post"}
								</div>
							</Link>
						</div>
					</div>
				))}
			</div>
		</>
	);
};
export default NotificationPage;