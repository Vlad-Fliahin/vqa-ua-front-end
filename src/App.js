import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import './styles.css';
import placeholderImage from './images/image-placeholder.jpeg';


const App = () => {
  const [imageSelected, setImageSelected] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [question, setQuestion] = useState('');
  const [prediction, setPrediction] = useState('');

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

  // predict request handler
  async function handlePredict() {
    // API endpoint for prediction
    const API_ENDPOINT = `https://localhost:8000/predict`;

    // create a FormData object
    const formData = new FormData();

    formData.append('image', uploadedImage);
    formData.append('question', question);

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
            {imageSelected ? (
              <img className="selected-image" src={imageSelected} alt="обрано" />
            ) : (
              <div className="placeholder-content">
                <img
                  className="static-image"
                  src={placeholderImage}
                  alt="оберіть"
                />
              </div>
            )}
          </div>
          <div>
          <label>fdsfsdfs</label>
          <input
            className='image-uploader'
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            lang='eng'
          />
          <button>fdsfsd</button>
          </div>
          <textarea
            className="question-input"
            placeholder="Enter your question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button className="predict-button" onClick={handlePredict}>
            Predict
          </button>
          <textarea
            className="response-output"
            placeholder="Response from API"
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
