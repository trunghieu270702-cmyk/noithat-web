"use client";
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  CreditCard,
  FileText,
  DollarSign,
  TrendingUp,
  Clock,
  AlertTriangle,
  Box
} from 'lucide-react';
import { Card } from '@/admin-components/ui/card';
import { useAuthStore } from '@/admin-features/auth/stores/useAuthStore';

export default function CustomerDetailPage() {
  const { id } = useParams();
  const token = useAuthStore((state) => state.token);
  const [customer, setCustomer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerDetail = async () => {
      try {

        // MOCK DATA
        const response: any = {
          data: {
            success: true,
            data: [],
            total: 0,
            summary: { totalPawnAmount: 0, totalEstimatedInterest: 0, activeReceipts: 0 }
          }
        };
        // Populate with dummy data based on file
        if ('D:/Hieudeptraivl/noithat-main/admin-web/src/pages/dashboard/customers/detail.tsx'.includes('customers')) {
          response.data.data = [{ id: 1, fullName: 'Nguyễn Văn A', phoneNumber: '0123456789', address: 'Hà Nội', idCard: '001002003004', totalPawnAmount: 10000000, activeReceipts: 1 }];
          response.data.total = 1;
        } else if ('D:/Hieudeptraivl/noithat-main/admin-web/src/pages/dashboard/customers/detail.tsx'.includes('tracking')) {
          response.data.data = [{ id: 1, receiptId: 'HD001', customer: { fullName: 'Nguyễn Văn A', phoneNumber: '0123456789' }, itemName: 'iPhone 13', itemValue: 15000000, pawnAmount: 10000000, interestRate: 2000, pawnDate: new Date().toISOString(), dueDate: new Date().toISOString(), status: 'ACTIVE', virtualStatus: 'ACTIVE', estimatedInterest: 500000 }];
          response.data.total = 1;
        } else if ('D:/Hieudeptraivl/noithat-main/admin-web/src/pages/dashboard/customers/detail.tsx'.includes('pawn-receipts') && !'D:/Hieudeptraivl/noithat-main/admin-web/src/pages/dashboard/customers/detail.tsx'.includes('detail')) {
          response.data.data = [{ id: 1, receiptId: 'HD001', customer: { fullName: 'Nguyễn Văn A', phoneNumber: '0123456789' }, itemName: 'iPhone 13', itemValue: 15000000, pawnAmount: 10000000, interestRate: 2000, pawnDate: new Date().toISOString(), dueDate: new Date().toISOString(), status: 'ACTIVE' }];
          response.data.total = 1;
        } else if ('D:/Hieudeptraivl/noithat-main/admin-web/src/pages/dashboard/customers/detail.tsx'.includes('transactions')) {
          response.data.data = [{ id: 1, receiptId: 'HD001', transactionType: 'INTEREST_PAYMENT', amount: 500000, createdAt: new Date().toISOString(), receipt: { receiptId: 'HD001', customer: { fullName: 'Nguyễn Văn A' } } }];
          response.data.total = 1;
        } else if ('D:/Hieudeptraivl/noithat-main/admin-web/src/pages/dashboard/customers/detail.tsx'.includes('dashboard/page')) {
          // Dashboard stats
          response.data = {
            success: true,
            data: {
              totalFund: 500000000, totalPawned: 200000000, totalInterest: 15000000, activeReceipts: 20,
              recentTransactions: [], recentReceipts: [],
              fundHistory: [{ date: '2023-01', balance: 500000000 }]
            }
          };
        } else if ('D:/Hieudeptraivl/noithat-main/admin-web/src/pages/dashboard/customers/detail.tsx'.includes('settings')) {
          response.data.data = { storeName: 'Cầm Đồ ABC', storeAddress: 'Hà Nội', defaultInterestRate: 3000, totalFund: 1000000000, defaultPawnDuration: 30, warningDays: 3 };
        }

        setCustomer(response.data);
      } catch (error) {
        console.error('Failed to fetch customer details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchCustomerDetail();
  }, [id, token]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#5865f2] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500">
        <User className="w-16 h-16 mb-4 text-gray-300" />
        <h2 className="text-xl font-medium">Không tìm thấy khách hàng</h2>
        <Link href="/admin/customers" className="mt-4 text-[#5865f2] hover:underline">Quay lại danh sách</Link>
      </div>
    );
  }

  // Calculate statistics
  const totalReceipts = customer.receipts?.length || 0;
  let activeReceipts = 0;
  let totalLoan = 0;
  let totalInterestPaid = 0;
  const allTransactions: any[] = [];

  customer.receipts?.forEach((r: any) => {
    if (r.status === 'ACTIVE' || r.status === 'OVERDUE') activeReceipts++;
    totalLoan += Number(r.pawnAmount);

    r.transactions?.forEach((tx: any) => {
      totalInterestPaid += Math.max(0, Number(tx.interestAmount || 0) - Number(tx.discountAmount || 0));
      allTransactions.push({
        ...tx,
        receiptId: r.receiptId,
        itemName: r.itemName
      });
    });
  });

  // Sort transactions by date descending
  allTransactions.sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto pb-10 custom-scrollbar">
      {/* Header */}
      <div className="flex items-center gap-4 shrink-0">
        <Link
          href="/admin/customers"
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-medium tracking-tight text-gray-900 dark:text-white">Chi tiết Khách hàng</h2>
          <p className="text-sm text-gray-500 mt-0.5">Hồ sơ và lịch sử giao dịch toàn diện.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile & Stats */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 rounded-[4px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14151a] shadow-none relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-[#5865f2]"></div>
            <div className="flex flex-col items-center text-center mt-2 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 border-2 border-white dark:border-[#14151a] shadow-sm flex items-center justify-center text-blue-700 dark:text-blue-400 font-medium text-3xl mb-4">
                {customer.fullName.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">{customer.fullName}</h3>
              <p className="text-sm font-medium text-[#5865f2] mt-1">Khách hàng thành viên</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[4px] bg-gray-50 dark:bg-[#1a1b23] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Số điện thoại</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{customer.phoneNumber}</p>
                </div>
              </div>

              {customer.citizenId && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[4px] bg-gray-50 dark:bg-[#1a1b23] flex items-center justify-center shrink-0">
                    <CreditCard className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">CCCD / CMND</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{customer.citizenId}</p>
                  </div>
                </div>
              )}

              {customer.address && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[4px] bg-gray-50 dark:bg-[#1a1b23] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Địa chỉ</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{customer.address}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 rounded-[4px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14151a] shadow-none">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Tổng quan tài chính</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-[4px] bg-gray-50 dark:bg-[#1a1b23]">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  Tổng hợp đồng
                </div>
                <span className="font-medium text-gray-900 dark:text-white">{totalReceipts}</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-[4px] bg-gray-50 dark:bg-[#1a1b23]">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  Đang vay (Active)
                </div>
                <span className="font-medium text-red-600 dark:text-red-400">{activeReceipts}</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-[4px] bg-gray-50 dark:bg-[#1a1b23]">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                  <DollarSign className="w-4 h-4 text-blue-500" />
                  Tổng tiền đã cấp
                </div>
                <span className="font-medium text-blue-600 dark:text-blue-400">{formatCurrency(totalLoan)}</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-[4px] bg-gray-50 dark:bg-[#1a1b23]">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  Lợi nhuận (Lãi thu)
                </div>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(totalInterestPaid)}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Timeline */}
        <div className="lg:col-span-2">
          <Card className="p-6 rounded-[4px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14151a] shadow-none h-full min-h-[600px] flex flex-col">
            <h4 className="font-medium text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#5865f2]" />
              Dòng thời gian giao dịch
            </h4>

            {allTransactions.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                <Box className="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" />
                <p>Khách hàng chưa có bất kỳ giao dịch nào.</p>
              </div>
            ) : (
              <div className="relative pl-6 border-l-2 border-gray-100 dark:border-gray-800 space-y-8 flex-1 overflow-y-auto pr-4 custom-scrollbar">
                {allTransactions.map((tx: any) => {
                  const isNew = tx.transactionType === 'NEW';
                  const isRedeem = tx.transactionType === 'REDEEM';
                  const isLiquidate = tx.transactionType === 'LIQUIDATE';
                  const isExtend = tx.transactionType === 'EXTEND';

                  return (
                    <div key={tx.id} className="relative">
                      {/* Timeline Dot */}
                      <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-4 border-white dark:border-[#14151a] ${isNew ? 'bg-blue-500' :
                          isRedeem ? 'bg-emerald-500' :
                            isLiquidate ? 'bg-gray-500' :
                              isExtend ? 'bg-violet-500' : 'bg-orange-500'
                        }`}></div>

                      <div className="bg-gray-50 dark:bg-[#1a1b23] p-4 rounded-[4px] border border-gray-100 dark:border-gray-800/60 shadow-sm hover:shadow-sm transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                          <div>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-xs font-medium mb-2 ${isNew ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                isRedeem ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                  isLiquidate ? 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300' :
                                    isExtend ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' :
                                      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                              }`}>
                              {isNew ? 'Cầm Mới' : isRedeem ? 'Chuộc Đồ' : isExtend ? 'Gia Hạn' : isLiquidate ? 'Thanh Lý' : 'Giao Dịch Khác'}
                            </span>
                            <h5 className="font-medium text-gray-900 dark:text-white">
                              Hợp đồng: <Link href={`/admin/pawn-receipts/${tx.receiptId}`} className="text-[#5865f2] hover:underline">{tx.receiptId}</Link>
                            </h5>
                            <p className="text-sm text-gray-500 mt-1">{tx.itemName}</p>
                          </div>
                          <div className="text-right">
                            <p className={`font-medium text-lg ${isNew ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
                              }`}>
                              {isNew ? '-' : '+'}{formatCurrency(tx.transactionAmount)}
                            </p>
                            <p className="text-xs text-gray-400 mt-1 flex items-center justify-end gap-1">
                              <Clock className="w-3 h-3" />
                              {format(new Date(tx.transactionDate), 'dd/MM/yyyy HH:mm', { locale: vi })}
                            </p>
                          </div>
                        </div>
                        {tx.notes && (
                          <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-[#14151a] p-2.5 rounded-[4px] border border-gray-100 dark:border-gray-800">
                            <span className="font-medium">Ghi chú:</span> {tx.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
