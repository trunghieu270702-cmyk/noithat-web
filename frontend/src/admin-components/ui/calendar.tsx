"use client";
import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/admin-lib/utils"
import { buttonVariants } from "@/admin-components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 relative text-gray-900 dark:text-gray-100", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        month_caption: "flex justify-center pt-1 items-center",
        caption_label: "text-sm font-medium text-gray-900 dark:text-gray-100",
        nav: "space-x-1 flex items-center",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-white dark:bg-[#1a1b23] p-0 opacity-50 hover:opacity-100 absolute left-3 top-4 z-10 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-white dark:bg-[#1a1b23] p-0 opacity-50 hover:opacity-100 absolute right-3 top-4 z-10 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
        ),
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday:
          "text-gray-500 dark:text-gray-400 rounded-[4px] w-8 font-normal text-[0.8rem]",
        week: "flex w-full mt-2",
        day: "h-8 w-8 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-100/50 dark:[&:has([aria-selected].day-outside)]:bg-[#14151a]/50 [&:has([aria-selected])]:bg-[#5865f2]/10 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 text-gray-900 dark:text-gray-100",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800"
        ),
        range_end: "day-range-end",
        selected:
          "bg-[#5865f2] text-white hover:bg-[#5865f2] hover:text-white focus:bg-[#5865f2] focus:text-white",
        today: "bg-gray-100 dark:bg-gray-800 text-[#5865f2] font-medium",
        outside:
          "day-outside text-gray-400 dark:text-gray-600 opacity-50 aria-selected:bg-[#5865f2]/10 aria-selected:text-gray-500 aria-selected:opacity-30",
        disabled: "text-gray-400 dark:text-gray-600 opacity-50",
        range_middle:
          "aria-selected:bg-[#5865f2]/10 aria-selected:text-[#5865f2]",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ ...props }) => {
          if (props.orientation === 'left') {
            return <ChevronLeft className="h-4 w-4" />
          }
          return <ChevronRight className="h-4 w-4" />
        }
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
