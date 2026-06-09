import { useState, useEffect, useMemo, useRef } from "react";
import { z } from "zod";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { format } from "date-fns";
import {
    FileText,
    User,
    Phone,
    CreditCard,
    MapPin,
    Box,
    Hash,
    DollarSign,
    Percent,
    Calendar,
    X,
    Smartphone,
    Laptop,
    Car,
    Gem,
    Package,
    Printer,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import {
    openPrintReceipt,
    numberToVietnameseWords,
} from "@/utils/printReceipt";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/ui/image-uploader";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const receiptSchema = z.object({
    customerFullName: z
        .string()
        .min(1, "Vui lòng nhập họ tên"),
    customerPhone: z
        .string()
        .min(10, "SĐT không hợp lệ"),
    customerCitizenId: z.string().optional(),
    customerAddress: z.string().optional(),
    itemName: z
        .string()
        .min(1, "Vui lòng nhập tên tài sản"),
    itemCategory: z
        .string()
        .min(1, "Vui lòng chọn loại tài sản"),
    quantity: z.coerce
        .number()
        .min(1, "Số lượng tối thiểu là 1"),
    itemValue: z.coerce
        .number()
        .min(1000, "Định giá phải lớn hơn 1,000 VNĐ"),
    pawnAmount: z.coerce
        .number()
        .min(1000, "Tiền cầm phải lớn hơn 1,000 VNĐ"),
    interestRate: z.coerce
        .number()
        .min(0, "Lãi suất không được âm"),
    pawnDate: z
        .string()
        .min(1, "Chọn ngày giải ngân"),
    dueDate: z
        .string()
        .min(1, "Chọn ngày hết hạn"),
    notes: z.string().optional(),
});

type ReceiptFormValues = z.infer<typeof receiptSchema>;

