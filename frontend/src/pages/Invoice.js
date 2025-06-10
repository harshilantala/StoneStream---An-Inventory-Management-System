import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import styled from "styled-components";
import Navbar2 from "../components/Navbar2";
import { FaFileDownload } from "react-icons/fa";

const Invoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const invoicesPerPage = 5; // Set how many invoices to show per page

  useEffect(() => {
    const storedInvoices = JSON.parse(localStorage.getItem("invoices")) || [];
    const sortedInvoices = storedInvoices.reverse();
    setInvoices(sortedInvoices);
  }, []);

  const downloadPDF = (invoice) => {
    if (invoice.pdfBase64) {
      const link = document.createElement("a");
      link.href = invoice.pdfBase64;
      link.download = invoice.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("File was not available on the site");
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Invoice Details", 10, 10);
    const pdfData = doc.output("datauristring"); // Generate a Base64 URL

    const newInvoice = {
      filename: `Invoice_${Date.now()}.pdf`,
      pdfBase64: pdfData, // Store Base64 data
      date: new Date().toISOString(),
    };

    const updatedInvoices = [newInvoice, ...invoices];
    localStorage.setItem("invoices", JSON.stringify(updatedInvoices));
    setInvoices(updatedInvoices);
  };

  // Calculate the current invoices to display based on pagination
  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = invoices.slice(indexOfFirstInvoice, indexOfLastInvoice);

  // Change page
  const nextPage = () => {
    if (currentPage < Math.ceil(invoices.length / invoicesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <PageLayout>
      <Navbar2 />
      <ContentWrapper>
        <Header>Previously Downloaded Invoices</Header>
        {invoices.length === 0 ? (
          <NoInvoicesMessage>No invoices available</NoInvoicesMessage>
        ) : (
          <>
            <InvoiceList>
              {currentInvoices.map((invoice, index) => (
                <InvoiceItem key={index}>
                  <InvoiceFileName>{invoice.filename}</InvoiceFileName>
                  <DownloadButton onClick={() => downloadPDF(invoice)}>
                    <FaFileDownload />
                    Download
                  </DownloadButton>
                </InvoiceItem>
              ))}
            </InvoiceList>

            <PaginationWrapper>
              <PaginationButton onClick={prevPage} disabled={currentPage === 1}>
                Previous
              </PaginationButton>
              <PageNumber>Page {currentPage}</PageNumber>
              <PaginationButton
                onClick={nextPage}
                disabled={currentPage === Math.ceil(invoices.length / invoicesPerPage)}
              >
                Next
              </PaginationButton>
            </PaginationWrapper>
          </>
        )}
      </ContentWrapper>
    </PageLayout>
  );
};

// Styled components
const PageLayout = styled.div`
  display: flex;
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  flex-grow: 1;
  padding: 2rem;
  margin-left: 250px;
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
  text-align: center;
`;

const NoInvoicesMessage = styled.p`
  text-align: center;
  color: #7f8c8d;
  font-style: italic;
  font-size: 1.2rem;
  margin-top: 2rem;
`;

const InvoiceList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const InvoiceItem = styled.li`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-3px);
  }
`;

const InvoiceFileName = styled.span`
  font-size: 1.1rem;
  color: #2c3e50;
`;

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

  svg {
    font-size: 1.2rem;
  }
`;

const GenerateButton = styled.button`
  display: block;
  margin: 1rem auto 2rem auto;
  padding: 0.75rem 1.5rem;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    background-color: #2ecc71;
  }
`;

// Pagination styles
const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
`;

const PaginationButton = styled.button`
  background-color: #3498db;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #2980b9;
  }
  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

const PageNumber = styled.span`
  font-size: 1.2rem;
  color: #2c3e50;
`;

export default Invoice;
