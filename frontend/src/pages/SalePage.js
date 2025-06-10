import React, { useState } from "react";
import axios from "axios";
import styled from 'styled-components';
import Navbar2 from "../components/Navbar2.js";

const SalePage = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerMobile: "",
    paymentMethod: "Cash",
    itemName: "",
    quantity: "",
    amount: "",
    dateOfSale: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [submissionError, setSubmissionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "amount" ? formatAmount(value) : value,
    });
  };

  const formatAmount = (value) => {
    const num = value.replace(/[^\d]/g, "");
    if (!num) return "";
    if (num.length < 4) return num;

    const lastThree = num.slice(-3);
    const otherParts = num.slice(0, -3);

    return (
      otherParts.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree
    );
  };

  const validateForm = () => {
    const errors = {};
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const mobilePattern = /^[0-9]{10}$/;

    if (!formData.customerName) errors.customerName = "Customer Name is required";
    if (!formData.customerEmail || !emailPattern.test(formData.customerEmail)) {
      errors.customerEmail = "Valid Customer Email is required";
    }
    if (!formData.customerMobile || !mobilePattern.test(formData.customerMobile)) {
      errors.customerMobile = "Valid 10-digit Mobile is required";
    }
    if (!formData.paymentMethod) errors.paymentMethod = "Payment Method is required";
    if (!formData.itemName) errors.itemName = "Item Name is required";
    if (!formData.quantity || formData.quantity <= 0) {
      errors.quantity = "Valid Quantity is required";
    }
    if (!formData.amount) errors.amount = "Amount is required";
    if (!formData.dateOfSale) errors.dateOfSale = "Date of Sale is required";
    const today = new Date().toISOString().split('T')[0];
    if (formData.dateOfSale && formData.dateOfSale > today) {
      errors.dateOfSale = "Date of Sale cannot be in the future";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setSubmissionError("");
    } else {
      setIsSubmitting(true);
      try {
        const response = await axios.post("http://localhost:5000/api/sales", formData);
        console.log("Sale Data Submitted:", response.data);
        setFormData({
          customerName: "",
          customerEmail: "",
          customerMobile: "",
          paymentMethod: "Cash",
          itemName: "",
          quantity: "",
          amount: "",
          dateOfSale: "",
        });
        setFormErrors({});
        setSubmissionError("");
      } catch (error) {
        console.error("Error submitting sale data:", error);
        if (error.response) {
          setSubmissionError(error.response.data.message || "Error submitting sale data. Please try again.");
        } else {
          setSubmissionError("Error submitting sale data. Please try again.");
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <PageLayout>
      <Navbar2 />
      <ContentWrapper>
        <SaleContainer>
          <Header>Sale Details</Header>
          {submissionError && <ErrorMessage>{submissionError}</ErrorMessage>}
          <SaleForm onSubmit={handleSubmit}>
            <FormRow>
              <FormGroup>
                <Label>Customer Name</Label>
                <Input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                />
                {formErrors.customerName && <ErrorMessage>{formErrors.customerName}</ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Label>Customer Email</Label>
                <Input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  required
                />
                {formErrors.customerEmail && <ErrorMessage>{formErrors.customerEmail}</ErrorMessage>}
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label>Customer Mobile</Label>
                <Input
                  type="text"
                  name="customerMobile"
                  value={formData.customerMobile}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  required
                />
                {formErrors.customerMobile && <ErrorMessage>{formErrors.customerMobile}</ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Label>Payment Method</Label>
                <Select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  required
                >
                  <option value="Cash">Cash</option>
                  <option value="Online">Online</option>
                </Select>
                {formErrors.paymentMethod && <ErrorMessage>{formErrors.paymentMethod}</ErrorMessage>}
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label>Item Name</Label>
                <Input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  required
                />
                {formErrors.itemName && <ErrorMessage>{formErrors.itemName}</ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
                {formErrors.quantity && <ErrorMessage>{formErrors.quantity}</ErrorMessage>}
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label>Amount</Label>
                <Input
                  type="text"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
                {formErrors.amount && <ErrorMessage>{formErrors.amount}</ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Label>Date of Sale</Label>
                <Input
                  type="date"
                  name="dateOfSale"
                  value={formData.dateOfSale}
                  onChange={handleChange}
                  required
                />
                {formErrors.dateOfSale && <ErrorMessage>{formErrors.dateOfSale}</ErrorMessage>}
              </FormGroup>
            </FormRow>

            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Sale"}
            </SubmitButton>
          </SaleForm>
        </SaleContainer>
      </ContentWrapper>
    </PageLayout>
  );
};

const PageLayout = styled.div`
  display: flex;
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  flex-grow: 1;
  padding: 2rem;
  margin-left: 250px; // Adjust based on your Navbar2 width
  background-color: #f5f7fa;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
  }
`;

const SaleContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const Header = styled.h2`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
`;

const SaleForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  color: #34495e;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const ErrorMessage = styled.span`
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const SubmitButton = styled.button`
  background-color: #3498db;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2980b9;
  }

  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

export default SalePage;