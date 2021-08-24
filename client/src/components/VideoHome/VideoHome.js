import React, { useState, useEffect } from 'react'
import Heading from '../Common/Heading/Heading';
import "./VideoHome.scss";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScaleLoader from "react-spinners/ScaleLoader";

const VideoHome = () => {
    const [videos, setVideos] = useState([])
    const [video, setVideo] = useState({})
    const [user, setUser] = useState({})
    const [commId, setCommId] = useState("")
    const [replyId, setReplyId] = useState("")
    const [rID, setRID] = useState("")
    const [active, setActive] = useState()
    const [loading, setLoading] = useState(true)
    const [userComment, setUserComment] = useState("")
    const [userReply, setUserReply] = useState("")
    const [updateComment, setUpdateComment] = useState("")
    const [comments, setComments] = useState([])
    const [replys, setReplys] = useState([])
    const history = useHistory();
    const fetchVideos = async () => {
        setActive(true)
        try {
            const res = await fetch("/videos", {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            const data = await res.json();
            console.log(data);
            setVideos(data);
            setLoading(false);
            if (!res.status === 200) {
                const error = new Error(res.error);
                throw error;
            }
        } catch (err) {
            console.log(err);
        }
    };
    const fetchVideo = async (ID) => {
        setActive(false)
        setLoading(true)
        try {
            const res = await fetch(`/video/${ID}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            const data = await res.json();
            setVideo(data);
            setLoading(false)
            if (!res.status === 200) {
                const error = new Error(res.error);
                throw error;
            }
        } catch (err) {
            console.log(err);
            history.push("/videoHome");
        }
    }
    const fetchComments = async (id) => {
        try {
            const res = await fetch(`/comments/${id}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            const data = await res.json();
            setComments(data);
            console.log(data);
            if (!res.status === 200) {
                const error = new Error(res.error);
                throw error;
            }
        } catch (err) {
            console.log(err);
            history.push("/videoHome");
        }
    }
    const fetchReplys = async (id) => {
        try {
            const res = await fetch(`/replys/${id}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            const data = await res.json();
            setReplys(data);
            setReplyId(id);
            console.log(data);
            if (!res.status === 200) {
                const error = new Error(res.error);
                throw error;
            }
        } catch (err) {
            console.log(err);
            history.push("/videoHome");
        }
    }
    const postComment = async () => {
        const videoID = video._id;
        const comment = userComment;
        const res = await fetch("/uploadComment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                comment,
                videoID
            }),
        });
        const data = await res.json();
        if (!data) {
            console.log("Comment not sent");
        } else {
            console.log("Comment sent");
            fetchComments(video._id);
        }
    };
    const postReply = async (id) => {
        const commentID = id;
        const reply = userReply;
        const res = await fetch("/uploadReply", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                reply,
                commentID
            }),
        });
        const data = await res.json();
        if (!data) {
            console.log("Reply not sent");
        } else {
            console.log("Reply sent");
            fetchReplys(id);
        }
    };
    const editComment = async (id) => {
        const comment = updateComment;
        const res = await fetch(`/editComment/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                comment,
            }),
        });
        const data = await res.json();
        if (!data) {
            console.log("Comment not sent");
        } else {
            console.log("Comment sent");
            fetchComments(video._id);
            setCommId("")
        }
    };
    const delComment = async (id) => {
        const res = await fetch(`/deleteComment/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const data = await res.json();
        if (!data) {
            console.log("Comment not sent");
        } else {
            console.log("Comment sent");
            fetchComments(video._id);
        }
    };
    const delReply = async (id) => {
        const res = await fetch(`/deleteReply/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const data = await res.json();
        if (!data) {
            console.log("Reply not sent");
        } else {
            console.log("Reply sent");
            fetchReplys(rID);
        }
    };
    const authenticate = async () => {
        try {
            const res = await fetch("/authenticate", {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            const data = await res.json();
            console.log(data);
            setUser(data)
            if (!res.status === 200) {
                const error = new Error(res.error);
                throw error;
            }
        } catch (err) {
            console.log(err);
            history.push("/");
        }
    };
    useEffect(() => {
        authenticate();
    }, [])
    useEffect(() => {
        fetchVideos();
    }, [])
    return (
        <>
            <Heading heading="Videos" />
            {loading && <div className="loaderx"><ScaleLoader
                color={"#2b343b"} loading={loading} size={0} /></div>}
            {(active === true) ?
                <div className="video-home">
                    {videos.map((item, index) => {
                        return (
                            <div key={index} className="video-con" onClick={() => { fetchVideo(item._id); fetchComments(item._id); }}>
                                <div className="title">
                                    <h3>{item.title}</h3>
                                </div>
                                <div className="video">
                                    <video src={item.url}></video>
                                </div>
                            </div>
                        )
                    })
                    }
                </div> :
                <div className="onevideo">
                    <div className="btn">
                        <button onClick={() => setActive(true)}>Back</button>
                    </div>
                    <div className="video">
                        <video src={video.url} controls></video>
                    </div>
                    <div className="comment-sec">
                        <input type="text"
                            name="comment"
                            placeholder="Type your comment here..."
                            onChange={(e) => setUserComment(e.target.value)}
                            required
                        />
                        <button onClick={postComment}>Comment</button>
                    </div>
                    <div className="comments-sec">
                        {comments.slice(0).reverse().map((item, index) => {
                            return (
                                <div className="comments" key={index}>
                                    {(commId === item._id) ?
                                        <>
                                            <input type="text"
                                                name="comment"
                                                placeholder="Comment"
                                                defaultValue={item.comment}
                                                onChange={(e) => setUpdateComment(e.target.value)}
                                                required
                                            />
                                            <div className="btn">
                                                <button onClick={() => editComment(item._id)}>Update</button>
                                                <button onClick={() => setCommId("")}>Cancel</button>
                                            </div>
                                        </>
                                        :
                                        <div className="comment-details">
                                            <div className="user">
                                                <div className="user-logo">
                                                    <h3>{[...item.name].reverse().splice(-1)}</h3>
                                                    <div className="user-comment">
                                                        <h4>{item.name}</h4>
                                                        <h5>{item.comment}</h5>
                                                    </div>
                                                </div>
                                                {
                                                    user.email === item.email &&
                                                    <div className="btn">
                                                        <button onClick={() => setCommId(item._id)}>Edit</button>
                                                        <button onClick={() => delComment(item._id)}>Delete</button>
                                                    </div>
                                                }
                                            </div>
                                            <div className="reply-con">
                                                <div className="reply-sec">
                                                    <input type="text"
                                                        name="reply"
                                                        placeholder="Reply"
                                                        onChange={(e) => setUserReply(e.target.value)}
                                                        required
                                                    />
                                                    <div className="btnR">
                                                        <button onClick={() => postReply(item._id)}>Send</button>
                                                        <button onClick={() => { fetchReplys(item._id); setRID(item._id) }}>Replies</button>
                                                    </div>
                                                </div>
                                                {(replyId === item._id) &&
                                                    replys.slice(0).reverse().map((item, index) => {
                                                        return (
                                                            <div className="userR">
                                                                <div className="user-logo">
                                                                    <h4>{[...item.name].reverse().splice(-1)}</h4>
                                                                    <div className="user-comment">
                                                                        <h5>{item.name}</h5>
                                                                        <h6>{item.reply}</h6>
                                                                    </div>
                                                                </div>

                                                                <div className="btn">
                                                                    {/* <button onClick={() => setCommId(item._id)}>Edit</button> */}
                                                                    <button onClick={() => delReply(item._id)}>Delete</button>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    }
                                </div>
                            )
                        })}
                    </div>
                </div>
            }
        </>
    )
}

export default VideoHome
