import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { ArrowLeft } from "lucide-react";
import { jwtDecode } from 'jwt-decode';
import authService from "../../../services/auth";
import { isAdmin as checkIsAdmin } from "../../../utils/adminCheck";



const API_URL = "http://localhost:8000/api/";

const ElectionResultPage = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_URL}elections/${electionId}/results/`)
      .then((response) => {
        setResults(response.data);
      })
      .catch((error) => {
        console.error("Error fetching election results:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  
    const userData = authService.getUserFromCookie();
    if (userData && userData.email) {
      setIsAdminUser(checkIsAdmin(userData.email));  // ✅ Update state
    }
  }, [electionId]); // ✅ Dependency array ensures this runs when electionId changes
  


  const getUserFromToken = () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access_token=")) // ✅ Uses correct key
        ?.split("=")[1];
        console.log("Cookies:", document.cookie,token);

      if (!token) return null;
  
      return jwtDecode(token); // ✅ Correct function usage
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };
  
  
 
  
  const generatePDF = () => {
    if (!results || !results.positions || results.positions.length === 0) {
      console.error("No election results found!");
      return;
    }
  
    const doc = new jsPDF();
    let yPos = 20;
  
    // Add header with styling
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(`${results.title}`, 14, 25);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Election Results Report', 14, 35);
  
    // Add timestamp
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    yPos = 60;
  
    results.positions.forEach((position, index) => {
      if (!position || !position.candidates) return;
  
      // Add position title with styling
      doc.setTextColor(59, 130, 246);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(position.title, 14, yPos);
      yPos += 10;
  
      // Generate candidates table
      autoTable(doc, {
        head: [['Candidate', 'Roll No', 'Degree', 'Department', 'Votes', 'Status']],
        body: position.candidates.map((candidate, idx) => [
          candidate.name || 'N/A',
          candidate.roll_no || 'Unknown Roll No',
          candidate.degree || 'BTech',
          candidate.Department || 'CSE',
          candidate.votes_count || 0,
          idx === 0 ? 'WINNER' : 'Runner-up'
        ]),
        startY: yPos,
        theme: 'grid',
        headStyles: {
          fillColor: [59, 130, 246],
          fontSize: 12,
          fontStyle: 'bold',
          halign: 'center'
        },
        bodyStyles: {
          fontSize: 11,
          halign: 'center'
        },
        columnStyles: {
          0: { cellWidth: 45, halign: 'left' },
          1: { cellWidth: 30 },
          2: { cellWidth: 25 },
          3: { cellWidth: 30 },
          4: { cellWidth: 20 },
          5: { 
            cellWidth: 30,
            fontStyle: 'bold',
            fillColor: (rowIndex) => rowIndex.row.index === 0 ? [46, 204, 113] : null,
            textColor: (rowIndex) => rowIndex.row.index === 0 ? [255, 255, 255] : null
          }
        },
        alternateRowStyles: {
          fillColor: [245, 247, 250]
        },
        margin: { top: 20 }
      });
  
      yPos = doc.lastAutoTable.finalY + 20;
  
      // Add vote summary
      const totalVotes = position.candidates.reduce((sum, c) => sum + (c.votes_count || 0), 0);
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.text(`Total Votes Cast: ${totalVotes}`, 14, yPos);
      yPos += 10;
  
      // Add page break if needed
      if (yPos >= doc.internal.pageSize.height - 50 && index < results.positions.length - 1) {
        doc.addPage();
        yPos = 20;
      }
    });
  
    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        `Generated on ${date} | Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }
  
    doc.save(`${results.title}-Election-Results.pdf`);
  };
  const generateExcel = () => {
    const workbook = XLSX.utils.book_new();

    results.positions.forEach((position) => {
      const worksheet = XLSX.utils.json_to_sheet(
        position.candidates.map((candidate, index) => ({
          'Position': position.title,
          'Candidate Name': candidate.name || 'N/A',
          'Roll Number': candidate.roll_no || 'Unknown Roll No',
          'Degree': candidate.degree || 'BTech',
          'Department': candidate.Department || 'CSE',
          'Votes Received': candidate.votes_count,
          'Status': index === 0 ? 'Winner' : 'Runner-up',
          'Created At': new Date(candidate.created_at).toLocaleDateString(),
          'Approved': candidate.approved ? 'Yes' : 'No'
        }))
      );

      // Set column widths
      const colWidths = [
        { wch: 25 }, // Position
        { wch: 30 }, // Name
        { wch: 15 }, // Roll No
        { wch: 10 }, // Degree
        { wch: 20 }, // Department
        { wch: 15 }, // Votes
        { wch: 10 }, // Status
        { wch: 15 }, // Created At
        { wch: 10 }  // Approved
      ];
      worksheet['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, position.title.slice(0, 31));
    });

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    saveAs(dataBlob, `${results.title}-results.xlsx`);
  };

  if (loading) {
    return <div className="text-center mt-10">Loading results...</div>;
  }

  if (!results) {
    return <div className="text-center mt-10">No results available.</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg">
      <button 
          onClick={() => navigate('/admin/elections')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Elections
        </button>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{results.title} - Results</h1>
          {isAdminUser && (
          <div className="flex gap-4">
            <button
              onClick={generatePDF}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
              </svg>
              Download PDF
            </button>
            <button
              onClick={generateExcel}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
              </svg>
              Download Excel
            </button>
          </div>
          )}
        </div>
       


        {results.positions.map((position) => (
          <div key={position.id} className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">{position.title}</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3 border">Candidate</th>
                    <th className="p-3 border">Votes</th>
                    <th className="p-3 border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {position.candidates.map((candidate, index) => (
                    <tr key={candidate.id} className="hover:bg-gray-100">
                      <td className="p-3 border">{candidate.name}</td>
                      <td className="p-3 border">{candidate.votes_count}</td>
                      <td className="p-3 border font-semibold">
                        {index === 0 ? "🏆 Winner" : "Runner-up"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Chart for visualization */}
            <div className="mt-4">
              <Bar
                data={{
                  labels: position.candidates.map((c) => c.name),
                  datasets: [
                    {
                      label: "Votes",
                      data: position.candidates.map((c) => c.votes_count),
                      backgroundColor: ["#3b82f6", "#ef4444", "#f59e0b", "#10b981"],
                    },
                  ],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ElectionResultPage;
