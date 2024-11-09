import { useState } from "react";
import { Link } from "react-router-dom";

import XSvg from "../../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "../../../../constant/url";
import toast from "react-hot-toast";
import { FaUser } from "react-icons/fa";
import LoadingSpinner from "../../../../components/common/LoadingSpinner";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
	const queryClient=useQueryClient()
const [error, setError]=useState(null)
	const {mutate:login, isPending} = useMutation({
		mutationFn: async ({username,password})=>{
			try {
				const res= await fetch(`${baseUrl}/api/auth/logIn`,{
					method: "POST",
					credentials:"include",
					headers: {
						"Content-Type": "application/json",
						"Accept": "application/json"
					},
					
					body: JSON.stringify({ username, password }),
				})
				console.log(res);
				
				const data = res.json();
				console.log(data);
				
	
				if (res.ok == false) {
					if (res.status == 401) {	
						setError("user not found or invalid credentials");
					}else if (res.status == 499) {	
						setError("all fields are required");
					} else {
						setError("something went wrong");
					}
					
				}
				if (res.ok == true){

                    toast.success("Logged in successfully");
                    	
				}
				
				return data;
			} catch (error) {
				return toast.error("Failed to Login"+error.message);
				
			}
		},
		onSuccess: () => {
            queryClient.invalidateQueries({
				queryKey:["authUser"]
			})
        },
        retry: false
	})
	const handleSubmit = (e) => {
		e.preventDefault();
		login(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const isError = false;

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<XSvg className='lg:w-2/3 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
					<XSvg className='w-24 lg:hidden fill-white' />
					<h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1>
					<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<FaUser />
							<input
								type='text'
								className='grow '
								placeholder='Username'
								name='username'
								onChange={handleInputChange}
								value={formData.username}
								required
							/>
						</label>

					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					<button className='btn rounded-full btn-primary text-white'>{isPending ? <LoadingSpinner/>: "Login"}</button>
					{error && <p className='text-red-500'>{error}</p>}
				</form>
				<div className='flex flex-col gap-2 mt-4'>
					<p className='text-white text-lg'>{"Don't"} have an account?</p>
					<Link to='/signup'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign up</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;