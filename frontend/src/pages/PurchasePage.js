import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Navbar2 from '../components/Navbar2.js';

const PurchasePage = () => {
    const [formData, setFormData] = useState({
        vendorName: '',
        vendorEmail: '',
        vendorMobile: '',
        paymentMethod: '',
        itemName: '',
        purchaseQuantity: '',
        amount: '',
        dateOfPurchase: ''
    });

    const [userData, setUserData] = useState({
        userId: '',
        userEmail: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [submitMessage, setSubmitMessage] = useState('');

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const userEmail = localStorage.getItem('userEmail');
        if (userId && userEmail) {
            setUserData({ userId, userEmail });
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.vendorName) errors.vendorName = 'Vendor Name is required';
        if (!formData.vendorEmail) errors.vendorEmail = 'Vendor Email is required';
        if (!formData.vendorMobile || !/^\d{10}$/.test(formData.vendorMobile)) {
            errors.vendorMobile = 'Vendor Mobile is required and must be a 10-digit number';
        }
        if (!formData.paymentMethod) errors.paymentMethod = 'Payment Method is required';
        if (!formData.itemName) errors.itemName = 'Item Name is required';
        if (!formData.purchaseQuantity || isNaN(formData.purchaseQuantity) || formData.purchaseQuantity <= 0) {
            errors.purchaseQuantity = 'Quantity is required and must be a positive number';
        }
        if (!formData.amount || isNaN(formData.amount) || formData.amount <= 0) {
            errors.amount = 'Amount is required and must be a positive number';
        }
        if (!formData.dateOfPurchase) errors.dateOfPurchase = 'Date of Purchase is required';
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
        } else {
            try {
                const submissionData = {
                    ...formData,
                    userId: userData.userId,
                };

                const response = await axios.post('http://localhost:5000/api/purchases', submissionData);
                console.log('Response from server:', response.data);
                setSubmitMessage('Form submitted successfully!');
                
                setFormData({
                    vendorName: '',
                    vendorEmail: '',
                    vendorMobile: '',
                    paymentMethod: '',
                    itemName: '',
                    purchaseQuantity: '',
                    amount: '',
                    dateOfPurchase: ''
                });
                setFormErrors({});
            } catch (error) {
                console.error('Error submitting form:', error);
                setSubmitMessage('An error occurred while submitting the form. Check console for details.');
            }
        }
    };

    return (
        <PageLayout>
            <Navbar2 />
            <ContentWrapper>
                <PurchaseContainer>
                    <Header>Purchase Details</Header>
                    <PurchaseForm onSubmit={handleSubmit}>
                        <FormRow>
                            <FormGroup>
                                <Label>Vendor Name</Label>
                                <Input 
                                    type="text" 
                                    name="vendorName" 
                                    value={formData.vendorName} 
                                    onChange={handleChange} 
                                    required 
                                />
                                {formErrors.vendorName && <ErrorMessage>{formErrors.vendorName}</ErrorMessage>}
                            </FormGroup>
                            <FormGroup>
                                <Label>Vendor Email</Label>
                                <Input 
                                    type="email" 
                                    name="vendorEmail" 
                                    value={formData.vendorEmail} 
                                    onChange={handleChange} 
                                    required 
                                />
                                {formErrors.vendorEmail && <ErrorMessage>{formErrors.vendorEmail}</ErrorMessage>}
                            </FormGroup>
                        </FormRow>

                        <FormRow>
                            <FormGroup>
                                <Label>Vendor Mobile No.</Label>
                                <Input 
                                    type="tel" 
                                    name="vendorMobile" 
                                    value={formData.vendorMobile} 
                                    onChange={handleChange} 
                                    pattern="[0-9]{10}" 
                                    required 
                                />
                                {formErrors.vendorMobile && <ErrorMessage>{formErrors.vendorMobile}</ErrorMessage>}
                            </FormGroup>
                            <FormGroup>
                                <Label>Payment Method</Label>
                                <Select 
                                    name="paymentMethod" 
                                    value={formData.paymentMethod} 
                                    onChange={handleChange} 
                                    required
                                >
                                    <option value="" disabled>Select Payment Method</option>
                                    <option value="cash">Cash</option>
                                    <option value="online">Online</option>
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
                                    name="purchaseQuantity" 
                                    value={formData.purchaseQuantity} 
                                    onChange={handleChange} 
                                    required 
                                />
                                {formErrors.purchaseQuantity && <ErrorMessage>{formErrors.purchaseQuantity}</ErrorMessage>}
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
                                <Label>Date of Purchase</Label>
                                <Input 
                                    type="date" 
                                    name="dateOfPurchase" 
                                    value={formData.dateOfPurchase} 
                                    onChange={handleChange} 
                                    required 
                                />
                                {formErrors.dateOfPurchase && <ErrorMessage>{formErrors.dateOfPurchase}</ErrorMessage>}
                            </FormGroup>
                        </FormRow>

                        <SubmitButton type="submit">Submit Purchase</SubmitButton>
                        {submitMessage && <SubmitMessage>{submitMessage}</SubmitMessage>}
                    </PurchaseForm>
                </PurchaseContainer>
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

const PurchaseContainer = styled.div`
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

const PurchaseForm = styled.form`
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
`;

const SubmitMessage = styled.div`
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #2ecc71;
  color: white;
  border-radius: 4px;
  text-align: center;
`;

export default PurchasePage;