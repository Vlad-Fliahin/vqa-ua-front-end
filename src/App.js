import React, { useState, useRef } from 'react';
import Header from './Header';
import Footer from './Footer';
import './styles.css';
import placeholderImage from './images/image-placeholder.jpeg';


const App = () => {
  const [imageSelected, setImageSelected] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [question, setQuestion] = useState('');
  const [prediction, setPrediction] = useState('');
  const fileInputRef = useRef();

  // image upload handler
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    // if the image was correctly uploaded
    reader.onload = (e) => {
      setImageSelected(e.target.result);
      setUploadedImage(file);
    };

    // if the image was selected
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // button click handler
  const handleImageClick = () => {
    fileInputRef.current.click();
  }

  // predict request handler
  async function handlePredict() {
    // API endpoint for prediction
    const API_ENDPOINT = `https://localhost:8000/predict`;

    // clear prediction
    setPrediction('...')

    // create a FormData object
    const formData = new FormData();

    formData.append('image', uploadedImage);
    formData.append('question', question);

    console.log(uploadedImage)
    console.log(question)

    // send a POST request to the API
    await fetch(API_ENDPOINT, {
      method: "POST",
      body: formData,
    })
      .then(response => response.json())
      .then(responseData => {
        // set the model prediction
        setPrediction(responseData['prediction'])
      })
      .catch(error => {
        console.error(error)
      })
  };

  return (
    <div className="app">
      <Header />
      <div className="content">
        <div className='center'>
          <div className="image-placeholder">
            <input
              className='image-uploader'
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
            {imageSelected ?
              (
                <img
                  htmlFor="fileInput"
                  className="static-image"
                  src={imageSelected}
                  onClick={handleImageClick}
                  alt="оберіть зображення"
                  style={{ cursor: 'pointer' }}
                />
              ) : (
                <img
                  htmlFor="fileInput"
                  className="static-image"
                  src={placeholderImage}
                  onClick={handleImageClick}
                  alt="зображення обрано"
                  style={{ cursor: 'pointer' }}
                />
              )}
          </div>
          <textarea
            className="question-input"
            placeholder="Запитання до картинки"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button
            className="predict-button"
            onClick={handlePredict}
          >
            Отримати передбачення
          </button>
          <textarea
            className="response-output"
            placeholder="Результат передбачення"
            value={prediction}
            readOnly
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
