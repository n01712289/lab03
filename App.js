import React, { useState } from "react";
import axios from "axios";

function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [serverImages, setServerImages] = useState([]);
  const [dogImage, setDogImage] = useState("");
  const [dogUploadStatus, setDogUploadStatus] = useState("");

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const uploadImages = async () => {
    const formData = new FormData();
    for (let file of selectedFiles) {
      formData.append("images", file);
    }

    try {
      await axios.post("http://localhost:8000/upload-multiple", formData);
      alert("Images uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload images.");
    }
  };

  const fetchRandomImages = async () => {
    try {
      const res = await axios.get("http://localhost:8000/random-images");
      setServerImages(res.data);
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  };

  const getDogImage = async () => {
    try {
      const res = await axios.get("https://dog.ceo/api/breeds/image/random");
      setDogImage(res.data.message);
      setDogUploadStatus("");
    } catch (err) {
      console.error("Error fetching dog image:", err);
    }
  };

  const uploadDogImage = async () => {
    try {
      await axios.post("http://localhost:8000/save-dog", {
        url: dogImage,
      });
      setDogUploadStatus("Dog image uploaded to server!");
    } catch (err) {
      console.error("Dog image upload failed:", err);
      setDogUploadStatus("Upload failed.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Upload Multiple Images</h2>
      <input type="file" multiple onChange={handleFileChange} />
      <br />
      <button onClick={uploadImages} style={{ marginTop: "10px" }}>
        Upload to Server
      </button>

      <hr />

      <h2>Display Random Server Images</h2>
      <button onClick={fetchRandomImages}>Get Random Images</button>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
        {serverImages.map((imgUrl, index) => (
          <img key={index} src={imgUrl} alt="server" width="150" />
        ))}
      </div>

      <hr />

      <h2>Get Random Dog Image</h2>
      <button onClick={getDogImage}>Fetch Dog Image</button>
      <div>
        {dogImage && (
          <div style={{ marginTop: "10px" }}>
            <img src={dogImage} alt="dog" width="200" />
            <br />
            <button onClick={uploadDogImage} style={{ marginTop: "10px" }}>
              Upload Dog Image to Server
            </button>
            <p>{dogUploadStatus}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
