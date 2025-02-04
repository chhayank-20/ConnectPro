
import React, { useState } from "react";
import {useQuery} from "@tanstack/react-query";
import Post from "./Post";
import {useSelector} from "react-redux";
import { axiosInstance } from "../lib/axios";


const UserAllPost = ({userData})=>{
    const user = useSelector(state => {
        console.log(state);  // Log the entire Redux store state
        return state.authorizedUser.user;
      });
      console.log(user);  // Log the `authorizedUser` value
      

    const { data : posts} = useQuery({
        queryKey : ["userPosts"] ,
        queryFn : async()=>{
            const userId = userData._id;
            // alert(userId);
            const res = await axiosInstance.post("/posts/user-posts" , {userId : userId});
            // console.log(res.data);
            return res.data.reverse() ;
        }
    })

    return(
        <>
        <div className="container">
            <div className="h2"> Posts</div>
        {/* <div className="container d-flex flex-wrap "> */}
            {posts?.map((post) => (
                // <div className="" style={{ maxHeight: '800px', objectFit: 'cover' }}>
				    <Post key={post._id} post={post} />
                // </div>
			))}
        {/* </div> */}
        </div>
        </>
    )
}

export default UserAllPost;
