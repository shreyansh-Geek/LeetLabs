import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../lib/auth';
import { apiFetch } from '../lib/utils';
import Navbar from '../components/landing/Navbar';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Loader2, Download, ArrowUpDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';

function PaymentHistoryPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 10;

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await apiFetch(`/payments/user/${user.id}`);
        setPayments(response.data || []);
      } catch (err) {
        const errorMessage = err.data?.message || 'Failed to fetch payment history';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [user]);

  const downloadInvoice = (payment) => {
    try {
      const doc = new jsPDF();

      // LeetLabs Branding
      doc.setFontSize(20);
      doc.setTextColor('#f5b210'); // blue-600
      doc.text('LeetLabs Invoice', 20, 20);

      doc.setFontSize(12);
      doc.setFont('satoshi');
      doc.setTextColor('#374151'); // gray-700
      doc.text(`Invoice ID: ${payment.id}`, 20, 30);
      doc.text(`Date: ${format(new Date(), 'MMM dd, yyyy')}`, 20, 40);

      // User Info
      doc.text('Billed To:', 20, 50);
      doc.text(user.name || 'User', 20, 60);
      doc.text(user.email, 20, 70);

      // Payment Details Table
      autoTable(doc, {
        startY: 80,
        head: [['Description', 'Plan', 'Amount', 'Status', 'Payment Method', 'Created At', 'Captured At']],
        body: [[
          'Subscription Payment',
          payment.planName,
          `INR ${(payment.amount / 100).toFixed(2)}`,
          payment.status.charAt(0).toUpperCase() + payment.status.slice(1),
          payment.paymentMethod ? payment.paymentMethod.charAt(0).toUpperCase() + payment.paymentMethod.slice(1) : 'N/A',
          format(new Date(payment.createdAt), 'MMM dd, yyyy HH:mm'),
          payment.capturedAt ? format(new Date(payment.capturedAt), 'MMM dd, yyyy HH:mm') : 'N/A',
        ]],
        theme: 'striped',
        headStyles: { fillColor: '#f5b210', textColor: '#ffffff' },
        styles: { textColor: '#374151', fontSize: 10 },
      });

      // Additional Details
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.text(`Payment ID: ${payment.razorpayPaymentId || 'N/A'}`, 20, finalY);
      doc.text(`Order ID: ${payment.razorpayOrderId}`, 20, finalY + 10);
      doc.text(`Card: ${payment.cardLast4 && payment.cardNetwork ? `${payment.cardNetwork} ending in ${payment.cardLast4}` : 'N/A'}`, 20, finalY + 20);

      // Footer
      doc.setFontSize(10);
      doc.text('Thank you for choosing LeetLabs!', 20, finalY + 40);
      doc.text('Contact: shreyansh@leetlabs.in | www.leetlabs.in', 20, finalY + 50);

      doc.save(`LeetLabs_Invoice_${payment.id}.pdf`);
    } catch (err) {
      console.error('Error generating invoice:', err);
      toast.error('Failed to generate invoice. Please try again.');
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const filteredPayments = useMemo(() => {
    return payments
      .filter((payment) => {
        const matchesSearch = (
          payment.planName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.razorpayPaymentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.razorpayOrderId.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        const direction = sortConfig.direction === 'asc' ? 1 : -1;

        // Handle null or undefined values
        if (aValue == null) aValue = sortConfig.key === 'capturedAt' ? new Date(0) : '';
        if (bValue == null) bValue = sortConfig.key === 'capturedAt' ? new Date(0) : '';

        if (sortConfig.key === 'amount') {
          return (aValue - bValue) * direction;
        }
        if (sortConfig.key === 'createdAt' || sortConfig.key === 'capturedAt') {
          return (new Date(aValue) - new Date(bValue)) * direction;
        }
        return aValue.toString().localeCompare(bValue.toString()) * direction;
      });
  }, [payments, searchQuery, statusFilter, sortConfig]);

  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * paymentsPerPage,
    currentPage * paymentsPerPage
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-700 text-lg font-medium">Please log in to view your payment history.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-16 satoshi">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-6 border-b border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900">Payment History</h2>
            <p className="mt-2 text-sm text-gray-500">
              View and manage your payment records with ease
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by plan, payment ID, or order ID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-gray-300 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 border-gray-300">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="captured">Captured</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {isLoading && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
          )}
          {error && (
            <div className="px-6 py-4 text-red-500 text-center">
              <p className="text-lg font-medium">{error}</p>
            </div>
          )}
          {!isLoading && !error && filteredPayments.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500 text-lg">No payments found.</p>
            </div>
          )}
          {!isLoading && !error && filteredPayments.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-700">
                        <button className="flex items-center" onClick={() => handleSort('planName')}>
                          Plan <ArrowUpDown className="ml-1 h-4 w-4" />
                        </button>
                      </TableHead>
                      <TableHead className="text-gray-700">
                        <button className="flex items-center" onClick={() => handleSort('amount')}>
                          Amount <ArrowUpDown className="ml-1 h-4 w-4" />
                        </button>
                      </TableHead>
                      <TableHead className="text-gray-700">
                        <button className="flex items-center" onClick={() => handleSort('status')}>
                          Status <ArrowUpDown className="ml-1 h-4 w-4" />
                        </button>
                      </TableHead>
                      <TableHead className="text-gray-700">Payment Method</TableHead>
                      <TableHead className="text-gray-700">Card Details</TableHead>
                      <TableHead className="text-gray-700">Payment ID</TableHead>
                      <TableHead className="text-gray-700">Order ID</TableHead>
                      <TableHead className="text-gray-700">
                        <button className="flex items-center" onClick={() => handleSort('createdAt')}>
                          Created At <ArrowUpDown className="ml-1 h-4 w-4" />
                        </button>
                      </TableHead>
                      <TableHead className="text-gray-700">
                        <button className="flex items-center" onClick={() => handleSort('capturedAt')}>
                          Captured At <ArrowUpDown className="ml-1 h-4 w-4" />
                        </button>
                      </TableHead>
                      <TableHead className="text-gray-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedPayments.map((payment) => (
                      <TableRow key={payment.id} className="hover:bg-gray-50">
                        <TableCell className="text-gray-900 font-medium">{payment.planName}</TableCell>
                        <TableCell className="text-gray-900">
                          INR {(payment.amount / 100).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                              payment.status === 'captured'
                                ? 'bg-green-100 text-green-700'
                                : payment.status === 'failed'
                                ? 'bg-red-100 text-red-700'
                                : payment.status === 'refunded'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-900">
                          {payment.paymentMethod
                            ? payment.paymentMethod.charAt(0).toUpperCase() + payment.paymentMethod.slice(1)
                            : 'N/A'}
                        </TableCell>
                        <TableCell className="text-gray-900">
                          {payment.cardLast4 && payment.cardNetwork
                            ? `${payment.cardNetwork} ending in ${payment.cardLast4}`
                            : 'N/A'}
                        </TableCell>
                        <TableCell
                          className="text-gray-900 truncate max-w-[150px]"
                          title={payment.razorpayPaymentId}
                        >
                          {payment.razorpayPaymentId || 'N/A'}
                        </TableCell>
                        <TableCell
                          className="text-gray-900 truncate max-w-[150px]"
                          title={payment.razorpayOrderId}
                        >
                          {payment.razorpayOrderId}
                        </TableCell>
                        <TableCell className="text-gray-900">
                          {format(new Date(payment.createdAt), 'MMM dd, yyyy HH:mm')}
                        </TableCell>
                        <TableCell className="text-gray-900">
                          {payment.capturedAt
                            ? format(new Date(payment.capturedAt), 'MMM dd, yyyy HH:mm')
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadInvoice(payment)}
                            className="text-yellow-500 hover:text-yellow-600 hover:bg-yellow-100"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Invoice
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {totalPages > 1 && (
                <div className="px-6 py-4 flex justify-between items-center border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * paymentsPerPage + 1} to{' '}
                    {Math.min(currentPage * paymentsPerPage, filteredPayments.length)} of{' '}
                    {filteredPayments.length} payments
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentHistoryPage;