import React, { useEffect, useState } from 'react';
import Heading from '../Common/Heading/Heading';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Upload.scss";
import { useHistory } from "react-router-dom";
import ScaleLoader from "react-spinners/ScaleLoader";

const UploadVideo = () => {
    const [titl, setTitl] = useState("")
    const [desc, setDesc] = useState("")
    const [video, setVideo] = useState("")
    const [videoUrl, setVideoUrl] = useState("")
    const [loadingImg, setLoadingImg] = useState(false)
    const history = useHistory();
    const postVideo = async () => {
        const title = titl;
        const description = desc;
        const url = videoUrl;
        const res = await fetch("/uploadVideo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                description,
                url
            }),
        });
        const data = await res.json();

        if (res.status === 422 || !data) {
            toast.dark("Plz fill the fields");
        } else {
            toast.dark("Uploaded successfully");
        }
        history.push("/uploadVideo");
    };
    const handleVideo = (e) => {
        setVideo(e.target.files[0]);
        console.log(e.target.files[0]);
    }
    useEffect(() => {
        (video !== "") &&
            uploadVideo();
    }, [video])
    const uploadVideo = () => {
        setLoadingImg(true);
        const data = new FormData();
        data.append("file", video);
        data.append("upload_preset", "merndev");
        data.append("cloud_name", "modimanju");
        fetch("https://api.cloudinary.com/v1_1/modimanju/video/upload", {
            method: "post",
            body: data,
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.secure_url);
                setVideoUrl(data.secure_url);
                setLoadingImg(false)
            })
            .catch((err) => {
                console.log(err);
            });

        console.log("videoUrl:", videoUrl);
    }
    // const authenticate = async () => {
    //     try {
    //         const res = await fetch("/myDoubts", {
    //             method: "GET",
    //             headers: {
    //                 Accept: "application/json",
    //                 "Content-Type": "application/json",
    //             },
    //             credentials: "include",
    //         });
    //         const data = await res.json();
    //         console.log(data);
    //         if (!res.status === 200) {
    //             const error = new Error(res.error);
    //             throw error;
    //         }
    //     } catch (err) {
    //         console.log(err);
    //         history.push("/");
    //     }
    // };
    // useEffect(() => {
    //     authenticate();
    // }, [])
    return (
        <>
            <Heading heading="Upload Video" />
            <div className="uploadvideo-sec">
                <div className="uploadvideo-con">
                    <div className="textarea">
                        <textarea className="title" name="title" placeholder="Title..." onChange={(e) => setTitl(e.target.value)} required></textarea>
                        <textarea className="description" name="description" placeholder="Description..." onChange={(e) => setDesc(e.target.value)} required></textarea>
                    </div>
                    <div className="video">
                        <input type="file" name="video" id="video" accept="video/*" onChange={handleVideo} />
                        {loadingImg ? <div className="loader">
                            <ScaleLoader color={"#2b343b"} loading={loadingImg} />
                            Uploading...!
                        </div> : <>
                            <video src={videoUrl}></video>
                            <label htmlFor="video">
                                <i className="fas fa-cloud-upload-alt"></i>
                                <h2>Upload Video</h2>
                            </label>
                        </>
                        }
                    </div>
                </div>
                <div className="btn">
                    <button onClick={postVideo}>upload</button>
                </div>
            </div>

            <ToastContainer position="top-right" />
        </>
    )
}

export default UploadVideo
