import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants, Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  yearRange?: { from: number; to: number };
  minDate?: Date;
  maxDate?: Date;
  useAdvancedSelector?: boolean;
};

// 생년월일용 간단한 연도/월 선택 컴포넌트 (원래 드롭다운 방식)
function SimpleDateSelector({ 
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
  yearRange,
  minDate,
  maxDate
}: { 
  selectedYear: number;
  selectedMonth: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  yearRange?: { from: number; to: number };
  minDate?: Date;
  maxDate?: Date;
}) {
  const months = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  // 날짜 범위 기반으로 연도 범위 계산
  const getYearRange = () => {
    if (yearRange) return yearRange;
    
    const minYear = minDate ? minDate.getFullYear() : new Date().getFullYear() - 50;
    const maxYear = maxDate ? maxDate.getFullYear() : new Date().getFullYear() + 50;
    
    return { from: minYear, to: maxYear };
  };
  
  const range = getYearRange();
  const years = Array.from(
    { length: range.to - range.from + 1 }, 
    (_, i) => range.from + i
  ).reverse(); // 최신 연도부터

  const handleMonthChange = (monthIndex: string) => {
    onMonthChange(parseInt(monthIndex));
  };

  const handleYearChange = (year: string) => {
    onYearChange(parseInt(year));
  };

  return (
    <div className="flex justify-center items-center gap-2 py-2">
      <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
        <SelectTrigger className="w-auto h-8 px-2 text-sm font-medium border-none shadow-none hover:bg-accent">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-72">
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}년
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={selectedMonth.toString()} onValueChange={handleMonthChange}>
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

// 희망날짜용 고급 연도/월 선택 컴포넌트 (카드 방식)
function AdvancedYearMonthSelector({ 
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
  yearRange,
  minDate,
  maxDate
}: { 
  selectedYear: number;
  selectedMonth: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  yearRange?: { from: number; to: number };
  minDate?: Date;
  maxDate?: Date;
}) {
  const [showDecades, setShowDecades] = React.useState(true);
  const [selectedDecade, setSelectedDecade] = React.useState<number | null>(null);
  const [showMonths, setShowMonths] = React.useState(false);
  const [tempSelectedYear, setTempSelectedYear] = React.useState<number | null>(null);

  const months = [
    { value: 0, label: "1월" }, { value: 1, label: "2월" }, { value: 2, label: "3월" },
    { value: 3, label: "4월" }, { value: 4, label: "5월" }, { value: 5, label: "6월" },
    { value: 6, label: "7월" }, { value: 7, label: "8월" }, { value: 8, label: "9월" },
    { value: 9, label: "10월" }, { value: 10, label: "11월" }, { value: 11, label: "12월" }
  ];

  // 날짜 범위 기반으로 연도 범위 계산
  const getYearRange = () => {
    if (yearRange) return yearRange;
    
    const minYear = minDate ? minDate.getFullYear() : new Date().getFullYear() - 50;
    const maxYear = maxDate ? maxDate.getFullYear() : new Date().getFullYear() + 50;
    
    return { from: minYear, to: maxYear };
  };
  
  const range = getYearRange();
  
  // 10년 단위 생성
  const decades = [];
  for (let year = Math.floor(range.from / 10) * 10; year <= range.to; year += 10) {
    decades.push(year);
  }
  decades.reverse(); // 최신 연도부터

  const handleDecadeClick = (decade: number) => {
    setSelectedDecade(decade);
    setShowDecades(false);
  };

  const handleYearClick = (year: number) => {
    setTempSelectedYear(year);
    setShowMonths(true);
    setShowDecades(false);
    setSelectedDecade(null);
  };

  const handleMonthClick = (month: number) => {
    if (tempSelectedYear) {
      onYearChange(tempSelectedYear);
      onMonthChange(month);
    }
    // 모든 상태 초기화
    setShowDecades(true);
    setShowMonths(false);
    setSelectedDecade(null);
    setTempSelectedYear(null);
  };

  const handleBackToDecades = () => {
    setShowDecades(true);
    setShowMonths(false);
    setSelectedDecade(null);
    setTempSelectedYear(null);
  };

  const handleBackToYears = () => {
    setShowMonths(false);
    setShowDecades(false);
    // selectedDecade 유지
  };

  // 월 선택 화면
  if (showMonths) {
    return (
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 px-2 text-sm font-medium border-none shadow-none hover:bg-accent"
          >
            {selectedYear}년 {selectedMonth + 1}월
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToYears}
              className="text-xs"
            >
              ← 뒤로
            </Button>
            <div className="text-sm font-medium">{tempSelectedYear}년</div>
            <div className="w-12"></div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {months.map((month) => {
              // 월이 선택 가능한 범위 내에 있는지 확인
              const monthDate = new Date(tempSelectedYear!, month.value, 1);
              const isDisabled = 
                (minDate && monthDate < new Date(minDate.getFullYear(), minDate.getMonth(), 1)) ||
                (maxDate && monthDate > new Date(maxDate.getFullYear(), maxDate.getMonth(), 1));
              
              return (
                <Button
                  key={month.value}
                  variant={month.value === selectedMonth && tempSelectedYear === selectedYear ? "default" : "outline"}
                  size="sm"
                  onClick={() => !isDisabled && handleMonthClick(month.value)}
                  disabled={isDisabled}
                  className={`h-8 text-xs ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {month.label}
                </Button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  if (showDecades) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 px-2 text-sm font-medium border-none shadow-none hover:bg-accent"
          >
            {selectedYear}년 {selectedMonth + 1}월
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <div className="text-sm font-medium mb-3 text-center">연도 선택</div>
          <div 
            className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400"
            style={{ scrollbarWidth: 'thin' }}
            onWheel={(e) => {
              e.currentTarget.scrollTop += e.deltaY;
            }}
          >
            {decades.map((decade) => {
              const endYear = Math.min(decade + 9, range.to);
              return (
                <div
                  key={decade}
                  onClick={() => handleDecadeClick(decade)}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-accent hover:border-accent-foreground/20 transition-colors text-center"
                >
                  <div className="font-medium">{decade}년대</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {decade} - {endYear}
                  </div>
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  // 선택된 연대의 개별 연도들 표시
  const startYear = selectedDecade!;
  const endYear = Math.min(startYear + 9, range.to);
  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }

  return (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 px-2 text-sm font-medium border-none shadow-none hover:bg-accent"
        >
          {selectedYear}년 {selectedMonth + 1}월
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToDecades}
            className="text-xs"
          >
            ← 뒤로
          </Button>
          <div className="text-sm font-medium">{startYear}년대</div>
          <div className="w-12"></div>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {years.map((year) => {
            // 연도가 선택 가능한 범위 내에 있는지 확인
            const isDisabled = 
              (minDate && year < minDate.getFullYear()) ||
              (maxDate && year > maxDate.getFullYear());
            
            return (
              <Button
                key={year}
                variant={year === selectedYear ? "default" : "outline"}
                size="sm"
                onClick={() => !isDisabled && handleYearClick(year)}
                disabled={isDisabled}
                className={`h-8 text-xs ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {year}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// 월과 년도 선택을 위한 커스텀 Caption 컴포넌트
function CustomCaption({ 
  displayMonth, 
  onMonthChange, 
  yearRange,
  minDate,
  maxDate,
  useAdvancedSelector = false
}: { 
  displayMonth: Date; 
  onMonthChange: (month: Date) => void;
  yearRange?: { from: number; to: number };
  minDate?: Date;
  maxDate?: Date;
  useAdvancedSelector?: boolean;
}) {
  const handleYearChange = (year: number) => {
    const newDate = new Date(displayMonth);
    newDate.setFullYear(year);
    onMonthChange(newDate);
  };

  const handleMonthChange = (month: number) => {
    const newDate = new Date(displayMonth);
    newDate.setMonth(month);
    onMonthChange(newDate);
  };

  const handlePreviousMonth = () => {
    const newDate = new Date(displayMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    
    // minDate 확인
    if (minDate && newDate < minDate) return;
    
    onMonthChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(displayMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    
    // maxDate 확인
    if (maxDate && newDate > maxDate) return;
    
    onMonthChange(newDate);
  };

  const isPreviousDisabled = minDate && 
    new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1, 1) < 
    new Date(minDate.getFullYear(), minDate.getMonth(), 1);

  const isNextDisabled = maxDate && 
    new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 1) > 
    new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

  // 생년월일용 간단한 드롭다운 방식
  if (!useAdvancedSelector) {
    return (
      <SimpleDateSelector
        selectedYear={displayMonth.getFullYear()}
        selectedMonth={displayMonth.getMonth()}
        onYearChange={handleYearChange}
        onMonthChange={handleMonthChange}
        yearRange={yearRange}
        minDate={minDate}
        maxDate={maxDate}
      />
    );
  }

  // 희망날짜용 고급 카드 방식 + 화살표 네비게이션
  return (
    <div className="flex justify-between items-center py-2 px-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handlePreviousMonth}
        disabled={isPreviousDisabled}
        className="h-7 w-7 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <AdvancedYearMonthSelector
        selectedYear={displayMonth.getFullYear()}
        selectedMonth={displayMonth.getMonth()}
        onYearChange={handleYearChange}
        onMonthChange={handleMonthChange}
        yearRange={yearRange}
        minDate={minDate}
        maxDate={maxDate}
      />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleNextMonth}
        disabled={isNextDisabled}
        className="h-7 w-7 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  yearRange,
  minDate,
  maxDate,
  useAdvancedSelector = false,
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
            yearRange={yearRange}
            minDate={minDate}
            maxDate={maxDate}
            useAdvancedSelector={useAdvancedSelector}
          />
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
