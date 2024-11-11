import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "../constant/url";
import toast from "react-hot-toast";

const useFollow=()=>{
    const queryClient=useQueryClient()
    const {mutate:follow, isPending}=useMutation({
        mutationFn: async (userId) => {
            try {
                const res=await fetch(`${baseUrl}/api/user/follow/${userId}`,{
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                })
                const data=await res.json()
                if(data.error){
                    throw new Error(data.error)
                }
                if(!res.ok){
                    throw new Error(data.error || "Something went wrong")
                }
                Promise.all([
                    queryClient.invalidateQueries({ queryKey: ['suggestedUsers'] }),  
                    queryClient.invalidateQueries({ queryKey: ['authUser'] }) 
                ]);
                
                return data;
            } catch (error) {
                toast.error("Failed to follow")
            }
        },
        onError:(error)=>{
                toast.error(error.message)
        }
    })
    return {follow, isPending}
}

export default useFollow;