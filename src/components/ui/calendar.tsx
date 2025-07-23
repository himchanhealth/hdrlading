import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

// 월과 년도 선택을 위한 커스텀 Caption 컴포넌트
function CustomCaption({ displayMonth, onMonthChange }: { displayMonth: Date; onMonthChange: (month: Date) => void }) {
  const months = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 50 + i);

  const handleMonthChange = (monthIndex: string) => {
    const newDate = new Date(displayMonth);
    newDate.setMonth(parseInt(monthIndex));
    onMonthChange(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = new Date(displayMonth);
    newDate.setFullYear(parseInt(year));
    onMonthChange(newDate);
  };

  return (
    <div className="flex justify-center items-center gap-2 py-2">
      <Select value={displayMonth.getFullYear().toString()} onValueChange={handleYearChange}>
        <SelectTrigger className="w-auto h-8 px-2 text-sm font-medium border-none shadow-none hover:bg-accent">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-48">
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}년
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={displayMonth.getMonth().toString()} onValueChange={handleMonthChange}>
        <SelectTrigger className="w-auto h-8 px-2 text-sm font-medium border-none shadow-none hover:bg-accent">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {months.map((month, index) => (
            <SelectItem key={index} value={index.toString()}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [month, setMonth] = React.useState<Date>(props.month || new Date());

  // month prop이 변경될 때 내부 상태 업데이트
  React.useEffect(() => {
    if (props.month) {
      setMonth(props.month);
    }
  }, [props.month]);

  const handleMonthChange = (newMonth: Date) => {
    setMonth(newMonth);
    props.onMonthChange?.(newMonth);
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      month={month}
      onMonthChange={handleMonthChange}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "hidden", // 기본 라벨 숨김
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
        Caption: ({ displayMonth }) => (
          <CustomCaption 
            displayMonth={displayMonth} 
            onMonthChange={handleMonthChange}
          />
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
