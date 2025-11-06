export const handleFormChange = (e, setFormData) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: Number.parseFloat(value) || 0,
  }));
};

export const resetFormData = (initialFormData, setFormData) => {
  setFormData(initialFormData);
};
