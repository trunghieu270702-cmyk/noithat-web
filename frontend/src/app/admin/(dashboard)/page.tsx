"use client";
import React, { useState, useEffect } from 'react';
import { 
  Building2, ShieldCheck, Newspaper, Globe, EyeOff,
  CalendarDays, X, Activity, MessageSquare, Clock, TrendingUp, TrendingDown, MoreHorizontal, FileText, BarChart2, ChevronLeft, ChevronRight, CheckCircle2
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/admin-components/ui/popover';
import { Calendar } from '@/admin-components/ui/calendar';
import { vi } from 'date-fns/locale';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { DateRange } from 'react-day-picker';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import apiClient from '@/admin-lib/apiClient';

const PRESETS = [
  { label: 'Hôm nay', getValue: () => ({ from: new Date(), to: new Date() }) },
  { label: 'Hôm qua', getValue: () => ({ from: subDays(new Date(), 1), to: subDays(new Date(), 1) }) },
  { label: 'Tuần này', getValue: () => ({ from: startOfWeek(new Date(), { weekStartsOn: 1 }), to: endOfWeek(new Date(), { weekStartsOn: 1 }) }) },
  { label: 'Tháng này', getValue: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }) },
  { label: 'Năm nay', getValue: () => ({ from: startOfYear(new Date()), to: endOfYear(new Date()) }) },
  { label: 'Tất cả', getValue: () => undefined },
];

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(PRESETS[0].getValue());
  const [activePreset, setActivePreset] = useState<string>('Hôm nay');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any>([]);
  const [chartTab, setChartTab] = useState('overview');

  const [recentLeadsData, setRecentLeadsData] = useState<any[]>([]);

  // Pagination for Leads
  const [leadPage, setLeadPage] = useState(0);
  const leadsPerPage = 5;
  const totalLeadPages = Math.ceil(recentLeadsData.length / leadsPerPage) || 1;
  const currentLeads = recentLeadsData.slice(leadPage * leadsPerPage, (leadPage + 1) * leadsPerPage);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/dashboard');
      setStats(res.data.stats);
      setChartData(res.data.chartData);
      setRecentLeadsData(res.data.recentLeads || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const handlePresetClick = (preset: typeof PRESETS[0]) => {
    setActivePreset(preset.label);
    setDateRange(preset.getValue());
    setIsDatePickerOpen(false);
  };

  const handleCalendarSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    setActivePreset('');
  };

  const getDateRangeLabel = () => {
    if (activePreset) return activePreset;
    if (dateRange?.from) {
      if (!dateRange.to) return format(dateRange.from, 'dd/MM/yyyy');
      if (dateRange.to.getTime() === dateRange.from.getTime()) {
        return format(dateRange.from, 'dd/MM/yyyy');
      }
      return `${format(dateRange.from, 'dd/MM/yyyy')} - ${format(dateRange.to, 'dd/MM/yyyy')}`;
    }
    return 'Tất cả thời gian';
  };

  const MetricCard = ({ title, value, icon: Icon, trend, isPositive, baseColor }: any) => {
    const bgClass = baseColor === 'blue' ? 'bg-[#5865f2]/10 text-[#5865f2]' : 
                    baseColor === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                    baseColor === 'rose' ? 'bg-rose-50 text-rose-600' :
                    'bg-amber-50 text-amber-600';
    
    return (
      <div className="relative overflow-hidden rounded-[12px] bg-white border border-gray-200 p-5 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center ${bgClass}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-medium ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-normal text-gray-500 mb-1">{title}</h3>
          <p className="text-2xl font-medium text-gray-900">{isLoading ? '...' : value}</p>
        </div>
      </div>
    );
  };

  const SubMetricCard = ({ title, icon: Icon, data, baseColor }: any) => {
    const bgClass = baseColor === 'blue' ? 'bg-[#5865f2]/10 text-[#5865f2]' : 
                    baseColor === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                    'bg-amber-50 text-amber-600';

    return (
      <div className="bg-white rounded-[12px] p-5 border border-gray-200 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0 ${bgClass}`}>
            <Icon className="w-4 h-4" />
          </div>
          <h4 className="text-[14px] font-medium text-gray-900">{title}</h4>
        </div>
        
        <div className="flex-1 flex flex-col gap-4">
          {data.map((item: any, i: number) => {
            const ItemIcon = item.icon;
            return (
              <div key={i} className="flex justify-between items-center group/item p-1 -mx-1 rounded hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded flex items-center justify-center bg-gray-50 border border-gray-100">
                    <ItemIcon className={`w-3.5 h-3.5 ${item.iconColor}`} />
                  </div>
                  <span className="text-[13px] font-normal text-gray-600">{item.label}</span>
                </div>
                <span className="text-[14px] font-medium text-gray-900">{isLoading ? '-' : item.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Dynamic Pie Chart Data based on actual stats
  const pieData = [
    { name: 'Chờ xử lý', value: stats?.pendingLeads || 0, color: '#f59e0b' },
    { name: 'Đang tư vấn', value: stats?.processingLeads || 0, color: '#3b82f6' },
    { name: 'Hoàn thành', value: (stats?.totalLeads || 0) - (stats?.pendingLeads || 0) - (stats?.processingLeads || 0), color: '#10b981' }
  ].filter(d => d.value > 0);
  
  // Fallback if empty
  if (pieData.length === 0) {
    pieData.push({ name: 'Chưa có', value: 1, color: '#e5e7eb' });
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[calc(100vh-64px)] pb-8 bg-gray-50/50">

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-medium text-gray-900">Tổng quan Hệ sinh thái</h2>
          <p className="text-sm font-normal text-gray-500 mt-1">Theo dõi các chỉ số quan trọng và hiệu suất hoạt động.</p>
        </div>
        
        {/* Modern Date Picker */}
        <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
          <PopoverTrigger className="flex items-center gap-2 px-3 h-9 bg-white border border-gray-200 rounded-[8px] text-sm font-normal text-gray-700 hover:bg-gray-50 transition-all focus:outline-none focus:ring-[2px] focus:ring-[#5865f2]/20 shadow-sm cursor-pointer">
            <CalendarDays className="w-4 h-4 text-gray-500" />
            <span className="min-w-[120px] text-left">{getDateRangeLabel()}</span>
            {dateRange?.from && (
              <span className="p-1 hover:bg-gray-100 rounded transition-colors ml-1" onClick={(e) => { e.stopPropagation(); setDateRange(undefined); }}>
                <X className="w-3.5 h-3.5 text-gray-400" />
              </span>
            )}
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-0 bg-white border border-gray-200 shadow-lg rounded-[8px] overflow-hidden">
            <div className="flex">
              <div className="flex flex-col p-2 border-r border-gray-100 min-w-[140px] bg-gray-50/50">
                <p className="text-[11px] font-medium text-gray-500 mb-2 px-2 mt-1">Lọc nhanh</p>
                {PRESETS.map((preset) => {
                  const isActive = activePreset === preset.label || (preset.label === 'Tất cả' && !dateRange?.from && !activePreset);
                  return (
                    <button
                      key={preset.label}
                      onClick={() => handlePresetClick(preset)}
                      className={`text-left px-3 py-2 rounded text-sm transition-all cursor-pointer mb-0.5 ${isActive ? 'bg-[#5865f2]/10 text-[#5865f2] font-medium' : 'text-gray-600 hover:bg-gray-100 font-normal'}`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
              <Calendar mode="range" selected={dateRange} onSelect={handleCalendarSelect} numberOfMonths={2} className="p-3" locale={vi} />
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard title="Đơn vị Đối tác" value={stats?.totalUnits || 0} icon={Building2} trend="+12% tháng trước" isPositive={true} baseColor="blue" />
        <MetricCard title="Yêu cầu Tư vấn" value={stats?.totalLeads || 0} icon={MessageSquare} trend="+24% tháng trước" isPositive={true} baseColor="emerald" />
        <MetricCard title="Gói Giám sát" value={stats?.totalSupervisions || 0} icon={ShieldCheck} trend="-5% tháng trước" isPositive={false} baseColor="rose" />
        <MetricCard title="Hệ thống Nội dung" value={stats?.totalArticles || 0} icon={Newspaper} trend="+8% tháng trước" isPositive={true} baseColor="amber" />
      </div>

      {/* Sub Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <SubMetricCard 
          title="Chi tiết Đơn vị Đối tác" icon={Building2} baseColor="blue"
          data={[
            {label: 'Đang hoạt động', value: stats?.activeUnits || 0, icon: CheckCircle2, iconColor: 'text-[#5865f2]'}, 
            {label: 'Chờ xét duyệt', value: stats?.pendingUnits || 0, icon: Clock, iconColor: 'text-amber-500'}, 
            {label: 'Đang ẩn', value: stats?.hiddenUnits || 0, icon: EyeOff, iconColor: 'text-gray-400'}
          ]} 
        />
        <SubMetricCard 
          title="Chi tiết Yêu cầu Tư vấn" icon={MessageSquare} baseColor="emerald"
          data={[
            {label: 'Chờ xử lý', value: stats?.pendingLeads || 0, icon: Activity, iconColor: 'text-blue-500'}, 
            {label: 'Đang tư vấn', value: stats?.processingLeads || 0, icon: TrendingUp, iconColor: 'text-emerald-500'}, 
            {label: 'Hôm nay', value: stats?.leadsToday || 0, icon: CalendarDays, iconColor: 'text-emerald-500'}
          ]} 
        />
        <SubMetricCard 
          title="Chi tiết Hệ thống Nội dung" icon={FileText} baseColor="amber"
          data={[
            {label: 'Bài viết Publish', value: `${stats?.publishedArticles || 0} / ${stats?.totalArticles || 0}`, icon: Newspaper, iconColor: 'text-orange-500'}, 
            {label: 'Trang SEO Index', value: stats?.indexedSeoPages || 0, icon: Globe, iconColor: 'text-emerald-500'}
          ]} 
        />
      </div>

      {/* Main Content Grid: Chart & Right Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left Area: Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-[12px] border border-gray-200 p-5 flex flex-col h-[400px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-base font-medium text-gray-900">Biểu đồ Tăng trưởng</h3>
              <p className="text-[13px] font-normal text-gray-500 mt-0.5">So sánh lượng Yêu cầu và Giám sát theo thời gian.</p>
            </div>
            <div className="flex bg-gray-50 p-1 rounded-md border border-gray-100">
              <button onClick={() => setChartTab('overview')} className={`px-3 py-1 rounded text-xs font-medium transition-all cursor-pointer ${chartTab === 'overview' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
                Tổng quan
              </button>
              <button onClick={() => setChartTab('leads')} className={`px-3 py-1 rounded text-xs font-medium transition-all cursor-pointer ${chartTab === 'leads' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
                Yêu cầu
              </button>
            </div>
          </div>

          <div className="flex-1 w-full relative min-h-0 min-w-0">
            {!isLoading && (!Array.isArray(chartData) || chartData.length === 0) ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 border border-gray-100">
                  <BarChart2 className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-700">Chưa có dữ liệu biểu đồ</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSupervisions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5865f2" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#5865f2" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 400 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 400 }} width={40} />
                  <RechartsTooltip 
                    cursor={{ stroke: '#e5e7eb', strokeWidth: 1, strokeDasharray: '4 4' }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-lg min-w-[150px]">
                            <p className="text-[11px] font-medium text-gray-500 mb-2">{label}</p>
                            <div className="space-y-2">
                              {payload.map((entry: any, index: number) => (
                                <div key={index} className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                                    <span className="text-[13px] font-normal text-gray-600">{entry.name === 'leads' ? 'Yêu cầu' : 'Giám sát'}</span>
                                  </div>
                                  <span className="text-[13px] font-medium text-gray-900">{entry.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {(chartTab === 'overview' || chartTab === 'leads') && (
                    <Area type="monotone" dataKey="leads" name="leads" stroke="#10b981" strokeWidth={2} fill="url(#colorLeads)" activeDot={{ r: 4, strokeWidth: 0, fill: '#10b981' }} />
                  )}
                  {(chartTab === 'overview' || chartTab === 'supervisions') && (
                    <Area type="monotone" dataKey="supervisions" name="supervisions" stroke="#5865f2" strokeWidth={2} fill="url(#colorSupervisions)" activeDot={{ r: 4, strokeWidth: 0, fill: '#5865f2' }} />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Right Area: Pie Chart & Recent Leads */}
        <div className="flex flex-col gap-5 h-[400px]">
          
          {/* Pie Chart */}
          <div className="bg-white rounded-[12px] border border-gray-200 p-5 flex flex-col flex-shrink-0 h-[190px]">
            <h3 className="text-[14px] font-medium text-gray-900 mb-1">Tỷ lệ Trạng thái Yêu cầu</h3>
            <div className="flex-1 flex items-center min-h-0 relative">
              <div className="w-1/2 h-full relative min-h-0 min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={55}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white px-2 py-1.5 rounded border border-gray-200 shadow-md text-xs font-medium text-gray-800 z-50">
                              {payload[0].name}: {payload[0].value}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Total overlay in center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-lg font-medium text-gray-900">{stats?.totalLeads || 0}</span>
                </div>
              </div>
              
              {/* Custom Legend */}
              <div className="w-1/2 flex flex-col justify-center gap-2 pl-3 border-l border-gray-100">
                {pieData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }}></span>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-normal text-gray-500">{item.name}</span>
                      <span className="text-[12px] font-medium text-gray-900">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Paginated Recent Leads */}
          <div className="bg-white rounded-[12px] border border-gray-200 flex flex-col flex-1 min-h-0 overflow-hidden relative">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
              <h3 className="text-[14px] font-medium text-gray-900">Yêu cầu mới nhất</h3>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setLeadPage(p => Math.max(0, p - 1))}
                  disabled={leadPage === 0}
                  className="w-6 h-6 flex items-center justify-center rounded bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-40 transition-colors cursor-pointer border border-gray-100"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-normal text-gray-500 w-6 text-center">{leadPage + 1}/{totalLeadPages}</span>
                <button 
                  onClick={() => setLeadPage(p => Math.min(totalLeadPages - 1, p + 1))}
                  disabled={leadPage === totalLeadPages - 1}
                  className="w-6 h-6 flex items-center justify-center rounded bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-40 transition-colors cursor-pointer border border-gray-100"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-1.5">
              <div className="flex flex-col gap-0.5">
                {isLoading ? (
                  [1, 2, 3].map(i => (
                    <div key={i} className="p-2.5 rounded-lg border border-gray-50 animate-pulse flex gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-2.5 bg-gray-100 rounded w-1/2"></div>
                        <div className="h-2 bg-gray-100 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))
                ) : currentLeads.length === 0 ? (
                  <div className="py-8 flex flex-col items-center justify-center text-gray-400">
                    <Clock className="w-8 h-8 mb-2 opacity-30" />
                    <p className="text-[13px] font-normal">Không có yêu cầu nào mới</p>
                  </div>
                ) : (
                  currentLeads.map((lead) => (
                    <div key={lead.id} className="p-2.5 rounded-lg hover:bg-gray-50 transition-colors flex gap-2.5 items-center cursor-pointer border border-transparent">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-medium text-sm shrink-0 border border-blue-100">
                        {lead.customerName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <h4 className="text-[13px] font-medium text-gray-900 truncate pr-2">{lead.customerName}</h4>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded flex-shrink-0 font-medium ${
                            lead.status === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                            lead.status === 'PROCESSING' ? 'bg-blue-50 text-blue-600' :
                            'bg-emerald-50 text-emerald-600'
                          }`}>
                            {lead.status === 'PENDING' ? 'Chờ xử lý' : lead.status === 'PROCESSING' ? 'Đang tư vấn' : 'Hoàn thành'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-[12px] font-normal text-gray-500 truncate">
                            {lead.projectType} • {lead.location}
                          </p>
                          <p className="text-[11px] font-normal text-gray-400 whitespace-nowrap ml-2">
                            {format(new Date(lead.createdAt), 'dd/MM')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
