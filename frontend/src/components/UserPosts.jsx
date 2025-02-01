
import React, { useState } from "react";
import {useQuery} from "@tanstack/react-query";
import Post from "./Post";
import {useSelector} from "react-redux";
import { axiosInstance } from "../lib/axios";


const UserAllPost = ()=>{
    const user = useSelector(state => {
        console.log(state);  // Log the entire Redux store state
        return state.authorizedUser.user;
      });
      console.log(user);  // Log the `authorizedUser` value
      

    const { data : posts} = useQuery({
        queryKey : ["userPosts"] ,
        queryFn : async()=>{
            const res = await axiosInstance.get("/posts/user-posts");
            // console.log(res.data);
            return res.data.reverse() ;
        }
    })

    return(
        <>
        <div className="container">
            <div className="h2">Your Posts</div>
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
