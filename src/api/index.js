import axios from "axios";

export const API_BASE_URL = "http://localhost:3011/";

export const postVideo = (formData) => {
  return axios.post(API_BASE_URL + "video", formData);
};

export const getVideo = (videoId) => {
  return API_BASE_URL + "video/" + videoId
};

export const deleteVideo = (videoId) => {
    axios.delete(API_BASE_URL + "video/" + videoId) // must be test
};

export const editVideo = (videoId, videoDuration, chunk) => {
    return axios.post(API_BASE_URL + "edit", {fileName: videoId, duration: videoDuration, chunk})
};