import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Navbar2 from "../components/Navbar2.js";

const Dashboard = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [totalPurchase, setTotalPurchase] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [itemDetails, setItemDetails] = useState({ totalPurchase: 0, totalSales: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/dashboard');
        const { totalItems, totalPurchase, totalSales, items } = response.data;
        setTotalItems(totalItems);
        setTotalPurchase(totalPurchase);
        setTotalSales(totalSales);
        setItems(items.map(item => item.name));
      } catch (error) {
        console.error('Error fetching dashboard summary:', error);
        setError('Error fetching dashboard summary');
      }
    };

    fetchDashboardSummary();
  }, []);

  const handleItemChange = async (itemName) => {
    if (itemName) {
      setSelectedItem(itemName);
      try {
        const response = await axios.get(`http://localhost:5000/api/dashboard/${itemName}`);
        const { totalPurchase, totalSales } = response.data;
        setItemDetails({ totalPurchase, totalSales });
        setError('');
      } catch (error) {
        console.error('Error fetching item summary:', error);
        setError('Error fetching item summary');
      }
    } else {
      setItemDetails({ totalPurchase: 0, totalSales: 0 });
    }
  };

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    handleItemChange(selectedValue);
  };

  return (
    <PageLayout>
      <Navbar2 />
      <DashboardContainer>
        <Header>Dashboard</Header>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <SummaryContainer>
          <SummaryBox>
            <SummaryTitle>Total Items</SummaryTitle>
            <SummaryValue>{totalItems}</SummaryValue>
          </SummaryBox>
          <SummaryBox>
            <SummaryTitle>Total Purchases</SummaryTitle>
            <SummaryValue>{totalPurchase}</SummaryValue>
          </SummaryBox>
          <SummaryBox>
            <SummaryTitle>Total Sales</SummaryTitle>
            <SummaryValue>{totalSales}</SummaryValue>
          </SummaryBox>
        </SummaryContainer>

        <SelectContainer>
          <SelectLabel htmlFor="itemSelect">Select Item:</SelectLabel>
          <Select
            id="itemSelect"
            value={selectedItem}
            onChange={handleSelectChange}
          >
            <option value="">-- Select an Item --</option>
            {items.map(item => (
              <option key={item} value={item}>{item}</option>
            ))}
          </Select>
        </SelectContainer>

        {selectedItem && (
          <ItemDetailsContainer>
            <ItemDetailBox>
              <DetailTitle>Total Purchase Quantity</DetailTitle>
              <DetailValue>{itemDetails.totalPurchase}</DetailValue>
            </ItemDetailBox>
            <ItemDetailBox>
              <DetailTitle>Total Sales Quantity</DetailTitle>
              <DetailValue>{itemDetails.totalSales}</DetailValue>
            </ItemDetailBox>
          </ItemDetailsContainer>
        )}
      </DashboardContainer>
    </PageLayout>
  );
};

// Styled components
const PageLayout = styled.div`
  display: flex;
  min-height: 100vh;
`;

const DashboardContainer = styled.div`
  flex-grow: 1;
  padding: 2rem;
  margin-left: 250px;
  font-family: 'Arial', sans-serif;
  background-color: #f5f7fa;
  transition: margin-left 0.3s ease;

  @media screen and (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
  }
`;

const Header = styled.h1`
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2.5rem;

  @media screen and (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
`;

const ErrorMessage = styled.div`
  background-color: #ff6b6b;
  color: white;
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1rem;
`;

const SummaryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const SummaryBox = styled.div`
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  @media screen and (max-width: 768px) {
    padding: 1rem;
  }
`;

const SummaryTitle = styled.h2`
  color: #34495e;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const SummaryValue = styled.p`
  color: #3498db;
  font-size: 2rem;
  font-weight: bold;

  @media screen and (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const SelectContainer = styled.div`
  margin-bottom: 2rem;
`;

const SelectLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: bold;
`;

const Select = styled.select`
  width: 100%;
  max-width: 300px;
  padding: 0.75rem;
  border: 1px solid #bdc3c7;
  border-radius: 5px;
  font-size: 1rem;
  color: #2c3e50;
  background-color: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3498db;
  }

  @media screen and (max-width: 768px) {
    max-width: 100%;
  }
`;

const ItemDetailsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const ItemDetailBox = styled(SummaryBox)`
  background-color: #ecf0f1;
`;

const DetailTitle = styled(SummaryTitle)`
  color: #2c3e50;
`;

const DetailValue = styled(SummaryValue)`
  color: #27ae60;
`;

export default Dashboard;