interface CreateReceiptDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateReceiptDrawer({
    isOpen,
    onClose,
    onSuccess,
}: CreateReceiptDrawerProps) {
    const token = useAuthStore((state) => state.token);
    const [images, setImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [printAfterCreate, setPrintAfterCreate] = useState(true);
    const [error, setError] = useState("");

    // Customer autocomplete state
    const [customers, setCustomers] = useState<any[]>([]);
    const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
    const customerDropdownRef = useRef<HTMLDivElement>(null);

    const formatCurrency = (val: string | number) => {
        if (!val) return "";
        const num = String(val).replace(/[^0-9]/g, "");
        return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        formState: { errors },
    } = useForm<ReceiptFormValues>({
        resolver: zodResolver(receiptSchema) as any,
        defaultValues: {
            pawnDate: format(new Date(), "yyyy-MM-dd"),
            dueDate: format(
                new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                "yyyy-MM-dd",
            ),
            interestRate: 3.0,
            quantity: 1,
        },
    });

    const customerFullNameValue = useWatch({ control, name: "customerFullName" });
    const pawnAmountValue = useWatch({ control, name: "pawnAmount" });

    useEffect(() => {
        if (isOpen && token) {
            axios
                .get(`${(import.meta.env.VITE_API_URL || 'http://localhost:3001')}/api/v1/customers`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => setCustomers(res.data.data || []))
                .catch(() => { });
        }
    }, [isOpen, token]);

    const filteredCustomers = useMemo(() => {
        if (!customerFullNameValue) return customers;
        return customers.filter((c) =>
            c.fullName.toLowerCase().includes(customerFullNameValue.toLowerCase()),
        );
    }, [customers, customerFullNameValue]);

    // Click outside to close custom dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                customerDropdownRef.current &&
                !customerDropdownRef.current.contains(event.target as Node)
            ) {
                setShowCustomerDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const onSubmit = async (data: ReceiptFormValues) => {
        try {
            setIsSubmitting(true);
            setError("");

            const payload = {
                ...data,
                customer: {
                    fullName: data.customerFullName,
                    phoneNumber: data.customerPhone,
                    citizenId: data.customerCitizenId,
                    address: data.customerAddress,
                },
                images,
            };

            const response = await axios.post(
                `${(import.meta.env.VITE_API_URL || 'http://localhost:3001')}/api/v1/pawn-receipts`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (printAfterCreate) {
                await axios.post(
                    `${(import.meta.env.VITE_API_URL || 'http://localhost:3001')}/api/v1/pawn-receipts/${response.data.id}/print`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                try {
                    const settingsRes = await axios.get(
                        `${(import.meta.env.VITE_API_URL || 'http://localhost:3001')}/api/v1/settings`,
                        { headers: { Authorization: `Bearer ${token}` } },
                    );
                    openPrintReceipt(response.data, settingsRes.data);
                } catch {
                    openPrintReceipt(response.data);
                }
            }

            reset();
            setImages([]);
            setPrintAfterCreate(false);
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || "Lỗi khi lưu hợp đồng cầm đồ.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    // Unified Light Blurple focus classes
    const focusClasses =
        "focus-visible:ring-[3px] focus-visible:ring-[#5865f2]/20 dark:focus-visible:ring-[#5865f2]/30 focus-visible:border-[#5865f2]/40 dark:focus-visible:border-[#5865f2]/50";
    const getErrorClass = (hasError: boolean) =>
        hasError
            ? "border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500 dark:border-red-500 dark:focus-visible:ring-red-500/30 bg-red-50/50 dark:bg-red-900/10"
            : `border-gray-200 dark:border-gray-700 ${focusClasses}`;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop overlay */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Slide-over Drawer Panel */}
            <div className="relative w-full max-w-lg h-full bg-white dark:bg-[#14151a] border-l border-gray-200 dark:border-gray-800 flex flex-col z-10 animate-slide-in shadow-none">
                {/* Header Drawer */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#14151a]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#5865f2]/10 flex items-center justify-center">
                            <FileText className="w-4 h-4 text-[#5865f2]" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
                                Tạo Hợp Đồng Mới
                            </h2>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Form Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
                        {error && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg text-red-600 dark:text-red-400 text-sm font-medium">
                                {error}
                            </div>
                        )}
                        {/* Customer Info Section */}
                        <div className="space-y-5">
                            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#5865f2]"></span>
                                Thông tin khách hàng
                            </h3>

                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-1.5" ref={customerDropdownRef}>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Họ tên khách hàng
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                            <User className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                        </div>
                                        <Input
                                            {...register("customerFullName")}
                                            onFocus={() => setShowCustomerDropdown(true)}
                                            className={`pl-9 bg-gray-50/50 dark:bg-[#1a1b23] ${getErrorClass(!!errors.customerFullName)} text-sm h-10 rounded-lg  text-gray-900 dark:text-white placeholder:text-gray-400 transition-all hover:bg-white dark:hover:bg-[#1a1b23] relative z-0`}
                                            placeholder="Nhập hoặc chọn khách..."
                                            autoComplete="off"
                                        />

                                        {/* Combobox Dropdown */}
                                        {showCustomerDropdown && filteredCustomers.length > 0 && (
                                            <div className="absolute z-50 top-[calc(100%+4px)] left-0 w-[150%] max-w-sm bg-white/80 dark:bg-[#1a1b23]/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-lg shadow-none overflow-hidden animate-in fade-in zoom-in-95">
                                                <div className="max-h-48 overflow-y-auto py-1">
                                                    {filteredCustomers.map((c) => (
                                                        <div
                                                            key={c.id}
                                                            className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-[#262930] cursor-pointer transition-colors"
                                                            onClick={() => {
                                                                setValue("customerFullName", c.fullName, {
                                                                    shouldValidate: true,
                                                                });
                                                                setValue("customerPhone", c.phoneNumber, {
                                                                    shouldValidate: true,
                                                                });
                                                                setValue(
                                                                    "customerCitizenId",
                                                                    c.citizenId || "",
                                                                    { shouldValidate: true },
                                                                );
                                                                setValue("customerAddress", c.address || "", {
                                                                    shouldValidate: true,
                                                                });
                                                                setShowCustomerDropdown(false);
                                                            }}
                                                        >
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {c.fullName}
                                                            </div>
                                                            <div className="text-xs text-gray-500 flex gap-2 mt-0.5">
                                                                <span>{c.phoneNumber}</span>
                                                                {c.citizenId && (
                                                                    <span>• CCCD: {c.citizenId}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {errors.customerFullName && (
                                        <p className="text-xs text-red-500 font-medium">
                                            {errors.customerFullName.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Số điện thoại
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                        </div>
                                        <Input
                                            {...register("customerPhone")}
                                            className={`pl-9 bg-gray-50/50 dark:bg-[#1a1b23] ${getErrorClass(!!errors.customerPhone)} text-sm h-10 rounded-lg  text-gray-900 dark:text-white placeholder:text-gray-400 transition-all hover:bg-white dark:hover:bg-[#1a1b23]`}
                                            placeholder="0987..."
                                        />
                                    </div>
                                    {errors.customerPhone && (
                                        <p className="text-xs text-red-500 font-medium">
                                            {errors.customerPhone.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Số CCCD
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <CreditCard className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                        </div>
                                        <Input
                                            {...register("customerCitizenId")}
                                            className={`pl-9 bg-gray-50/50 dark:bg-[#1a1b23] ${getErrorClass(!!errors.customerCitizenId)} text-sm h-10 rounded-lg  text-gray-900 dark:text-white placeholder:text-gray-400 transition-all hover:bg-white dark:hover:bg-[#1a1b23]`}
                                            placeholder="0010..."
                                        />
                                    </div>
                                    {errors.customerCitizenId && (
                                        <p className="text-xs text-red-500 font-medium">
                                            {errors.customerCitizenId.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Địa chỉ
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                        </div>
                                        <Input
                                            {...register("customerAddress")}
                                            className={`pl-9 bg-gray-50/50 dark:bg-[#1a1b23] ${getErrorClass(!!errors.customerAddress)} text-sm h-10 rounded-lg  text-gray-900 dark:text-white placeholder:text-gray-400 transition-all hover:bg-white dark:hover:bg-[#1a1b23]`}
                                            placeholder="Số 1, Lê Lợi..."
                                        />
                                    </div>
                                    {errors.customerAddress && (
                                        <p className="text-xs text-red-500 font-medium">
                                            {errors.customerAddress.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="h-px bg-gray-100 dark:bg-gray-800/60 -mx-6"></div>
                        {/* Asset Info Section */}
                        <div className="space-y-5">
                            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#43b581]"></span>
                                Thông tin tài sản & Khoản vay
                            </h3>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Tên vật phẩm cầm cố
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Box className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <Input
                                        {...register("itemName")}
                                        className={`pl-9 bg-gray-50/50 dark:bg-[#1a1b23] ${getErrorClass(!!errors.itemName)} text-sm h-10 rounded-lg  text-gray-900 dark:text-white placeholder:text-gray-400 transition-all hover:bg-white dark:hover:bg-[#1a1b23]`}
                                        placeholder="Laptop Dell XPS 13, iPhone 14 Pro Max..."
                                    />
                                </div>
                                {errors.itemName && (
                                    <p className="text-xs text-red-500 font-medium">
                                        {errors.itemName.message}
                                    </p>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-1.5 relative z-40">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Loại tài sản
                                    </label>
                                    <Controller
                                        control={control}
                                        name="itemCategory"
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value || undefined}
                                            >
                                                {" "}
                                                <SelectTrigger
                                                    className={`w-full h-10 bg-gray-50/50 dark:bg-[#1a1b23] border ${getErrorClass(!!errors.itemCategory)} rounded-lg text-sm transition-all focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 dark:focus:ring-[#5865f2]/30 focus:border-[#5865f2]/40 dark:focus:border-[#5865f2]/50 hover:bg-white dark:hover:bg-[#1a1b23] text-gray-900 dark:text-white`}
                                                >
                                                    <SelectValue placeholder="-- Chọn danh mục --">
                                                        {field.value === "PHONE"
                                                            ? "Điện thoại / SmartPhone"
                                                            : field.value === "LAPTOP"
                                                                ? "Máy tính xách tay / PC"
                                                                : field.value === "VEHICLE"
                                                                    ? "Xe máy / Ô tô"
                                                                    : field.value === "JEWELRY"
                                                                        ? "Vàng bạc / Trang sức"
                                                                        : field.value === "OTHER"
                                                                            ? "Danh mục khác"
                                                                            : "-- Chọn danh mục --"}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent className="bg-white/80 dark:bg-[#1a1b23]/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-lg shadow-none">
                                                    <SelectItem
                                                        className="hover:bg-gray-50 dark:hover:bg-[#262930] cursor-pointer"
                                                        value="PHONE"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Smartphone className="w-4 h-4 text-gray-500" />{" "}
                                                            Điện thoại / SmartPhone
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem
                                                        className="hover:bg-gray-50 dark:hover:bg-[#262930] cursor-pointer"
                                                        value="LAPTOP"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Laptop className="w-4 h-4 text-gray-500" /> Máy
                                                            tính xách tay / PC
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem
                                                        className="hover:bg-gray-50 dark:hover:bg-[#262930] cursor-pointer"
                                                        value="VEHICLE"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Car className="w-4 h-4 text-gray-500" /> Xe máy /
                                                            Ô tô
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem
                                                        className="hover:bg-gray-50 dark:hover:bg-[#262930] cursor-pointer"
                                                        value="JEWELRY"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Gem className="w-4 h-4 text-gray-500" /> Vàng bạc
                                                            / Trang sức
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem
                                                        className="hover:bg-gray-50 dark:hover:bg-[#262930] cursor-pointer"
                                                        value="OTHER"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Package className="w-4 h-4 text-gray-500" /> Danh
                                                            mục khác
                                                        </div>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.itemCategory && (
                                        <p className="text-xs text-red-500 font-medium">
                                            {errors.itemCategory.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5 relative z-30">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Số lượng
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Hash className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                        </div>
                                        <Input
                                            type="number"
                                            {...register("quantity")}
                                            className={`pl-9 bg-gray-50/50 dark:bg-[#1a1b23] ${getErrorClass(!!errors.quantity)} text-sm h-10 rounded-lg  text-gray-900 dark:text-white placeholder:text-gray-400 transition-all hover:bg-white dark:hover:bg-[#1a1b23]`}
                                        />
                                    </div>
                                    {errors.quantity && (
                                        <p className="text-xs text-red-500 font-medium">
                                            {errors.quantity.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-5 relative z-20">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Định giá (VNĐ)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <DollarSign className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                        </div>
                                        <Controller
                                            control={control}
                                            name="itemValue"
                                            render={({ field: { onChange, value, ref } }) => (
                                                <Input
                                                    type="text"
                                                    ref={ref}
                                                    value={value ? formatCurrency(value) : ""}
                                                    onChange={(e) => {
                                                        const raw = e.target.value.replace(/\./g, "");
                                                        if (raw === "" || /^\d+$/.test(raw)) {
                                                            onChange(raw === "" ? "" : Number(raw));
                                                        }
                                                    }}
                                                    className={`pl-9 bg-gray-50/50 dark:bg-[#1a1b23] ${getErrorClass(!!errors.itemValue)} text-sm h-10 rounded-lg  text-gray-900 dark:text-white transition-all hover:bg-white dark:hover:bg-[#1a1b23]`}
                                                    placeholder="20.000.000"
                                                />
                                            )}
                                        />
                                    </div>
                                    {errors.itemValue && (
                                        <p className="text-xs text-red-500 font-medium">
                                            {errors.itemValue.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Số tiền cầm (VNĐ)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <DollarSign className="h-4 w-4 text-[#5865f2]" />
                                        </div>
                                        <Controller
                                            control={control}
                                            name="pawnAmount"
                                            render={({ field: { onChange, value, ref } }) => (
                                                <Input
                                                    type="text"
                                                    ref={ref}
                                                    value={value ? formatCurrency(value) : ""}
                                                    onChange={(e) => {
                                                        const raw = e.target.value.replace(/\./g, "");
                                                        if (raw === "" || /^\d+$/.test(raw)) {
                                                            onChange(raw === "" ? "" : Number(raw));
                                                        }
                                                    }}
                                                    className={`pl-9 bg-[#5865f2]/5 border-[#5865f2]/20 dark:bg-[#5865f2]/10 dark:border-[#5865f2]/30 text-sm h-10 rounded-lg ${focusClasses} text-gray-900 dark:text-white transition-all font-semibold`}
                                                    placeholder="15.000.000"
                                                />
                                            )}
                                        />{" "}
                                    </div>{" "}
                                    {errors.pawnAmount && (
                                        <p className="text-xs text-red-500 font-medium">
                                            {errors.pawnAmount.message}
                                        </p>
                                    )}{" "}
                                    {numberToVietnameseWords(pawnAmountValue) && (
                                        <p className="text-xs font-medium text-[#5865f2] dark:text-[#8ea1ff] leading-relaxed">
                                            {" "}
                                            Bằng chữ: {numberToVietnameseWords(pawnAmountValue)}{" "}
                                        </p>
                                    )}{" "}
                                </div>{" "}
                            </div>{" "}
                            <div className="space-y-1.5 relative z-10">
                                {" "}
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Lãi suất (% / Tháng)
                                </label>{" "}
                                <div className="relative">
                                    {" "}
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        {" "}
                                        <Percent className="h-4 w-4 text-gray-400 dark:text-gray-500" />{" "}
                                    </div>{" "}
                                    <Input
                                        type="number"
                                        step="0.1"
                                        {...register("interestRate")}
                                        className={`pl-9 bg-gray-50/50 dark:bg-[#1a1b23] ${getErrorClass(!!errors.pawnAmount)} text-sm h-10 rounded-lg  text-gray-900 dark:text-white transition-all hover:bg-white dark:hover:bg-[#1a1b23]`}
                                        placeholder="3.0"
                                    />{" "}
                                </div>{" "}
                                {errors.interestRate && (
                                    <p className="text-xs text-red-500 font-medium">
                                        {errors.interestRate.message}
                                    </p>
                                )}{" "}
                            </div>{" "}
                            <div className="grid grid-cols-2 gap-5">
                                {" "}
                                <div className="space-y-1.5">
                                    {" "}
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Ngày giải ngân
                                    </label>{" "}
                                    <div className="relative">
                                        {" "}
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            {" "}
                                            <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />{" "}
                                        </div>{" "}
                                        <Input
                                            type="date"
                                            {...register("pawnDate")}
                                            className={`pl-10 bg-gray-50/50 dark:bg-[#1a1b23] ${getErrorClass(!!errors.interestRate)} text-sm h-10 rounded-lg  text-gray-900 dark:text-white [color-scheme:light] dark:[color-scheme:dark] transition-all hover:bg-white dark:hover:bg-[#1a1b23]`}
                                        />{" "}
                                    </div>{" "}
                                    {errors.pawnDate && (
                                        <p className="text-xs text-red-500 font-medium">
                                            {errors.pawnDate.message}
                                        </p>
                                    )}{" "}
                                </div>{" "}
                                <div className="space-y-1.5">
                                    {" "}
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Ngày hết hạn
                                    </label>{" "}
                                    <div className="relative">
                                        {" "}
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            {" "}
                                            <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />{" "}
                                        </div>{" "}
                                        <Input
                                            type="date"
                                            {...register("dueDate")}
                                            className={`pl-10 bg-gray-50/50 dark:bg-[#1a1b23] ${getErrorClass(!!errors.pawnDate)} text-sm h-10 rounded-lg  text-gray-900 dark:text-white [color-scheme:light] dark:[color-scheme:dark] transition-all hover:bg-white dark:hover:bg-[#1a1b23]`}
                                        />{" "}
                                    </div>{" "}
                                    {errors.dueDate && (
                                        <p className="text-xs text-red-500 font-medium">
                                            {errors.dueDate.message}
                                        </p>
                                    )}{" "}
                                </div>{" "}
                            </div>{" "}
                        </div>{" "}
                        <div className="h-px bg-gray-100 dark:bg-gray-800/60 -mx-6"></div>{" "}
                        {/* Photo attachment */}{" "}
                        <div className="space-y-3">
                            {" "}
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                Ảnh chụp tài sản thế chấp
                            </label>{" "}
                            <ImageUploader
                                onUploadSuccess={(urls) =>
                                    setImages((prev) => [...prev, ...urls])
                                }
                                maxFiles={3}
                            />{" "}
                        </div>{" "}
                        {/* Notes */}{" "}
                        <div className="space-y-1.5">
                            {" "}
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                Ghi chú thêm
                            </label>{" "}
                            <textarea
                                {...register("notes")}
                                rows={3}
                                className={`flex w-full rounded-lg border ${getErrorClass(!!errors.notes)} bg-gray-50/50 dark:bg-[#1a1b23] px-4 py-3 text-sm text-gray-900 dark:text-white outline-none placeholder:text-gray-400 transition-all resize-none hover:bg-white dark:hover:bg-[#1a1b23]`}
                                placeholder="Mô tả xước xát, lỗi thiết bị nếu có..."
                            />
                        </div>
                        <div className="pb-4"></div>
                    </form>
                </div>

                {/* Action Panel Footer */}
                <div className="h-20 flex items-center justify-end gap-3 px-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#14151a] shrink-0">
                    <label className="mr-auto flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={printAfterCreate}
                            onChange={(e) => setPrintAfterCreate(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 accent-[#5865f2]"
                        />
                        <Printer className="w-4 h-4 text-gray-400" />
                        In biên nhận sau khi tạo
                    </label>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1b23] hover:bg-gray-50 dark:hover:bg-[#262930] text-gray-700 dark:text-gray-200 text-sm h-10 px-5 cursor-pointer font-medium"
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="bg-[#5865f2] hover:bg-[#4752c4] text-white font-medium text-sm h-10 px-6 border-0 cursor-pointer disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Đang tạo..." : "Tạo hợp đồng"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
