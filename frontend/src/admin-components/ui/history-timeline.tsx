"use client";
import { format } from 'date-fns';
import { ArrowRight, Clock, Box } from 'lucide-react';

const FIELD_LABELS: Record<string, string> = {
  itemDescription: 'Tên tài sản',
  itemCategory: 'Loại tài sản',
  quantity: 'Số lượng',
  itemValue: 'Định giá',
  pawnAmount: 'Tiền cầm',
  interestRate: 'Lãi suất',
  pawnDate: 'Ngày cầm',
  dueDate: 'Ngày đến hạn',
  notes: 'Ghi chú',
  customerFullName: 'Tên khách hàng',
  customerPhone: 'Số điện thoại',
  customerCitizenId: 'CCCD',
  customerAddress: 'Địa chỉ',
};

const formatValue = (key: string, value: any) => {
  if (value === null || value === undefined || value === '') return 'Trống';
  if (key === 'pawnDate' || key === 'dueDate') return format(new Date(value), 'dd/MM/yyyy');
  if (key === 'itemValue' || key === 'pawnAmount') return new Intl.NumberFormat('vi-VN').format(Number(value)) + ' đ';
  if (key === 'interestRate') return value + '%';
  return String(value);
};

export function HistoryTimeline({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 flex flex-col items-center">
        <Box className="w-10 h-10 text-gray-200 dark:text-gray-800 mb-3" />
        <p>Chưa có lịch sử chỉnh sửa nào.</p>
      </div>
    );
  }

  return (
    <div className="relative border-l-2 border-dashed border-gray-200 dark:border-gray-800 ml-3 py-2 pb-6">
      {data.map((item) => {
        let diffs: { key: string; oldVal: any; newVal: any }[] = [];
        try {
          const changes = JSON.parse(item.changes || '{}');
          if (changes && changes.old && changes.new) {
            const keys = new Set([...Object.keys(changes.old), ...Object.keys(changes.new)]);
            keys.forEach(key => {
              let newKey = key;
              if (key === 'itemName') newKey = 'itemDescription';
              let oldVal = changes.old[newKey];
              let newVal = changes.new[key];
              if (oldVal instanceof Date) oldVal = oldVal.toISOString();
              if (newVal instanceof Date) newVal = newVal.toISOString();
              if ((newKey === 'pawnDate' || newKey === 'dueDate') && newVal) newVal = new Date(newVal).toISOString();
              if (String(oldVal) !== String(newVal) && newVal !== undefined) {
                diffs.push({ key: newKey, oldVal, newVal });
              }
            });
          }
        } catch { }

        if (diffs.length === 0) return null;

        return (
          <div key={item.id} className="mb-8 relative pl-8 last:mb-0 pr-2">
            {/* Elegant Timeline Dot */}
            <div className="absolute w-6 h-6 bg-white dark:bg-[#14151a] rounded-full -left-[13px] top-0 border-2 border-gray-200 dark:border-gray-800 flex items-center justify-center">
              <div className="w-2 h-2 bg-[#5865f2] rounded-full"></div>
            </div>

            {/* Time Header */}
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {format(new Date(item.createdAt), 'HH:mm, dd/MM/yyyy')}
              </span>
            </div>

            {/* Changes List */}
            <div className="space-y-3">
              {diffs.map((diff, idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {FIELD_LABELS[diff.key] || diff.key}
                  </span>
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-[#1a1b23]/50 p-2.5 rounded-[4px] border border-gray-100 dark:border-gray-800/80">
                    <div className="flex-1 bg-white dark:bg-[#14151a] px-3 py-1.5 rounded-[4px] border border-gray-100 dark:border-gray-800 shadow-sm text-sm text-gray-500 line-through truncate" title={formatValue(diff.key, diff.oldVal)}>
                      {formatValue(diff.key, diff.oldVal)}
                    </div>

                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-500" />
                    </div>

                    <div className="flex-1 bg-emerald-50 dark:bg-emerald-900/10 px-3 py-1.5 rounded-[4px] border border-emerald-100 dark:border-emerald-900/30 text-sm font-medium text-emerald-700 dark:text-emerald-400 truncate" title={formatValue(diff.key, diff.newVal)}>
                      {formatValue(diff.key, diff.newVal)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
