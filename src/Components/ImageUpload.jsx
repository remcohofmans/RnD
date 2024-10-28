// ImageUploadModal.js
import React, { useState } from 'react';

const ImageUpload = ({ showModal, setShowModal }) => {
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => prevImages.concat(files));
  };

  const handleUpload = () => {
    // Handle the upload logic here
    console.log('Images to upload:', images);
    // Clear images after upload
    setImages([]);
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Upload Foto's</h2>
        <input
          type="file"
          multiple
          onChange={handleImageChange}
          className="mb-4"
          accept="image/*"
        />
        <div className="flex justify-end">
          <button
            onClick={handleUpload}
            className="bg-rose-500 text-white py-2 px-4 rounded-lg hover:bg-rose-600"
          >
            Upload
          </button>
          <button
            onClick={() => setShowModal(false)}
            className="ml-2 text-gray-600 hover:text-gray-900"
          >
            Annuleer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
