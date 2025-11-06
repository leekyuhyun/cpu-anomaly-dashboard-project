"use client";

import { useState } from "react";
import Header from "../components/Header/Header";
import InputForm from "../components/InputForm/InputForm";
import PredictButton from "../components/PredictButton/PredictButton";
import LoadingIndicator from "../components/LoadingIndicator/LoadingIndicator";
import ResultBox from "../components/ResultBox/ResultBox";
import { initialFormData } from "../utils/constants";
import { makeAPIPrediction } from "../utils/api";
import { handleFormChange } from "../utils/formHandlers";
import "./Main.css";

function Main() {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const onFormChange = (e) => {
    handleFormChange(e, setFormData);
  };

  const onPredictClick = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    const response = await makeAPIPrediction(formData);
    if (response.success) {
      setResult(response.data);
    } else {
      setError(response.error);
    }

    setLoading(false);
  };

  return (
    <div className="main">
      <div className="main-container">
        <Header />
        <InputForm
          formData={formData}
          onFormChange={onFormChange}
          onTimeChange={onFormChange}
          onAmountChange={onFormChange}
        />
        <PredictButton onClick={onPredictClick} loading={loading} />
        {loading && <LoadingIndicator />}
        <ResultBox result={result} error={error} />
      </div>
    </div>
  );
}

export default Main;
