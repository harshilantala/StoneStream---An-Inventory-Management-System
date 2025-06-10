import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import styled from "styled-components";
import Navbar2 from "../components/Navbar2";

const OrderHistory = () => {
  const [historyType, setHistoryType] = useState("purchase");
  const [historyData, setHistoryData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(7);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntries, setSelectedEntries] = useState([]);

  // Fetch purchase or sales history based on the selected history type
  const fetchHistory = async () => {
    try {
      const url =
        historyType === "purchase"
          ? "http://localhost:5000/api/orders/purchase-history" // Purchase API endpoint
          : "http://localhost:5000/api/orders/sales-history"; // Sales API endpoint

      const response = await axios.get(url);

      console.log("Response Data:", response.data); // Debugging log to check data

      // Extract relevant data
      const dataToDisplay =
        historyType === "purchase"
          ? response.data.purchases.map((item) => ({
              _id: item._id,
              vendorName: item.vendorName,
              itemName: item.itemName,
              purchaseQuantity: item.purchaseQuantity,
              remainingQuantity: item.remainingQuantity, // Keep remainingQuantity for purchases
              amount: item.amount,
              date: new Date(item.dateOfPurchase), // Ensure date is in Date object format
            }))
          : response.data.sales.map((item) => ({
              _id: item._id,
              customerName: item.customerName,
              itemName: item.itemName,
              quantity: item.quantity,
              amount: item.amount,
              date: new Date(item.date), // Use the correct field for sales date
            })); // Only keep relevant fields for sales

      // Filter data based on the selected start date
      const filteredData = filterByDate(dataToDisplay);
      setHistoryData(filteredData);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  // Filter history data by the selected date
  const filterByDate = (data) => {
    if (!startDate) return data; // If no date is selected, return all data
    return data.filter((item) => {
      const itemDate = new Date(item.date); // Ensure item date is a Date object
      // Compare only the date part (ignoring time)
      return itemDate.toDateString() === startDate.toDateString();
    });
  };

  // Filter history data by the search query
  const filterBySearch = (data) => {
    if (!searchQuery) return data; // If no search query, return all data
    return data.filter((item) => {
      const nameToSearch =
        historyType === "purchase" ? item.vendorName : item.customerName;
      return (
        nameToSearch.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  };

  // Fetch history whenever history type or start date changes
  useEffect(() => {
    fetchHistory();
  }, [historyType, startDate]);

  // Pagination logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;

  // Apply search filter before slicing for pagination
  const filteredData = filterBySearch(historyData);
  const currentEntries = filteredData.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  // Handler for changing pages
  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle checkbox selection
  const handleSelectEntry = (entry) => {
    const isSelected = selectedEntries.find((item) => item._id === entry._id);
    if (isSelected) {
      // Remove from selected if already selected
      setSelectedEntries(
        selectedEntries.filter((item) => item._id !== entry._id)
      );
    } else {
      // Add to selected entries
      setSelectedEntries([...selectedEntries, entry]);
    }
  };

  // Generate PDF with selected entries
  // Enhanced PDF generation function
  const generatePDF = () => {
    const doc = new jsPDF();

    // Define page margins
    const marginLeft = 20;
    const marginTop = 20;
    const lineHeight = 10;

    // Dynamically fetch the current date for the 'Date Issued'
    const currentDate = new Date().toLocaleDateString();

    // Fetch the selected customer/vendor's details (assuming selectedEntries are the ones to be included in the PDF)
    const invoiceNumber = Math.floor(Math.random() * 100000); // Random Invoice Number
    const pdfFilename = `order-history-${invoiceNumber}.pdf`;

    // Create the PDF content as a Base64 string
    const pdfBase64 = doc.output("datauristring");

    // Store PDF metadata (including base64 data) in localStorage
    const storedInvoices = JSON.parse(localStorage.getItem("invoices")) || [];
    storedInvoices.push({
      filename: pdfFilename,
      pdfBase64: pdfBase64, // Store the base64 PDF content
    });
    localStorage.setItem("invoices", JSON.stringify(storedInvoices));
    
    const issuedTo =
      historyType === "purchase"
        ? selectedEntries[0]?.vendorName
        : selectedEntries[0]?.customerName;
    const issuedAddress =
      historyType === "purchase"
        ? selectedEntries[0]?.vendorAddress
        : "Address Unknown"; // Modify if address is available in data

    // Title: 'HM HOT FIX'
    doc.setFontSize(16);
    doc.setTextColor(255, 0, 0); // Red color for the title
    doc.text("HM HOT FIX", marginLeft, marginTop);

    // Section for invoice details
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0); // Reset to black text
    doc.text(`Date Issued: ${currentDate}`, marginLeft, marginTop + lineHeight);
    doc.text(
      `Invoice No: ${invoiceNumber}`,
      marginLeft,
      marginTop + 2 * lineHeight
    );
    doc.text(
      `Issued to: ${issuedTo}`,
      marginLeft + 100,
      marginTop + lineHeight
    );
    doc.text(`${issuedAddress}`, marginLeft + 100, marginTop + 2 * lineHeight);

    // Table to display dynamic items
    doc.autoTable({
      head: [["No", "Description", "QTY", "Price", "Subtotal"]],
      body: selectedEntries.map((item, index) => [
        index + 1,
        item.itemName,
        historyType === "purchase" ? item.purchaseQuantity : item.quantity,
        `₹ ${item.amount}`,
        `₹ ${(
          item.amount *
          (historyType === "purchase" ? item.purchaseQuantity : item.quantity)
        ).toFixed(2)}`,
      ]),
      margin: { top: marginTop + 4 * lineHeight },
      styles: { fontSize: 10, lineColor: [0, 0, 0], lineWidth: 0.5 },
    });

    // Calculate the grand total dynamically
    const grandTotal = selectedEntries
      .reduce(
        (total, item) =>
          total +
          item.amount *
            (historyType === "purchase"
              ? item.purchaseQuantity
              : item.quantity),
        0
      )
      .toFixed(2);

    doc.setFontSize(12);
    doc.text(
      `Grand Total: ₹ ${grandTotal}`,
      marginLeft,
      doc.autoTable.previous.finalY + lineHeight
    );

    // Footer with company information (static)
    doc.setFontSize(10);
    doc.text(
      "HM HOT FIX",
      marginLeft,
      doc.autoTable.previous.finalY + 2 * lineHeight
    );
    doc.text(
      "+91 99795 45031",
      marginLeft,
      doc.autoTable.previous.finalY + 3 * lineHeight
    );
    doc.text(
      "hmhotfix@gmail.com",
      marginLeft,
      doc.autoTable.previous.finalY + 4 * lineHeight
    );
    doc.text(
      "shop No - 4, 1-Keshav Park Soc. To Butbhavani Road, Sitanagar, Surat",
      marginLeft,
      doc.autoTable.previous.finalY + 5 * lineHeight
    );

    // Save the generated PDF dynamically
    doc.save(pdfFilename);
  };

  return (
    <PageWrapper>
      <Navbar2 />
      <ContentWrapper>
        <Header>Order History</Header>

        <FilterSection>
          <DateFilterWrapper>
            <label>Filter by Date: </label>
            <StyledDatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Select a date"
              isClearable
            />
          </DateFilterWrapper>

          <SearchWrapper>
            <label>Search: </label>
            <SearchInput
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by Customer/Item Name"
            />
          </SearchWrapper>
        </FilterSection>

        <ButtonGroup>
          <HistoryButton
            onClick={() => {
              setHistoryType("purchase");
              setCurrentPage(1);
            }}
            active={historyType === "purchase"}
          >
            Purchase History
          </HistoryButton>
          <HistoryButton
            onClick={() => {
              setHistoryType("sales");
              setCurrentPage(1);
            }}
            active={historyType === "sales"}
          >
            Sales History
          </HistoryButton>
        </ButtonGroup>

        <TableWrapper>
          {currentEntries.length === 0 ? (
            <NoDataMessage>No history available</NoDataMessage>
          ) : (
            <StyledTable>
              <thead>
                <tr>
                  <th>Select</th>
                  <th>{historyType === "purchase" ? "Vendor Name" : "Customer Name"}</th>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <Checkbox
                        type="checkbox"
                        onChange={() => handleSelectEntry(item)}
                        checked={selectedEntries.find((selected) => selected._id === item._id) || false}
                      />
                    </td>
                    <td>{historyType === "purchase" ? item.vendorName : item.customerName}</td>
                    <td>{item.itemName}</td>
                    <td>{historyType === "purchase" ? item.purchaseQuantity : item.quantity}</td>
                    <td>{item.amount}</td>
                    <td>{new Date(item.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          )}
        </TableWrapper>

        <ActionSection>
          <GeneratePDFButton
            onClick={generatePDF}
            disabled={selectedEntries.length === 0}
          >
            Generate PDF
          </GeneratePDFButton>

          <PaginationWrapper>
            <PaginationButton
              onClick={() => handlePageChange("prev")}
              disabled={currentPage === 1}
            >
              Prev
            </PaginationButton>
            <PageInfo>
              {currentPage} / {totalPages}
            </PageInfo>
            <PaginationButton
              onClick={() => handlePageChange("next")}
              disabled={currentPage === totalPages}
            >
              Next
            </PaginationButton>
          </PaginationWrapper>
        </ActionSection>
      </ContentWrapper>
    </PageWrapper>
  );
};

// Styled components
const PageWrapper = styled.div`
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

const Header = styled.h2`
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2rem;
`;

const FilterSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const DateFilterWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StyledDatePicker = styled(DatePicker)`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SearchInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 250px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const HistoryButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${(props) => (props.active ? "#3498db" : "#ecf0f1")};
  color: ${(props) => (props.active ? "#ffffff" : "#2c3e50")};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.active ? "#2980b9" : "#bdc3c7")};
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  margin-bottom: 2rem;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #ecf0f1;
  }

  th {
    background-color: #3498db;
    color: #ffffff;
    font-weight: bold;
  }

  tr:nth-child(even) {
    background-color: #f8f9fa;
  }

  tr:hover {
    background-color: #e9ecef;
  }
`;

const Checkbox = styled.input`
  cursor: pointer;
`;

const NoDataMessage = styled.p`
  text-align: center;
  color: #7f8c8d;
  font-style: italic;
`;

const ActionSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
`;

const GeneratePDFButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #27ae60;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2ecc71;
  }

  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
`;

const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: #ffffff;
  border: none;
  border-radius: 4px;
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

const PageInfo = styled.span`
  font-weight: bold;
  color: #2c3e50;
`;

export default OrderHistory;